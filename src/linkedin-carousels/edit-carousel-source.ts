import { parse } from '@babel/parser'
import type { File, Node } from '@babel/types'
import * as t from '@babel/types'

import { textDiff, textHunks } from './text-diff'

export type SourceLocation = {
  line: number
  column: number
}

export type CarouselTextEdit = {
  /** `data-carousel-loc` locations of the edited element and its ancestors, nearest first. */
  locations: SourceLocation[]
  prevText: string
  nextText: string
}

export type CarouselTextTarget = {
  locations: SourceLocation[]
  text: string
}

export type ApplyCarouselTextResult = { ok: true; source: string } | { ok: false; error: string }

type Splice = { from: number; to: number; text: string }

/** A piece of source that renders as `current` and can be rewritten to new text. */
type TextCandidate = {
  /** Identity of the underlying source range, so nested scopes don't count it twice. */
  key: string
  current: string
  splices: (next: string) => Splice[]
}

type Context = {
  ast: File
  jsxByLoc: Map<string, t.JSXElement>
  moduleConsts: Map<string, Node>
}

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

// Attribute and property values that configure markup rather than render copy.
const NON_COPY_NAMES = new Set([
  'alt',
  'aria-hidden',
  'class',
  'className',
  'd',
  'fill',
  'href',
  'htmlFor',
  'id',
  'key',
  'rel',
  'role',
  'src',
  'srcSet',
  'stroke',
  'strokeLinecap',
  'strokeLinejoin',
  'style',
  'target',
  'type',
  'viewBox',
  'xmlns',
])

// TypeScript nodes that wrap a runtime expression; every other `TS*` node is a type.
const TS_EXPRESSION_WRAPPERS = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSNonNullExpression',
  'TSTypeAssertion',
])

const NO_TEXT_MATCH = 'could not find a unique string literal for this edit'
const AMBIGUOUS_TEXT_MATCH = 'this text appears more than once in the source; edit it in code'

type Visitor = (node: Node, parent: Node | null, key: string | null) => void | 'skip'

/** Depth-first walk over every AST node; return `'skip'` to leave a subtree out. */
export function walkAst(root: Node, visit: Visitor): void {
  const recurse = (value: unknown, parent: Node | null, key: string | null): void => {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) {
      for (const item of value) recurse(item, parent, key)
      return
    }
    const node = value as Node
    if (typeof node.type !== 'string') return
    if (visit(node, parent, key) === 'skip') return
    for (const childKey of Object.keys(node)) {
      if (SKIP_KEYS.has(childKey)) continue
      recurse((node as unknown as Record<string, unknown>)[childKey], node, childKey)
    }
  }
  recurse(root, null, null)
}

/** Parses a carousel module; any syntax error, even a recoverable one, yields null. */
export function parseCarouselSource(source: string): File | null {
  try {
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
      errorRecovery: true,
      ranges: true,
    })
    return ast.errors && ast.errors.length > 0 ? null : ast
  } catch {
    return null
  }
}

export function jsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

/** JSX text that keeps its exact value with no surrounding context. */
export function formatJsxText(value: string): string {
  if (/[{}<>]/.test(value) || /^\s|\s$/.test(value) || value === '') {
    return `{${jsString(value)}}`
  }
  return value
}

