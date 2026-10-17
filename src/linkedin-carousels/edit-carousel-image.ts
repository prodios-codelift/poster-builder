import { parse } from '@babel/parser'
import type { Node } from '@babel/types'
import * as t from '@babel/types'

import {
  ASSET_IMPORT_PREFIX,
  IMAGE_EXTENSIONS,
  assetIdentifier,
  assetImportPath,
} from '@/asset-library/asset-files'

import { parseCarouselSource, parsePosition } from './edit-carousel-source'

export type CarouselImageSwap = {
  /** Project-relative carousel file (from `data-slide-file`). */
  file: string
  /** "line:column" of the clicked `<img>` (from `data-slide-position`). */
  position: string
  /** URL path the `<img>` rendered, e.g. `/src/…/assets/dubai.jpg`. */
  src: string
  /** File name in the global `assets/` folder. */
  assetName: string
}

export type ApplyCarouselImageResult =
  | { ok: true; source: string; replaced: number }
  | { ok: false; error: string }

type ImageImport = {
  declaration: t.ImportDeclaration
  local: string
  specifier: string
  /** Dev-server URL path Vite serves the import at. */
  url: string | null
}

type Splice = { from: number; to: number; text: string }

const IMAGE_FILE = new RegExp(`\\.(${IMAGE_EXTENSIONS.join('|')})$`, 'i')
const SKIP_KEYS = new Set([
  'loc',
  'start',
  'end',
  'type',
  'extra',
  'leadingComments',
  'trailingComments',
  'innerComments',
])

function normalizePosix(pathname: string): string {
  const out: string[] = []
  for (const part of pathname.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') out.pop()
    else out.push(part)
  }
  return `/${out.join('/')}`
}

/** URL path Vite dev serves an import at (files inside the project root). */
export function importUrl(specifier: string, file: string): string | null {
  if (specifier.startsWith(ASSET_IMPORT_PREFIX))
    return normalizePosix(`assets/${specifier.slice(ASSET_IMPORT_PREFIX.length)}`)
  if (specifier.startsWith('@/') || specifier.startsWith('#/'))
    return normalizePosix(`src/${specifier.slice(2)}`)
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const dir = file.replace(/\\/g, '/').split('/').slice(0, -1).join('/')
    return normalizePosix(`${dir}/${specifier}`)
  }
  return null
}

function cleanSrc(src: string): string {
  const path = src.split(/[?#]/)[0]
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

function collectImageImports(ast: t.File, file: string): ImageImport[] {
  const imports: ImageImport[] = []
  for (const statement of ast.program.body) {
    if (!t.isImportDeclaration(statement) || statement.importKind === 'type') continue
    const specifier = statement.source.value
    if (!IMAGE_FILE.test(specifier)) continue
    const binding = statement.specifiers.find((s) => t.isImportDefaultSpecifier(s))
    if (!binding) continue
    imports.push({
      declaration: statement,
      local: binding.local.name,
      specifier,
      url: importUrl(specifier, file),
    })
  }
  return imports
}

type Visit = (node: Node, parent: Node | null, key: string) => void

function walk(node: unknown, visit: Visit, parent: Node | null = null, key = ''): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit, parent, key)
    return
  }
  const n = node as Node
  if (typeof n.type !== 'string') return
  visit(n, parent, key)
  for (const childKey of Object.keys(n)) {
    if (!SKIP_KEYS.has(childKey))
      walk((n as unknown as Record<string, unknown>)[childKey], visit, n, childKey)
  }
}

type Reference = { node: t.Identifier; shorthand: t.ObjectProperty | null }

/** Value references to `name` (not keys, member properties or the import binding). */
function findReferences(ast: t.File, name: string): Reference[] {
  const refs: Reference[] = []
  const seenShorthand = new Set<t.ObjectProperty>()
  walk(ast.program, (node, parent, key) => {
    if (!t.isIdentifier(node) || node.name !== name || !parent) return
    if (
      t.isImportDefaultSpecifier(parent) ||
      t.isImportSpecifier(parent) ||
      t.isImportNamespaceSpecifier(parent)
    )
      return
    if (
      (t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) &&
      key === 'property' &&
      !parent.computed
    )
      return
    if (t.isObjectProperty(parent)) {
      if (parent.shorthand) {
        // Babel gives shorthand `{ a }` separate key and value nodes; count it once.
        if (!seenShorthand.has(parent)) refs.push({ node, shorthand: parent })
        seenShorthand.add(parent)
        return
      }
      if (key === 'key' && !parent.computed) return
    }
    if (
      (t.isObjectMethod(parent) || t.isClassMethod(parent) || t.isClassProperty(parent)) &&
      key === 'key' &&
      !parent.computed
    )
      return
    refs.push({ node, shorthand: null })
  })
  return refs
}

