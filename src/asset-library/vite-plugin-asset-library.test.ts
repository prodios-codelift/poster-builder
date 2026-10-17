import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test'

import { ASSET_MAX_BYTES } from './asset-files'
import { createAssetLibraryHandler } from './vite-plugin-asset-library'

let root: string
let server: Server
let base: string

beforeEach(async () => {
  root = mkdtempSync(path.join(tmpdir(), 'asset-library-'))
  mkdirSync(path.join(root, 'src'))
  const handler = createAssetLibraryHandler({ root })
  server = createServer((req, res) =>
    handler(req, res, () => {
      res.statusCode = 404
      res.end('next')
    }),
  )
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/__assets`
})

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve))
  rmSync(root, { recursive: true, force: true })
})

const upload = (name: string, body: BodyInit, query = '') =>
  fetch(`${base}/${encodeURIComponent(name)}${query}`, { method: 'POST', body })

async function list() {
  const response = await fetch(base)
  return ((await response.json()) as { assets: { name: string; usages: unknown[] }[] }).assets
}

describe('asset library API', () => {
  it('passes other URLs through', async () => {
    const response = await fetch(base.replace('/__assets', '/other'))
    expect(await response.text()).toBe('next')
  })

  it('uploads, refuses duplicates, overwrites on request and serves bytes', async () => {
    expect((await upload('Logo.SVG', '<svg/>')).status).toBe(201)
    expect((await upload('Logo.svg', '<svg>2</svg>')).status).toBe(409)
    expect((await upload('Logo.svg', '<svg>3</svg>', '?overwrite=1')).status).toBe(201)

    expect((await list()).map((a) => a.name)).toEqual(['Logo.svg'])
    const file = await fetch(`${base}/Logo.svg`)
    expect(file.headers.get('content-type')).toBe('image/svg+xml')
    expect(await file.text()).toBe('<svg>3</svg>')
  })

  it('rejects invalid names and oversized bodies', async () => {
    expect((await upload('.env', 'x')).status).toBe(400)
    expect((await upload('noext', 'x')).status).toBe(400)
    expect((await upload('big.png', new Blob([new Uint8Array(ASSET_MAX_BYTES + 1)]))).status).toBe(
      413,
    )
    expect(await list()).toEqual([])
  })

  it('reports usages and rewrites imports on rename', async () => {
    await upload('a.png', 'png')
    const source = path.join(root, 'src', 'slide.tsx')
    writeFileSync(source, `import a from '@assets/a.png'\nimport b from '@assets/a.png'\n`)

    expect((await list())[0].usages).toEqual([{ file: 'src/slide.tsx', count: 2 }])

    const response = await fetch(`${base}/a.png`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Hero.PNG' }),
    })
    expect(await response.json()).toEqual({
      ok: true,
      name: 'Hero.png',
      updatedFiles: ['src/slide.tsx'],
    })
    expect(readFileSync(source, 'utf8')).toBe(
      `import a from '@assets/Hero.png'\nimport b from '@assets/Hero.png'\n`,
    )
    expect((await list()).map((a) => a.name)).toEqual(['Hero.png'])
  })

  it('refuses to rename over another asset', async () => {
    await upload('a.png', 'a')
    await upload('b.png', 'b')
    const response = await fetch(`${base}/a.png`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'b.png' }),
    })
    expect(response.status).toBe(409)
  })

  it('blocks deleting an asset that is still imported', async () => {
    await upload('a.png', 'png')
    writeFileSync(path.join(root, 'src', 'slide.tsx'), `import a from '@assets/a.png'\n`)

    const blocked = await fetch(`${base}/a.png`, { method: 'DELETE' })
    expect(blocked.status).toBe(409)
    expect(await blocked.json()).toMatchObject({ usages: [{ file: 'src/slide.tsx', count: 1 }] })

    writeFileSync(path.join(root, 'src', 'slide.tsx'), '')
    expect((await fetch(`${base}/a.png`, { method: 'DELETE' })).status).toBe(200)
    expect(await list()).toEqual([])
  })

  it('blocks cross-origin writes', async () => {
    const response = await fetch(`${base}/a.png`, {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
      body: 'x',
    })
    expect(response.status).toBe(403)
    expect(await list()).toEqual([])
  })
})