export function formatJsxAttrValue(value: string): string {
  if (/^[^"\\<>&{}\n\r]*$/.test(value)) return `"${value}"`
  return `{${jsString(value)}}`
}

function formatStringLiteral(node: t.StringLiteral, value: string): string {
  const raw = node.extra?.raw
  if (typeof raw === 'string' && raw.startsWith('"') && /^[^"\\\n\r]*$/.test(value)) {
    return `"${value}"`
  }
  return jsString(value)
}

/** Lines joined by `<br />`, each written as plain JSX text where that is lossless. */
function formatRichText(value: string, formatLine: (line: string) => string): string {
  return value
    .split('\n')
    .map((line) => (line ? formatLine(line) : ''))
    .join('<br />')
}

/**
 * JSX trims whitespace at the start and end of each source line, so a segment
 * spliced into existing JSX text only needs `{'…'}` when its edge whitespace
 * would land next to a line break, or when it contains JSX syntax characters.
 */
function jsxTextSegmentNeedsExpression(value: string, before: string, after: string): boolean {
  if (/[{}<>]/.test(value)) return true
  if (/^\s/.test(value) && /\n[ \t]*$/.test(before)) return true
  if (/\s$/.test(value) && /^[ \t]*\r?\n/.test(after)) return true
  return false
}

function start(node: Node): number {
  return node.start ?? 0
}

function end(node: Node): number {
  return node.end ?? 0
}

function locKey(line: number, column: number): string {
  return `${line}:${column}`
}

function compactText(value: string): string {
  return value.replace(/\s+/g, '')
}

function jsxName(name: t.JSXOpeningElement['name']): string | null {
  return t.isJSXIdentifier(name) ? name.name : null
}

function jsxAttrName(attr: t.JSXAttribute): string | null {
  return t.isJSXIdentifier(attr.name) ? attr.name.name : null
}

function propertyKeyName(prop: t.ObjectProperty): string | null {
  if (prop.computed) return null
  if (t.isIdentifier(prop.key)) return prop.key.name
  if (t.isStringLiteral(prop.key)) return prop.key.value
  return null
}

// ---------------------------------------------------------------------------
// Text runs: the text one JSX element renders from its own literal children.
// ---------------------------------------------------------------------------

type TextLeaf = {
  kind: 'leaf'
  node: t.JSXText | t.JSXExpressionContainer
  current: string
  /** Index into `node.value` for each char of `current`; null for line-join spaces. */
  offsets: Array<number | null>
}

type TextBreak = { kind: 'break'; node: t.JSXElement; current: '\n' }

type TextPart = TextLeaf | TextBreak

function splitLinesWithOffsets(value: string): Array<{ text: string; start: number }> {
  const lines: Array<{ text: string; start: number }> = []
  let lineStart = 0
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]
    if (ch !== '\n' && ch !== '\r') continue
    lines.push({ text: value.slice(lineStart, i), start: lineStart })
    if (ch === '\r' && value[i + 1] === '\n') i += 1
    lineStart = i + 1
  }
  lines.push({ text: value.slice(lineStart), start: lineStart })
  return lines
}

/** JSX's whitespace rules, keeping a map back to source offsets. */
function cleanJsxTextWithOffsets(value: string): {
  text: string
  offsets: Array<number | null>
} {
  const lines = splitLinesWithOffsets(value)
  let lastNonEmptyLine = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.text.trim()) lastNonEmptyLine = i
  }

  let text = ''
  const offsets: Array<number | null> = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const chars = Array.from(line.text, (ch, j) => ({
      ch: ch === '\t' ? ' ' : ch,
      offset: line.start + j,
    }))
    let from = 0
    let to = chars.length
    if (i !== 0) {
      while (from < to && chars[from]?.ch === ' ') from += 1
    }
    if (i !== lines.length - 1) {
      while (to > from && chars[to - 1]?.ch === ' ') to -= 1
    }
    if (from >= to) continue
    for (const item of chars.slice(from, to)) {
      text += item.ch
      offsets.push(item.offset)
    }
    if (i !== lastNonEmptyLine) {
      text += ' '
      offsets.push(null)
    }
  }
  return { text, offsets }
}

function isJsxBrElement(node: Node): node is t.JSXElement {
  return t.isJSXElement(node) && jsxName(node.openingElement.name)?.toLowerCase() === 'br'
}

function collectTextPartsRaw(element: t.JSXElement | t.JSXFragment, out: TextPart[]): void {
  for (const child of element.children) {
    if (t.isJSXText(child)) {
      const { text, offsets } = cleanJsxTextWithOffsets(child.value)
      if (text) out.push({ kind: 'leaf', node: child, current: text, offsets })
    } else if (t.isJSXExpressionContainer(child)) {
      const expression = child.expression
      if (t.isStringLiteral(expression) || t.isNumericLiteral(expression)) {
        const current = String(expression.value)
        if (current) {
          out.push({
            kind: 'leaf',
            node: child,
            current,
            offsets: Array.from({ length: current.length }, (_, i) => i),
          })
        }
      }
    } else if (isJsxBrElement(child)) {
      out.push({ kind: 'break', node: child, current: '\n' })
    } else if (t.isJSXElement(child) || t.isJSXFragment(child)) {
      collectTextPartsRaw(child, out)
    }
  }
}

