import type { Dirent } from 'node:fs'
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'

import type { Plugin } from 'vite-plus'

import {
  ASSET_API,
  ASSET_MAX_BYTES,
  ASSETS_CHANGED_EVENT,
  ASSETS_DIR,
  type AssetEntry,
  type AssetUsage,
  assetImportPath,
  assetKind,
  findAssetReferences,
  mimeForFilename,
  normalizeAssetName,
  rewriteAssetReferences,
  validateAssetName,
} from './asset-files'

/**
 * Dev-only REST API over the global `assets/` folder (modelled on open-slide's
 * `/__assets` routes). The folder is the only source of truth: no manifest,
 * every field comes from `fs.stat`, and "used by" is a live scan of `src/`.
 *
 *   GET    /__assets              list  → { assets: AssetEntry[] }
 *   GET    /__assets/<file>       raw bytes (thumbnails, previews)
 *   POST   /__assets/<file>       upload raw body; 409 if it exists unless ?overwrite=1
 *   PATCH  /__assets/<file>       rename { name }; rewrites `@assets/<old>` imports in src/
 *   DELETE /__assets/<file>       409 { usages } while anything still imports it
 */

type Next = (error?: unknown) => void
export type AssetLibraryHandler = (req: IncomingMessage, res: ServerResponse, next: Next) => void

const SOURCE_DIR = 'src'
const SOURCE_FILE = /\.(ts|tsx)$/
const JSON_BODY_LIMIT = 64 * 1024

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: Record<string, unknown> = {},
  ) {
    super(message)
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

function header(req: IncomingMessage, name: string): string | null {
  const raw = req.headers[name]
  return (Array.isArray(raw) ? raw[0] : raw)?.split(',')[0]?.trim() || null
}

/**
 * Blocks cross-site writes (a page on another origin POSTing to the dev
 * server). Requests without an Origin header (curl, tests) pass.
 */
function assertSameOrigin(req: IncomingMessage): void {
  if (header(req, 'sec-fetch-site')?.toLowerCase() === 'cross-site') {
    throw new HttpError(403, 'cross-site request blocked')
  }
  const origin = header(req, 'origin')
  if (!origin) return
  let actual: string
  try {
    const url = new URL(origin)
    actual = `${url.protocol}//${url.host}`.toLowerCase()
  } catch {
    throw new HttpError(403, 'invalid origin header')
  }
  const host = header(req, 'x-forwarded-host') ?? header(req, 'host')
  const proto =
    header(req, 'x-forwarded-proto')?.toLowerCase() ??
    ('encrypted' in req.socket && req.socket.encrypted ? 'https' : 'http')
  if (!host || actual !== `${proto}://${host}`.toLowerCase()) {
    throw new HttpError(403, 'origin mismatch')
  }
}

async function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  const declared = Number(req.headers['content-length'])
  if (Number.isFinite(declared) && declared > limit) {
    req.resume()
    throw new HttpError(413, `file is larger than ${Math.round(limit / 1024 / 1024)} MB`)
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let total = 0
    let oversized = false
    req.on('data', (chunk: Buffer) => {
      total += chunk.length
      if (total > limit) oversized = true
      // Keep draining so the client gets a 413 instead of a reset socket.
      if (!oversized) chunks.push(chunk)
    })
    req.on('end', () => {
      if (oversized) {
        reject(new HttpError(413, `file is larger than ${Math.round(limit / 1024 / 1024)} MB`))
      } else {
        resolve(Buffer.concat(chunks))
      }
    })
    req.on('error', reject)
  })
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (!header(req, 'content-type')?.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'content-type must be application/json')
  }
  try {
    const value: unknown = JSON.parse((await readBody(req, JSON_BODY_LIMIT)).toString('utf8'))
    if (value && typeof value === 'object') return value as Record<string, unknown>
  } catch (error) {
    if (error instanceof HttpError) throw error
  }
  throw new HttpError(400, 'invalid JSON body')
}

