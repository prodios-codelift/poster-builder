import type { File, JSXElement, JSXFragment, Node } from '@babel/types'
import * as t from '@babel/types'

import { parseCarouselSource } from './edit-carousel-source'

/** Detection regex shared with the apply-comment skill — use exactly this. */
export const SLIDE_COMMENT_MARKER_RE =
  /\{\/\*\s*@slide-comment\s+id="(c-[a-f0-9]+)"\s+ts="([^"]+)"\s+text="([A-Za-z0-9_-]+={0,2})"\s*\*\/\}/g

export type CommentPayload = { note: string; hint?: string; page?: number }

export type CommentTarget = { line: number; column: number }

export type CarouselComment = {
  id: string
  /** 1-based line of the marker. */
  line: number
  ts: string
  note: string
  page?: number
  /**
   * Start of the JSX element the marker sits in (1-based line, 0-based
   * column), matching that element's rendered `data-tsd-source`.
   */
  target: CommentTarget | null
}

export type ParsedTsdSource = {
  /** Project-relative path without a leading slash. */
  file: string
  /** 1-based line of the JSX element's `<`. */
  line: number
  /** 0-based column of the JSX element's `<` (Babel loc). */
  column: number
}

export type InsertionPlan = { offset: number; indent: string; breakAfter: boolean }

export type InsertCommentResult =
  | { ok: true; source: string; id: string; line: number }
  | { ok: false; error: string }

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

const COMMENTABLE_PREFIXES = ['src/linkedin-carousels/carousels/', 'src/linkedin-carousels/themes/']

export const COMMENT_ID_RE = /^c-[a-f0-9]+$/

type JsxContainer = JSXElement | JSXFragment

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function b64urlEncode(s: string): string {
  return bytesToBase64(new TextEncoder().encode(s))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  return new TextDecoder().decode(base64ToBytes(s.replace(/-/g, '+').replace(/_/g, '/') + pad))
}

/**
 * Parse a TanStack Devtools `data-tsd-source` value.
 * Format: `[/]path/to/file.tsx:line:column` where line and column are 1-based.
 */
export function parseTsdSource(value: string): ParsedTsdSource | null {
  const match = /^\/?(.+):(\d+):(\d+)$/.exec(value)
  if (!match) return null
  const file = match[1]
  const line = Number(match[2])
  const column1Based = Number(match[3])
  if (!file || !Number.isInteger(line) || line < 1) return null
  if (!Number.isInteger(column1Based) || column1Based < 1) return null
  return { file, line, column: column1Based - 1 }
}