/** Whitespace next to a `<br />` does not render, so it is not part of the text. */
function collectTextParts(element: t.JSXElement | t.JSXFragment): TextPart[] {
  const raw: TextPart[] = []
  collectTextPartsRaw(element, raw)
  return raw.flatMap((part, index): TextPart[] => {
    if (part.kind === 'break') return [part]
    let from = 0
    let to = part.current.length
    if (raw[index - 1]?.kind === 'break') {
      while (from < to && /\s/.test(part.current[from] ?? '')) from++
    }
    if (raw[index + 1]?.kind === 'break') {
      while (to > from && /\s/.test(part.current[to - 1] ?? '')) to--
    }
    if (from === 0 && to === part.current.length) return [part]
    if (from >= to) return []
    return [
      { ...part, current: part.current.slice(from, to), offsets: part.offsets.slice(from, to) },
    ]
  })
}

function realOffsetBefore(offsets: Array<number | null>, index: number): number | null {
  for (let i = index - 1; i >= 0; i--) {
    const offset = offsets[i]
    if (offset !== null && offset !== undefined) return offset
  }
  return null
}

function realOffsetFrom(offsets: Array<number | null>, index: number): number | null {
  for (let i = index; i < offsets.length; i++) {
    const offset = offsets[i]
    if (offset !== null && offset !== undefined) return offset
  }
  return null
}

/** Maps `current[from, to)` to a range of the JSX text's raw value. */
function rawRange(
  offsets: Array<number | null>,
  from: number,
  to: number,
): { rawStart: number; rawEnd: number } | null {
  const startOffset = offsets[from]
  const rawStart =
    startOffset !== null && startOffset !== undefined
      ? startOffset
      : (() => {
          const before = realOffsetBefore(offsets, from)
          return before === null ? realOffsetFrom(offsets, from) : before + 1
        })()
  const endOffset = to > 0 ? offsets[to - 1] : null
  const rawEnd =
    endOffset !== null && endOffset !== undefined
      ? endOffset + 1
      : (() => {
          const after = realOffsetFrom(offsets, to)
          if (after !== null) return after
          const before = realOffsetBefore(offsets, to)
          return before === null ? null : before + 1
        })()
  if (rawStart === null || rawEnd === null || rawEnd < rawStart) return null
  return { rawStart, rawEnd }
}

function replaceInJsxText(
  leaf: TextLeaf & { node: t.JSXText },
  from: number,
  to: number,
  value: string,
): Splice {
  const node = leaf.node
  const raw = node.value
  const nextCurrent = `${leaf.current.slice(0, from)}${value}${leaf.current.slice(to)}`
  // Offsets index the entity-decoded value; rewrite the whole node when it differs from source.
  const exact = (node.extra?.raw ?? raw) === raw
  const minimal = exact ? rawRange(leaf.offsets, from, to) : null
  if (minimal) {
    const before = raw.slice(0, minimal.rawStart)
    const after = raw.slice(minimal.rawEnd)
    const lines = value.split('\n')
    const fits = lines.every(
      (line, i) =>
        !jsxTextSegmentNeedsExpression(
          line,
          i === 0 ? before : '',
          i === lines.length - 1 ? after : '',
        ),
    )
    if (fits) {
      return {
        from: start(node) + minimal.rawStart,
        to: start(node) + minimal.rawEnd,
        text: lines.join('<br />'),
      }
    }
  }
  // Fall back to rewriting the whole run of text, keeping the surrounding whitespace.
  const full = exact ? rawRange(leaf.offsets, 0, leaf.current.length) : null
  if (full) {
    return {
      from: start(node) + full.rawStart,
      to: start(node) + full.rawEnd,
      text: formatRichText(nextCurrent, formatJsxText),
    }
  }
  return { from: start(node), to: end(node), text: formatRichText(nextCurrent, formatJsxText) }
}

function replaceInLeaf(leaf: TextLeaf, from: number, to: number, value: string): Splice {
  if (t.isJSXText(leaf.node)) {
    return replaceInJsxText(leaf as TextLeaf & { node: t.JSXText }, from, to, value)
  }
  const nextCurrent = `${leaf.current.slice(0, from)}${value}${leaf.current.slice(to)}`
  return {
    from: start(leaf.node),
    to: end(leaf.node),
    text: nextCurrent ? formatRichText(nextCurrent, (line) => `{${jsString(line)}}`) : '',
  }
}

