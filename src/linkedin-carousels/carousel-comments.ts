import type { File, JSXElement, JSXFragment, Node } from '@babel/types'
import * as t from '@babel/types'

import { parseCarouselSource } from './edit-carousel-source'

/** Detection regex shared with the apply-comment skill — use exactly this. */
export const SLIDE_COMMENT_MARKER_RE =
  /\{\/\*\s*@slide-comment\s+id="(c-[a-f0-9]+)"\s+ts="([^"]+)"\s+text="([A-Za-z0-9_-]+={0,2})"\s*\*\/\}/g

export type CommentPayload = { note: string; hint?: string; page?: number }

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

const LINKEDIN_CAROUSELS_PREFIX = 'src/linkedin-carousels/'

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

/** Only carousel / theme `.tsx` files under `src/linkedin-carousels/`. */
export function isCommentableFile(file: string): boolean {
  const normalized = file.replace(/\\/g, '/').replace(/^\//, '')
  return (
    normalized.startsWith(LINKEDIN_CAROUSELS_PREFIX) &&
    normalized.endsWith('.tsx') &&
    !normalized.includes('..')
  )
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