function findImgAt(ast: t.File, position: string): t.JSXElement | null {
  const pos = parsePosition(position)
  if (!pos) return null
  let found: t.JSXElement | null = null
  walk(ast.program, (node) => {
    if (found || !t.isJSXElement(node)) return
    const name = node.openingElement.name
    if (
      t.isJSXIdentifier(name, { name: 'img' }) &&
      node.loc?.start.line === pos.line &&
      node.loc.start.column === pos.column
    ) {
      found = node
    }
  })
  return found
}

function directSrcIdentifier(img: t.JSXElement | null): t.Identifier | null {
  const attr = img?.openingElement.attributes.find(
    (a): a is t.JSXAttribute => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name, { name: 'src' }),
  )
  const value = attr?.value
  return t.isJSXExpressionContainer(value) && t.isIdentifier(value.expression)
    ? value.expression
    : null
}

function allIdentifierNames(ast: t.File): Set<string> {
  const names = new Set<string>()
  walk(ast.program, (node) => {
    if (t.isIdentifier(node) || t.isJSXIdentifier(node)) names.add(node.name)
  })
  return names
}

/** Start/end of a whole statement line, including its trailing newline. */
function statementRange(source: string, node: Node): { from: number; to: number } {
  let to = node.end!
  if (source[to] === '\r') to++
  if (source[to] === '\n') to++
  return { from: node.start!, to }
}

function isValidSource(source: string): boolean {
  try {
    parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] })
    return true
  } catch {
    return false
  }
}

/**
 * Point an image on a carousel slide at a global asset. The clicked `<img>`
 * is traced back to the import it renders:
 *
 * - `<img src={dubaiPhoto}>` at `position`: that one usage is swapped.
 * - anything else (a `Photo` helper's `<img src={src}>`, a mapped logo
 *   array): the import whose dev URL equals `src`, and every usage of it.
 *
 * The new `import x from '@assets/<name>'` reuses an existing import of that
 * asset, and an old import left without usages is removed.
 */
export function applyCarouselImageSwap(
  source: string,
  { file, position, src, assetName }: CarouselImageSwap,
): ApplyCarouselImageResult {
  const ast = parseCarouselSource(source)
  if (!ast) return { ok: false, error: 'could not parse source' }

  const imports = collectImageImports(ast, file)
  const byLocal = new Map(imports.map((imp) => [imp.local, imp]))

  const direct = directSrcIdentifier(findImgAt(ast, position))
  let target = direct ? byLocal.get(direct.name) : undefined
  let site: t.Identifier | null = target ? direct : null
  if (!target) {
    const url = cleanSrc(src)
    target = imports.find((imp) => imp.url === url)
    site = null
  }
  if (!target) {
    return {
      ok: false,
      error: `Couldn't trace this image to an import in ${file}. Edit the source directly.`,
    }
  }

  const nextSpecifier = assetImportPath(assetName)
  if (target.specifier === nextSpecifier) return { ok: true, source, replaced: 0 }

  const existing = imports.find((imp) => imp.specifier === nextSpecifier)
  const nextLocal = existing?.local ?? assetIdentifier(assetName, allIdentifierNames(ast))

  const refs = findReferences(ast, target.local)
  const swapped = site && refs.length > 1 ? refs.filter((ref) => ref.node === site) : refs
  if (swapped.length === 0) {
    return { ok: false, error: `${target.local} is imported but never used in ${file}` }
  }

  const splices: Splice[] = swapped.map(({ node, shorthand }) =>
    shorthand
      ? { from: shorthand.start!, to: shorthand.end!, text: `${target.local}: ${nextLocal}` }
      : { from: node.start!, to: node.end!, text: nextLocal },
  )

  const newImport = `import ${nextLocal} from '${nextSpecifier}'`
  const oldUnused = swapped.length === refs.length && target.declaration.specifiers.length === 1
  if (oldUnused) {
    // Replace the old import in place, or drop it when the asset is already imported.
    const range = existing
      ? statementRange(source, target.declaration)
      : { from: target.declaration.start!, to: target.declaration.end! }
    splices.push({ ...range, text: existing ? '' : newImport })
  } else if (!existing) {
    const lastImport = ast.program.body.filter((s) => t.isImportDeclaration(s)).at(-1)!
    splices.push({ from: lastImport.end!, to: lastImport.end!, text: `\n${newImport}` })
  }

  splices.sort((a, b) => b.from - a.from)
  let next = source
  for (const splice of splices)
    next = next.slice(0, splice.from) + splice.text + next.slice(splice.to)
  if (!isValidSource(next)) return { ok: false, error: 'swap would produce invalid source' }
  return { ok: true, source: next, replaced: swapped.length }
}