type PartSpan = { part: TextPart; start: number; end: number }

/** The part text inserted at `at` joins: the one containing it, else text beside it. */
function insertionSpan(spans: PartSpan[], at: number): number {
  const inside = spans.findIndex((span) => span.start < at && at < span.end)
  if (inside >= 0) return inside
  const left = spans.findIndex((span) => span.end === at)
  const right = spans.findIndex((span) => span.start === at)
  if (left >= 0 && spans[left]?.part.kind === 'leaf') return left
  if (right >= 0 && spans[right]?.part.kind === 'leaf') return right
  return left >= 0 ? left : right
}

/**
 * Applies each changed hunk to the parts it covers, so separate edits to a
 * heading and its `<mark>` stay inside their own source text.
 */
function textRunSplices(parts: TextPart[], current: string, next: string): Splice[] {
  const spans: PartSpan[] = []
  let offset = 0
  for (const part of parts) {
    spans.push({ part, start: offset, end: offset + part.current.length })
    offset += part.current.length
  }

  const edits: Array<Array<{ from: number; to: number; value: string }>> = parts.map(() => [])
  for (const hunk of textHunks(current, next)) {
    if (hunk.start === hunk.end) {
      const index = insertionSpan(spans, hunk.start)
      const span = spans[index]
      if (span) {
        const at = hunk.start - span.start
        edits[index]?.push({ from: at, to: at, value: hunk.value })
      }
      continue
    }
    // A hunk spanning parts writes its new text into the first one.
    let placed = false
    spans.forEach((span, index) => {
      if (hunk.start >= span.end || hunk.end <= span.start) return
      edits[index]?.push({
        from: Math.max(hunk.start, span.start) - span.start,
        to: Math.min(hunk.end, span.end) - span.start,
        value: placed ? '' : hunk.value,
      })
      placed = true
    })
  }

  const splices: Splice[] = []
  spans.forEach(({ part }, index) => {
    const partEdits = edits[index] ?? []
    if (partEdits.length === 0) return
    let nextCurrent = part.current
    for (const edit of [...partEdits].sort((a, b) => b.from - a.from)) {
      nextCurrent = nextCurrent.slice(0, edit.from) + edit.value + nextCurrent.slice(edit.to)
    }
    if (nextCurrent === part.current) return
    if (part.kind === 'leaf') {
      const diff = textDiff(part.current, nextCurrent)
      splices.push(replaceInLeaf(part, diff.start, diff.end, diff.value))
    } else {
      splices.push({
        from: start(part.node),
        to: end(part.node),
        text: formatRichText(nextCurrent, formatJsxText),
      })
    }
  })
  return splices
}

function textRunCandidate(element: t.JSXElement | t.JSXFragment): TextCandidate | null {
  const parts = collectTextParts(element)
  if (!parts.some((part) => part.kind === 'leaf')) return null
  const current = parts.map((part) => part.current).join('')
  return {
    key: `run:${parts.map((part) => start(part.node)).join(',')}`,
    current,
    splices: (next) => textRunSplices(parts, current, next),
  }
}

// ---------------------------------------------------------------------------
// String literals: props, data arrays and module-level constants.
// ---------------------------------------------------------------------------

function stringLiteralCandidate(node: t.StringLiteral, parent: Node | null): TextCandidate {
  const isJsxAttrValue = Boolean(parent && t.isJSXAttribute(parent))
  return {
    key: `literal:${start(node)}`,
    current: node.value,
    splices: (next) => [
      {
        from: start(node),
        to: end(node),
        text: isJsxAttrValue ? formatJsxAttrValue(next) : formatStringLiteral(node, next),
      },
    ],
  }
}

/** String literals that can plausibly be rendered copy, not keys, types or comparisons. */
function isCopyLiteralPosition(parent: Node | null, key: string | null): boolean {
  if (!parent) return true
  if (t.isObjectProperty(parent) && key === 'key') return false
  if (t.isMemberExpression(parent) && key === 'property') return false
  if ((t.isCallExpression(parent) || t.isNewExpression(parent)) && key === 'arguments') return false
  if (t.isBinaryExpression(parent) || t.isSwitchCase(parent)) return false
  if (
    t.isImportDeclaration(parent) ||
    t.isExportAllDeclaration(parent) ||
    t.isExportNamedDeclaration(parent)
  ) {
    return false
  }
  return true
}

