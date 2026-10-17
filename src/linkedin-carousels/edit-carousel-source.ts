import { parse } from '@babel/parser'
import type { File, Node } from '@babel/types'
import * as t from '@babel/types'

export type CarouselTextEdit = {
  /** Project-relative source file (from `data-slide-file`). */
  file: string
  /** "line:column" of the JSX element (from `data-slide-position`). */
  position: string
  prevText: string
  nextText: string
}

export type ApplyCarouselTextResult = { ok: true; source: string } | { ok: false; error: string }

type Splice = { from: number; to: number; text: string }

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

function findNode(ast: File, match: (node: Node) => boolean): Node | null {
  let found: Node | null = null
  const recurse = (node: unknown): void => {
    if (found || !node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const child of node) recurse(child)
      return
    }
    const n = node as Node
    if (typeof n.type !== 'string') return
    if (match(n)) {
      found = n
      return
    }
    for (const key of Object.keys(n)) {
      if (!SKIP_KEYS.has(key)) recurse((n as unknown as Record<string, unknown>)[key])
    }
  }
  recurse(ast)
  return found
}

export function parseCarouselSource(source: string): File | null {
  try {
    return parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
      errorRecovery: true,
      ranges: true,
    })
  } catch {
    return null
  }
}

export function parsePosition(position: string): { line: number; column: number } | null {
  const match = /^(\d+):(\d+)$/.exec(position)
  return match ? { line: Number(match[1]), column: Number(match[2]) } : null
}

export function jsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

/** Plain JSX text when safe, otherwise a `{'…'}` expression. */
export function formatJsxText(value: string): string {
  if (/[{}<>\n]|&\w+;|&#/.test(value) || /^\s|\s$/.test(value) || value === '') {
    return `{${jsString(value)}}`
  }
  return value
}

function compactText(value: string): string {
  return value.replace(/\s+/g, '')
}

/**
 * Splice text edits into carousel source. Each edit targets the JSX element
 * that starts at exactly `position`; `prevText` is only a safety check that the
 * file has not moved under the editor. Applies from the end of the file so
 * earlier offsets stay valid and rejects output that fails to parse.
 */
export function applyCarouselTextEdits(
  source: string,
  edits: CarouselTextEdit[],
): ApplyCarouselTextResult {
  const changed = edits.filter((edit) => edit.prevText !== edit.nextText)
  if (changed.length === 0) return { ok: true, source }

  const ast = parseCarouselSource(source)
  if (!ast) return { ok: false, error: 'could not parse source' }

  const splices: Splice[] = []
  const used = new Set<number>()

  for (const edit of changed) {
    const pos = parsePosition(edit.position)
    if (!pos) return { ok: false, error: `invalid position: ${edit.position}` }

    const element = findNode(
      ast,
      (n) =>
        t.isJSXElement(n) && n.loc?.start.line === pos.line && n.loc.start.column === pos.column,
    ) as t.JSXElement | null
    if (!element) {
      return { ok: false, error: `no element at ${edit.file}:${edit.position}; reload and retry` }
    }

    // The editable text is the element's one non-blank text child.
    const candidates = element.children.filter(
      (child): child is t.JSXText | t.JSXExpressionContainer =>
        (t.isJSXText(child) && child.value.trim() !== '') ||
        (t.isJSXExpressionContainer(child) &&
          t.isStringLiteral(child.expression) &&
          child.expression.value.trim() !== ''),
    )
    const onlyText = element.children.every(
      (child) => candidates.includes(child as never) || (t.isJSXText(child) && !child.value.trim()),
    )
    if (candidates.length !== 1 || !onlyText) {
      return { ok: false, error: `${edit.file}:${edit.position} is not a single text element` }
    }
    const node = candidates[0]
    const current = t.isJSXText(node) ? node.value : (node.expression as t.StringLiteral).value
    if (compactText(current) !== compactText(edit.prevText)) {
      return { ok: false, error: `text at ${edit.file}:${edit.position} changed; reload and retry` }
    }
    if (used.has(node.start!)) {
      return { ok: false, error: 'overlapping edits target the same source range' }
    }
    used.add(node.start!)

    if (t.isJSXExpressionContainer(node)) {
      splices.push({ from: node.start!, to: node.end!, text: `{${jsString(edit.nextText)}}` })
      continue
    }
    // Keep the surrounding indentation/newlines; only replace the text core.
    const raw = source.slice(node.start!, node.end!)
    const lead = raw.length - raw.trimStart().length
    const trail = raw.length - raw.trimEnd().length
    splices.push({
      from: node.start! + lead,
      to: node.end! - trail,
      text: formatJsxText(edit.nextText),
    })
  }

  splices.sort((a, b) => b.from - a.from)
  let next = source
  for (const splice of splices) {
    next = next.slice(0, splice.from) + splice.text + next.slice(splice.to)
  }
  if (!parseCarouselSource(next)) {
    return { ok: false, error: 'edit would produce invalid source' }
  }
  return { ok: true, source: next }
}
