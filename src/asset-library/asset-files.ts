/**
 * Shared, fs-free rules for the global asset library (`<root>/assets/`). Used
 * by the dev-server API, the studio client and the image-swap server fn.
 *
 * Assets are referenced from source with ordinary imports
 * (`import acmeLogo from '@assets/acme-logo.svg'`), so Vite bundles them in
 * production builds; the `/__assets` API only exists under `vp dev`.
 */

export const ASSETS_DIR = 'assets'
export const ASSET_IMPORT_PREFIX = '@assets/'
export const ASSET_API = '/__assets'
export const ASSET_MAX_BYTES = 25 * 1024 * 1024
export const ASSETS_CHANGED_EVENT = 'poster-builder:assets-changed'
/** `dataTransfer` type for dragging an asset from the library onto a slide image. */
export const ASSET_DRAG_TYPE = 'application/x-poster-asset'

export type AssetKind = 'image' | 'font' | 'video' | 'other'

export type AssetUsage = {
  /** Project-relative source file that imports the asset. */
  file: string
  count: number
}

export type AssetEntry = {
  name: string
  size: number
  /** Last modified, epoch ms. */
  mtime: number
  mime: string
  kind: AssetKind
  /** Dev-server URL for thumbnails and previews (never used in slide source). */
  url: string
  /** `@assets/<name>` */
  importPath: string
  usages: AssetUsage[]
}

// Path separators, characters macOS/Windows can't store, and characters that
// would need escaping inside an import string or a URL.
const FORBIDDEN_CHARS = new Set(['/', '\\', ':', '*', '?', '"', "'", '`', '<', '>', '|', '#', '%'])

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  avif: 'image/avif',
  ico: 'image/x-icon',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  json: 'application/json',
  txt: 'text/plain; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
}

export const IMAGE_EXTENSIONS = Object.keys(MIME_BY_EXT).filter((ext) =>
  MIME_BY_EXT[ext].startsWith('image/'),
)

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

function splitName(name: string): { stem: string; ext: string } {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? { stem: name.slice(0, dot), ext: name.slice(dot) } : { stem: name, ext: '' }
}

export function mimeForFilename(name: string): string {
  return MIME_BY_EXT[extensionOf(name)] ?? 'application/octet-stream'
}

export function assetKind(mime: string): AssetKind {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('font/')) return 'font'
  if (mime.startsWith('video/')) return 'video'
  return 'other'
}

export function isImageAssetName(name: string): boolean {
  return assetKind(mimeForFilename(name)) === 'image'
}

/** The trimmed name when it is a safe, flat file name with an extension, else null. */
export function validateAssetName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.trim()
  if (name.length < 1 || name.length > 120) return null
  for (const char of name) {
    const code = char.charCodeAt(0)
    if (code < 0x20 || code === 0x7f || FORBIDDEN_CHARS.has(char)) return null
  }
  // Hidden files, home expansion and `..` segments.
  if (name.startsWith('.') || name.startsWith('~') || name.includes('..')) return null
  const dot = name.lastIndexOf('.')
  if (dot <= 0 || dot === name.length - 1) return null
  return name
}

/**
 * Trim and lowercase the extension: Vite matches asset extensions
 * case-sensitively, so `photo.JPG` would not import.
 */
export function normalizeAssetName(name: string): string {
  const { stem, ext } = splitName(name.trim())
  return `${stem}${ext.toLowerCase()}`
}

/** First free `stem-N.ext` (case-insensitive, like the macOS file system). */
export function renamedCopy(name: string, taken: Iterable<string>): string {
  const used = new Set([...taken].map((n) => n.toLowerCase()))
  const { stem, ext } = splitName(name)
  const base = stem.replace(/-\d+$/, '') || stem
  for (let n = 1; ; n++) {
    const candidate = `${base}-${n}${ext}`
    if (!used.has(candidate.toLowerCase())) return candidate
  }
}

export function assetImportPath(name: string): string {
  return `${ASSET_IMPORT_PREFIX}${name}`
}

const RESERVED_WORDS = new Set(
  (
    'await break case catch class const continue debugger default delete do else enum export ' +
    'extends false finally for function if implements import in instanceof interface let new ' +
    'null package private protected public return static super switch this throw true try ' +
    'typeof var void while with yield arguments eval undefined NaN Infinity'
  ).split(' '),
)

/** camelCase identifier for an asset import, unique against `taken`. */
export function assetIdentifier(name: string, taken: ReadonlySet<string> = new Set()): string {
  const words = splitName(name)
    .stem.split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
  let id = words
    .map((word, index) => {
      if (index > 0) return word.charAt(0).toUpperCase() + word.slice(1)
      return word === word.toUpperCase()
        ? word.toLowerCase()
        : word.charAt(0).toLowerCase() + word.slice(1)
    })
    .join('')
  if (!id) id = 'asset'
  if (/^\d/.test(id)) id = `asset${id}`
  if (RESERVED_WORDS.has(id)) id = `${id}Asset`
  let candidate = id
  for (let n = 2; taken.has(candidate); n++) candidate = `${id}${n}`
  return candidate
}

export function assetImportLine(name: string): string {
  return `import ${assetIdentifier(name)} from '${assetImportPath(name)}'`
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const REFERENCE_RE = /(['"`])@assets\/([^'"`\n]+)\1/g

/** Asset name → number of quoted `@assets/<name>` specifiers in `code`. */
export function findAssetReferences(code: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of code.matchAll(REFERENCE_RE)) {
    counts.set(match[2], (counts.get(match[2]) ?? 0) + 1)
  }
  return counts
}

/** Point every `@assets/<from>` specifier at `<to>`; null when there is none. */
export function rewriteAssetReferences(code: string, from: string, to: string): string | null {
  const pattern = new RegExp(`(['"\`])@assets/${escapeRegExp(from)}\\1`, 'g')
  let replaced = false
  const next = code.replace(pattern, (_match, quote: string) => {
    replaced = true
    return `${quote}${ASSET_IMPORT_PREFIX}${to}${quote}`
  })
  return replaced ? next : null
}

export type AssetUsageFilter = 'all' | 'used' | 'unused'
export type AssetKindFilter = 'all' | AssetKind
export type AssetSortKey = 'name' | 'modified' | 'size'
export type AssetSort = { key: AssetSortKey; direction: 'asc' | 'desc' }

export type AssetFilter = {
  query?: string
  kind?: AssetKindFilter
  usage?: AssetUsageFilter
}

const nameCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export function filterAssets(
  assets: readonly AssetEntry[],
  { query = '', kind = 'all', usage = 'all' }: AssetFilter,
  sort: AssetSort = { key: 'name', direction: 'asc' },
): AssetEntry[] {
  const needle = query.trim().toLowerCase()
  const filtered = assets.filter(
    (asset) =>
      (!needle || asset.name.toLowerCase().includes(needle)) &&
      (kind === 'all' || asset.kind === kind) &&
      (usage === 'all' || (usage === 'used') === asset.usages.length > 0),
  )
  const sign = sort.direction === 'asc' ? 1 : -1
  return filtered.sort((a, b) => {
    const byKey =
      sort.key === 'modified' ? a.mtime - b.mtime : sort.key === 'size' ? a.size - b.size : 0
    return byKey !== 0
      ? byKey * sign
      : nameCollator.compare(a.name, b.name) * (sort.key === 'name' ? sign : 1)
  })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