async function exists(file: string): Promise<boolean> {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

/** Write via temp file + rename so Vite never reads a half-written file. */
async function writeAtomic(file: string, data: string | Buffer): Promise<void> {
  const tmp = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`)
  await writeFile(tmp, data)
  await rename(tmp, file)
}

async function listSourceFiles(dir: string): Promise<string[]> {
  let entries: Dirent[]
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') return []
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return listSourceFiles(full)
      return entry.isFile() && SOURCE_FILE.test(entry.name) ? [full] : []
    }),
  )
  return nested.flat()
}

export function createAssetLibraryHandler({ root }: { root: string }): AssetLibraryHandler {
  const assetsRoot = path.resolve(root, ASSETS_DIR)
  const sourceRoot = path.resolve(root, SOURCE_DIR)

  const relative = (file: string) => path.relative(root, file).split(path.sep).join('/')

  function decodeName(raw: string): string {
    try {
      return decodeURIComponent(raw)
    } catch {
      throw new HttpError(400, 'invalid asset name')
    }
  }

  function resolveAsset(value: string): { name: string; file: string } {
    const name = validateAssetName(value)
    if (!name) throw new HttpError(400, `invalid asset name: ${value}`)
    const file = path.resolve(assetsRoot, name)
    if (!file.startsWith(`${assetsRoot}${path.sep}`)) throw new HttpError(400, 'invalid asset path')
    return { name, file }
  }

  async function scanUsages(): Promise<Map<string, AssetUsage[]>> {
    const usages = new Map<string, AssetUsage[]>()
    for (const file of await listSourceFiles(sourceRoot)) {
      let code: string
      try {
        code = await readFile(file, 'utf8')
      } catch {
        continue
      }
      for (const [name, count] of findAssetReferences(code)) {
        usages.set(name, [...(usages.get(name) ?? []), { file: relative(file), count }])
      }
    }
    return usages
  }

  async function listAssets(): Promise<AssetEntry[]> {
    let names: string[]
    try {
      names = await readdir(assetsRoot)
    } catch {
      return []
    }
    const usages = await scanUsages()
    const assets: AssetEntry[] = []
    for (const raw of names) {
      const name = validateAssetName(raw)
      if (!name || name !== raw) continue
      const info = await stat(path.join(assetsRoot, name)).catch(() => null)
      if (!info?.isFile()) continue
      const mime = mimeForFilename(name)
      assets.push({
        name,
        size: info.size,
        mtime: info.mtimeMs,
        mime,
        kind: assetKind(mime),
        url: `${ASSET_API}/${encodeURIComponent(name)}?v=${Math.round(info.mtimeMs)}`,
        importPath: assetImportPath(name),
        usages: usages.get(name) ?? [],
      })
    }
    return assets.sort((a, b) => a.name.localeCompare(b.name))
  }

  async function serveFile(res: ServerResponse, file: string): Promise<void> {
    let data: Buffer
    try {
      data = await readFile(file)
    } catch {
      throw new HttpError(404, 'asset not found')
    }
    res.statusCode = 200
    res.setHeader('content-type', mimeForFilename(file))
    res.setHeader('content-length', String(data.length))
    res.setHeader('cache-control', 'no-store')
    res.end(data)
  }

  async function upload(req: IncomingMessage, rawName: string, overwrite: boolean) {
    const { name, file } = resolveAsset(normalizeAssetName(decodeName(rawName)))
    if (!overwrite && (await exists(file))) {
      req.resume()
      throw new HttpError(409, 'asset exists', { name })
    }
    const body = await readBody(req, ASSET_MAX_BYTES)
    await mkdir(assetsRoot, { recursive: true })
    await writeAtomic(file, body)
    return { ok: true, name }
  }

  async function renameAsset(req: IncomingMessage, rawName: string) {
    const from = resolveAsset(decodeName(rawName))
    const body = await readJson(req)
    if (typeof body.name !== 'string') throw new HttpError(400, 'missing new name')
    const to = resolveAsset(normalizeAssetName(body.name))
    if (!(await exists(from.file))) throw new HttpError(404, 'asset not found')
    if (to.name === from.name) return { ok: true, name: to.name, updatedFiles: [] }
    // A case-only rename hits the same file on case-insensitive file systems.
    if (to.name.toLowerCase() !== from.name.toLowerCase() && (await exists(to.file))) {
      throw new HttpError(409, 'target exists', { name: to.name })
    }

    await rename(from.file, to.file)
    const updatedFiles: string[] = []
    for (const file of await listSourceFiles(sourceRoot)) {
      const code = await readFile(file, 'utf8')
      const next = rewriteAssetReferences(code, from.name, to.name)
      if (next === null) continue
      await writeAtomic(file, next)
      updatedFiles.push(relative(file))
    }
    return { ok: true, name: to.name, updatedFiles }
  }

  async function remove(rawName: string) {
    const { name, file } = resolveAsset(decodeName(rawName))
    if (!(await exists(file))) throw new HttpError(404, 'asset not found')
    const usages = (await scanUsages()).get(name) ?? []
    if (usages.length > 0) {
      throw new HttpError(409, 'asset in use', { usages })
    }
    await unlink(file)
    return { ok: true }
  }

  async function handle(req: IncomingMessage, res: ServerResponse, next: Next): Promise<void> {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (url.pathname !== ASSET_API && !url.pathname.startsWith(`${ASSET_API}/`)) {
      next()
      return
    }
    const rest = url.pathname.slice(ASSET_API.length).replace(/^\/+/, '')
    const method = req.method ?? 'GET'

    if (!rest) {
      if (method !== 'GET') throw new HttpError(405, 'method not allowed')
      sendJson(res, 200, { assets: await listAssets() })
      return
    }
    if (rest.includes('/')) throw new HttpError(404, 'not found')

    if (method === 'GET' || method === 'HEAD') {
      await serveFile(res, resolveAsset(decodeName(rest)).file)
      return
    }

    assertSameOrigin(req)
    if (method === 'POST') {
      sendJson(res, 201, await upload(req, rest, url.searchParams.get('overwrite') === '1'))
    } else if (method === 'PATCH') {
      sendJson(res, 200, await renameAsset(req, rest))
    } else if (method === 'DELETE') {
      sendJson(res, 200, await remove(rest))
    } else {
      throw new HttpError(405, 'method not allowed')
    }
  }

  return (req, res, next) => {
    handle(req, res, next).catch((error: unknown) => {
      if (error instanceof HttpError) {
        sendJson(res, error.status, { error: error.message, ...error.body })
      } else {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : 'asset request failed',
        })
      }
    })
  }
}

/** Dev-only: mounts the `/__assets` API and pings the studio when `assets/` changes. */
export function assetLibraryPlugin(): Plugin {
  return {
    name: 'asset-library',
    apply: 'serve',
    config() {
      // Dev serves small SVGs as data: URIs by default. Keep every image a
      // real URL so the studio can trace a rendered <img> back to its import
      // when swapping images. Production builds keep the default inlining.
      return { build: { assetsInlineLimit: 0 } }
    },
    configureServer(server) {
      const root = server.config.root
      const assetsRoot = path.resolve(root, ASSETS_DIR)
      server.middlewares.use(createAssetLibraryHandler({ root }))

      server.watcher.add(assetsRoot)
      const onChange = (file: string) => {
        if (file === assetsRoot || file.startsWith(`${assetsRoot}${path.sep}`)) {
          server.ws.send({ type: 'custom', event: ASSETS_CHANGED_EVENT })
        }
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