/** Only carousel / theme `.tsx` files under `src/linkedin-carousels/{carousels,themes}/`. */
export function isCommentableFile(file: string): boolean {
  const normalized = file.replace(/\\/g, '/').replace(/^\//, '')
  return (
    COMMENTABLE_PREFIXES.some((prefix) => normalized.startsWith(prefix)) &&
    normalized.endsWith('.tsx') &&
    !normalized.includes('..')
  )
}

/**
 * Source file of a studio entry: `<id>` → its carousel, `theme-<id>--<palette>`
 * → the theme demo every palette variant shares.
 */
export function carouselSourceFile(carouselId: string): string {
  const theme = /^theme-(.+?)--/.exec(carouselId)
  return theme
    ? `src/linkedin-carousels/themes/${theme[1]}/index.tsx`
    : `src/linkedin-carousels/carousels/${carouselId}/index.tsx`
}

export function newCommentId(): string {
  const hex = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  return `c-${hex}`
}

function walk(node: unknown, visit: (n: Node) => void | 'stop'): void {
  let stopped = false
  const recurse = (current: unknown): void => {
    if (stopped || !current || typeof current !== 'object') return
    if (Array.isArray(current)) {
      for (const child of current) recurse(child)
      return
    }
    const n = current as Node
    if (typeof n.type !== 'string') return
    if (visit(n) === 'stop') {
      stopped = true
      return
    }
    for (const key of Object.keys(n)) {
      if (SKIP_KEYS.has(key)) continue
      recurse((n as unknown as Record<string, unknown>)[key])
    }
  }
  recurse(node)
}

/** JSX nodes enclosing (line, column), innermost first. */
function findJsxAncestors(ast: File, line: number, column: number): JsxContainer[] {
  const hits: { node: JsxContainer; size: number }[] = []
  walk(ast, (n) => {
    if (!t.isJSXElement(n) && !t.isJSXFragment(n)) return
    if (!n.loc) return
    const s = n.loc.start
    const e = n.loc.end
    const afterStart = line > s.line || (line === s.line && column >= s.column)
    const beforeEnd = line < e.line || (line === e.line && column < e.column)
    if (afterStart && beforeEnd) {
      hits.push({ node: n, size: (n.end ?? 0) - (n.start ?? 0) })
    }
  })
  hits.sort((a, b) => a.size - b.size)
  return hits.map((h) => h.node)
}

function lineToOffset(source: string, line: number): number {
  let off = 0
  for (let l = 1; l < line; l++) {
    const nl = source.indexOf('\n', off)
    if (nl === -1) return source.length
    off = nl + 1
  }
  return off
}

function lineIndent(source: string, lineNumber: number): string {
  const start = lineToOffset(source, lineNumber)
  const m = source.slice(start, start + 200).match(/^[ \t]*/)
  return m?.[0] ?? ''
}

function planInsertion(source: string, target: JsxContainer): InsertionPlan | null {
  if (t.isJSXElement(target) && target.openingElement.selfClosing) return null
  const opening = t.isJSXFragment(target) ? target.openingFragment : target.openingElement
  const offset = opening.end ?? 0
  return {
    offset,
    indent: `${lineIndent(source, target.loc?.start.line ?? 1)}  `,
    breakAfter: !/^[ \t]*\r?\n/.test(source.slice(offset)),
  }
}

export function buildMarker(
  plan: InsertionPlan,
  id: string,
  ts: string,
  encodedText: string,
): string {
  const marker = `\n${plan.indent}{/* @slide-comment id="${id}" ts="${ts}" text="${encodedText}" */}`
  return plan.breakAfter ? `${marker}\n${plan.indent}` : marker
}

export function findInsertion(source: string, line: number, column: number): InsertionPlan | null {
  const ast = parseCarouselSource(source)
  if (!ast) return null
  const ancestors = findJsxAncestors(ast, line, column)
  for (const node of ancestors) {
    const plan = planInsertion(source, node)
    if (plan) return plan
  }
  return null
}

export function offsetToLine(source: string, offset: number): number {
  return source.slice(0, offset).split('\n').length
}

/**
 * Insert a `@slide-comment` marker as the first child of the JSX element at
 * the given location. Self-closing elements hoist to the nearest container.
 */
export function insertCarouselComment(
  source: string,
  options: {
    line: number
    column: number
    note: string
    page?: number
    id?: string
    ts?: string
  },
): InsertCommentResult {
  const note = options.note.trim()
  if (!note) return { ok: false, error: 'comment text is empty' }

  const plan = findInsertion(source, options.line, options.column)
  if (!plan) {
    return {
      ok: false,
      error: `could not find a JSX container around line ${options.line}. Try clicking a different element.`,
    }
  }

  const id = options.id ?? newCommentId()
  const ts = options.ts ?? new Date().toISOString()
  const payload: CommentPayload = { note }
  if (options.page !== undefined && Number.isFinite(options.page) && options.page >= 0) {
    payload.page = Math.floor(options.page)
  }
  const encoded = b64urlEncode(JSON.stringify(payload))
  const marker = buildMarker(plan, id, ts, encoded)
  const next = source.slice(0, plan.offset) + marker + source.slice(plan.offset)
  if (!parseCarouselSource(next)) {
    return { ok: false, error: 'comment would produce invalid source' }
  }
  return { ok: true, source: next, id, line: offsetToLine(next, plan.offset + 1) }
}

function markerRe(): RegExp {
  return new RegExp(SLIDE_COMMENT_MARKER_RE.source)
}

function markerRegexFor(id: string): RegExp {
  return new RegExp(
    `\\{\\/\\*\\s*@slide-comment\\s+id="${id}"\\s+ts="[^"]+"\\s+text="[A-Za-z0-9_\\-]+={0,2}"\\s*\\*\\/\\}`,
  )
}

function parsePage(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : undefined
}

/** Every `@slide-comment` marker in the file, in source order. Targets unresolved. */
export function parseMarkers(source: string): CarouselComment[] {
  const comments: CarouselComment[] = []
  const lines = source.split('\n')
  const re = markerRe()
  for (let i = 0; i < lines.length; i++) {
    const m = re.exec(lines[i])
    if (!m) continue
    const [, id, ts, encoded] = m
    try {
      const payload = JSON.parse(b64urlDecode(encoded)) as Partial<CommentPayload>
      if (typeof payload.note !== 'string') continue
      comments.push({
        id,
        line: i + 1,
        ts,
        note: payload.note,
        page: parsePage(payload.page),
        target: null,
      })
    } catch {
      // Malformed payload: not ours to show.
    }
  }
  return comments
}

/** Fill in each comment's `target`: the JSX element whose body holds the marker. */
export function resolveTargets(source: string, comments: CarouselComment[]): CarouselComment[] {
  const ast = parseCarouselSource(source)
  const lines = source.split('\n')
  return comments.map((comment) => {
    if (!ast) return { ...comment, target: null }
    const column = Math.max(0, (lines[comment.line - 1] ?? '').search(/\{\/\*\s*@slide-comment/))
    const element = findJsxAncestors(ast, comment.line, column).find((node) => t.isJSXElement(node))
    const start = element?.loc?.start
    return { ...comment, target: start ? { line: start.line, column: start.column } : null }
  })
}

/** Replace the note of marker `id`, keeping id, ts and other payload fields. */
export function updateMarkerNote(source: string, id: string, note: string): string | null {
  const re = new RegExp(
    `(\\{\\/\\*\\s*@slide-comment\\s+id="${id}"\\s+ts="[^"]+"\\s+text=")([A-Za-z0-9_\\-]+={0,2})("\\s*\\*\\/\\})`,
  )
  const m = re.exec(source)
  if (!m) return null
  let payload: CommentPayload
  try {
    payload = JSON.parse(b64urlDecode(m[2])) as CommentPayload
  } catch {
    return null
  }
  const encoded = b64urlEncode(JSON.stringify({ ...payload, note }))
  return source.slice(0, m.index) + m[1] + encoded + m[3] + source.slice(m.index + m[0].length)
}

/**
 * Strip marker `id`. The line goes away only when nothing else was on it, so
 * content sharing the line survives.
 *
 * Inserting into an inline element (`<Hero>Text</Hero>`) breaks it onto two
 * lines (see `buildMarker`). When that exact shape is left behind (an opening
 * tag, then inline content that closes the element on the next line), the
 * two lines are joined back together.
 */
export function removeMarker(source: string, id: string): string | null {
  const lines = source.split('\n')
  const re = markerRegexFor(id)
  const hit = lines.findIndex((line) => re.test(line))
  if (hit === -1) return null
  const stripped = lines[hit].replace(re, '')
  if (stripped.trim() !== '') {
    lines[hit] = stripped
    return lines.join('\n')
  }
  lines.splice(hit, 1)
  const opening = lines[hit - 1]?.trimEnd() ?? ''
  const content = lines[hit]?.trim() ?? ''
  if (
    /<[A-Za-z][^<>]*>$/.test(opening) &&
    !opening.endsWith('/>') &&
    content !== '' &&
    !content.startsWith('<') &&
    !content.startsWith('{/*') &&
    /<\/[A-Za-z][\w.]*>$/.test(content)
  ) {
    lines.splice(hit - 1, 2, opening + content)
  }
  return lines.join('\n')
}