function isReferencedIdentifier(parent: Node | null, key: string | null): boolean {
  if (!parent) return true
  if (t.isMemberExpression(parent) && key === 'property' && !parent.computed) return false
  if (t.isObjectProperty(parent) && key === 'key' && !parent.computed) return false
  if (t.isVariableDeclarator(parent) && key === 'id') return false
  return true
}

/**
 * Collects copy-like string literals under `root`, following identifiers into
 * module-level `const` data (`AUTHOR.name`, `CHANNELS.map(...)`).
 */
function collectLiteralCandidates(
  ctx: Context,
  root: Node,
  out: TextCandidate[],
  visitedConsts: Set<string>,
): void {
  walkAst(root, (node, parent, key) => {
    if (node.type.startsWith('TS') && !TS_EXPRESSION_WRAPPERS.has(node.type)) return 'skip'
    if (t.isJSXAttribute(node)) {
      const name = jsxAttrName(node)
      if (name && NON_COPY_NAMES.has(name)) return 'skip'
      return
    }
    if (t.isObjectProperty(node)) {
      const name = propertyKeyName(node)
      if (name && NON_COPY_NAMES.has(name)) return 'skip'
      return
    }
    if (t.isStringLiteral(node)) {
      if (isCopyLiteralPosition(parent, key)) out.push(stringLiteralCandidate(node, parent))
      return
    }
    if (t.isIdentifier(node) && isReferencedIdentifier(parent, key)) {
      const init = ctx.moduleConsts.get(node.name)
      if (init && !visitedConsts.has(node.name)) {
        visitedConsts.add(node.name)
        collectLiteralCandidates(ctx, init, out, visitedConsts)
      }
    }
  })
}

/** Literals passed straight to an element: `<Point n="1">`, `items={['A', 'B']}`. */
function attributeCandidates(element: t.JSXElement): TextCandidate[] {
  const out: TextCandidate[] = []
  for (const attr of element.openingElement.attributes) {
    if (!t.isJSXAttribute(attr) || !attr.value) continue
    const name = jsxAttrName(attr)
    if (name && NON_COPY_NAMES.has(name)) continue
    if (t.isStringLiteral(attr.value)) {
      out.push(stringLiteralCandidate(attr.value, attr))
    } else if (t.isJSXExpressionContainer(attr.value)) {
      walkAst(attr.value.expression, (node, parent, key) => {
        if (node.type.startsWith('TS') && !TS_EXPRESSION_WRAPPERS.has(node.type)) return 'skip'
        if (t.isStringLiteral(node) && isCopyLiteralPosition(parent, key)) {
          out.push(stringLiteralCandidate(node, parent))
        }
      })
    }
  }
  return out
}

/** Everything under `scope` that could render as one piece of text. */
function scopeCandidates(ctx: Context, scope: Node): TextCandidate[] {
  const out: TextCandidate[] = []
  walkAst(scope, (node) => {
    if (t.isJSXElement(node) || t.isJSXFragment(node)) {
      const run = textRunCandidate(node)
      if (run) out.push(run)
    }
  })
  collectLiteralCandidates(ctx, scope, out, new Set())
  return out
}

function pickCandidate(
  candidates: TextCandidate[],
  text: string,
): TextCandidate | 'ambiguous' | null {
  const unique = new Map<string, TextCandidate>()
  for (const candidate of candidates) {
    if (!unique.has(candidate.key)) unique.set(candidate.key, candidate)
  }
  const all = [...unique.values()]
  const exact = all.filter((candidate) => candidate.current === text)
  if (exact.length === 1) return exact[0] ?? null
  if (exact.length > 1) return 'ambiguous'
  const compact = compactText(text)
  const loose = all.filter((candidate) => compactText(candidate.current) === compact)
  if (loose.length === 1) return loose[0] ?? null
  if (loose.length > 1) return 'ambiguous'
  return null
}

function createContext(source: string): Context | null {
  const ast = parseCarouselSource(source)
  if (!ast) return null

  const jsxByLoc = new Map<string, t.JSXElement>()
  walkAst(ast, (node) => {
    if (t.isJSXElement(node) && node.loc) {
      jsxByLoc.set(locKey(node.loc.start.line, node.loc.start.column), node)
    }
  })

  const moduleConsts = new Map<string, Node>()
  for (const statement of ast.program.body) {
    const declaration =
      t.isExportNamedDeclaration(statement) && statement.declaration
        ? statement.declaration
        : statement
    if (!t.isVariableDeclaration(declaration) || declaration.kind !== 'const') continue
    for (const declarator of declaration.declarations) {
      if (!t.isIdentifier(declarator.id) || !declarator.init) continue
      let init: Node = declarator.init
      while (TS_EXPRESSION_WRAPPERS.has(init.type)) {
        init = (init as t.TSAsExpression).expression
      }
      if (t.isArrayExpression(init) || t.isObjectExpression(init) || t.isStringLiteral(init)) {
        moduleConsts.set(declarator.id.name, init)
      }
    }
  }

  return { ast, jsxByLoc, moduleConsts }
}

/**
 * Finds the source that renders `text` for an element. Nearest location first:
 * the element's own text, or the props of a component call site it came from;
 * then literals and module constants referenced inside each enclosing scope.
 */
function resolveText(
  ctx: Context,
  locations: SourceLocation[],
  text: string,
): TextCandidate | { error: string } {
  if (!text) return { error: NO_TEXT_MATCH }
  const elements = locations
    .map((loc) => ctx.jsxByLoc.get(locKey(loc.line, loc.column)))
    .filter((element): element is t.JSXElement => Boolean(element))

  for (const element of elements) {
    const run = textRunCandidate(element)
    const direct = pickCandidate([...(run ? [run] : []), ...attributeCandidates(element)], text)
    if (direct === 'ambiguous') return { error: AMBIGUOUS_TEXT_MATCH }
    if (direct) return direct
  }

  for (const scope of [...elements, ctx.ast.program]) {
    const hit = pickCandidate(scopeCandidates(ctx, scope), text)
    if (hit === 'ambiguous') return { error: AMBIGUOUS_TEXT_MATCH }
    if (hit) return hit
  }

  return { error: NO_TEXT_MATCH }
}

function applySplices(source: string, splices: Splice[]): ApplyCarouselTextResult {
  const ordered = [...splices].sort((a, b) => a.from - b.from || a.to - b.to)
  for (let i = 1; i < ordered.length; i++) {
    const prev = ordered[i - 1]
    const current = ordered[i]
    if (prev && current && current.from < prev.to) {
      return { ok: false, error: 'overlapping edits target the same source text' }
    }
  }
  let next = source
  for (const splice of ordered.reverse()) {
    next = next.slice(0, splice.from) + splice.text + next.slice(splice.to)
  }
  if (!parseCarouselSource(next)) {
    return { ok: false, error: 'edit would produce invalid source' }
  }
  return { ok: true, source: next }
}

/**
 * Splice carousel text edits into source. Rejects edits whose text is not a
 * literal in the file, and edits that would make the file fail to parse.
 */
export function applyCarouselTextEdits(
  source: string,
  edits: CarouselTextEdit[],
): ApplyCarouselTextResult {
  if (edits.length === 0) return { ok: true, source }

  const ctx = createContext(source)
  if (!ctx) return { ok: false, error: 'could not parse source' }

  const splices: Splice[] = []
  for (const edit of edits) {
    if (edit.prevText === edit.nextText) continue
    const resolved = resolveText(ctx, edit.locations, edit.prevText)
    if ('error' in resolved) return { ok: false, error: resolved.error }
    splices.push(...resolved.splices(edit.nextText))
  }

  if (splices.length === 0) return { ok: true, source }
  return applySplices(source, splices)
}

/** Which targets render text that `applyCarouselTextEdits` can rewrite. */
export function findEditableCarouselText(source: string, targets: CarouselTextTarget[]): boolean[] {
  const ctx = createContext(source)
  if (!ctx) return targets.map(() => false)
  return targets.map((target) => !('error' in resolveText(ctx, target.locations, target.text)))
}
