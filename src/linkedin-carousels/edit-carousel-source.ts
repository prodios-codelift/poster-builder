import { parse } from '@babel/parser'
import type { File, Node } from '@babel/types'
import * as t from '@babel/types'

export type SourceLocation = {
  line: number
  column: number
}

export type CarouselTextEdit = {
  /** Fiber source locations inside the carousel file, nearest first. */
  locations: SourceLocation[]
  prevText: string
  nextText: string
}

export type ApplyCarouselTextResult = { ok: true; source: string } | { ok: false; error: string }

type Splice = { from: number; to: number; text: string }

type TextCandidate = {
  current: string
  from: number
  to: number
  format: (value: string) => string
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

function walkAll(ast: Node, visit: (node: Node) => void): void {
  const recurse = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const child of node) recurse(child)
      return
    }
    const n = node as Node
    if (typeof n.type !== 'string') return
    visit(n)
    for (const key of Object.keys(n)) {
      if (SKIP_KEYS.has(key)) continue
      recurse((n as unknown as Record<string, unknown>)[key])
    }
  }
  recurse(ast)
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

export function jsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

export function formatJsxText(value: string): string {
  if (/[{}<>]/.test(value) || /^\s|\s$/.test(value) || value === '') {
    return `{${jsString(value)}}`
  }
  return value
}

export function formatJsxAttrValue(value: string, preferDouble = true): string {
  if (preferDouble && /^[^"\\<>&{}\n\r]*$/.test(value)) return `"${value}"`
  return `{${jsString(value)}}`
}

function formatStringLiteral(node: t.StringLiteral, value: string): string {
  const raw = node.extra?.raw
  if (typeof raw === 'string' && raw.startsWith('"') && /^[^"\\<>&{}\n\r]*$/.test(value)) {
    return `"${value}"`
  }
  return jsString(value)
}

function compactText(value: string): string {
  return value.replace(/\s+/g, '')
}

function textsMatch(current: string, expected: string): boolean {
  return current === expected || compactText(current) === compactText(expected)
}

function locMatches(node: Node, line: number, column: number): boolean {
  const start = node.loc?.start
  if (!start || start.line !== line) return false
  // React fiber columns are usually Babel's 0-based columns; tolerate 1-based.
  return start.column === column || start.column === column - 1
}

function pushStringLiteralCandidate(node: t.StringLiteral, out: TextCandidate[]): void {
  out.push({
    current: node.value,
    from: node.start ?? 0,
    to: node.end ?? 0,
    format: (value) => formatStringLiteral(node, value),
  })
}

function pushJsxTextCandidate(
  child: t.JSXText,
  parent: t.JSXElement | t.JSXFragment,
  out: TextCandidate[],
): void {
  const current = child.value.trim()
  if (!current) return

  const meaningful = parent.children.filter((c) => {
    if (t.isJSXText(c)) return c.value.trim() !== ''
    return true
  })
  const isSole = meaningful.length === 1 && meaningful[0] === child

  out.push({
    current,
    from: isSole ? (parent.children[0]?.start ?? child.start ?? 0) : (child.start ?? 0),
    to: isSole
      ? (parent.children[parent.children.length - 1]?.end ?? child.end ?? 0)
      : (child.end ?? 0),
    format: formatJsxText,
  })
}

function collectCandidatesUnder(node: Node, out: TextCandidate[]): void {
  if (t.isStringLiteral(node)) {
    pushStringLiteralCandidate(node, out)
    return
  }

  if (t.isJSXText(node)) {
    return
  }

  if (t.isJSXElement(node) || t.isJSXFragment(node)) {
    for (const child of node.children) {
      if (t.isJSXText(child)) {
        pushJsxTextCandidate(child, node, out)
      } else if (t.isJSXExpressionContainer(child)) {
        const expr = child.expression
        if (t.isStringLiteral(expr)) {
          out.push({
            current: expr.value,
            from: child.start ?? 0,
            to: child.end ?? 0,
            format: (value) => `{${jsString(value)}}`,
          })
        } else {
          collectCandidatesUnder(expr, out)
        }
      } else {
        collectCandidatesUnder(child, out)
      }
    }

    if (t.isJSXElement(node)) {
      for (const attr of node.openingElement.attributes) {
        if (!t.isJSXAttribute(attr) || !attr.value) continue
        const name = t.isJSXIdentifier(attr.name) ? attr.name.name : null
        // Skip non-copy attributes that appear in carousels.
        if (name === 'className' || name === 'src' || name === 'alt' || name === 'style') continue
        if (t.isStringLiteral(attr.value)) {
          pushStringLiteralCandidate(attr.value, out)
        } else if (t.isJSXExpressionContainer(attr.value)) {
          collectCandidatesUnder(attr.value.expression, out)
        }
      }
    }
    return
  }

  walkAll(node, (child) => {
    if (child === node) return
    if (t.isStringLiteral(child)) pushStringLiteralCandidate(child, out)
  })
}

function collectAllCandidates(ast: File): TextCandidate[] {
  const out: TextCandidate[] = []
  walkAll(ast, (node) => {
    if (t.isJSXElement(node) || t.isJSXFragment(node)) {
      for (const child of node.children) {
        if (t.isJSXText(child)) pushJsxTextCandidate(child, node, out)
        else if (t.isJSXExpressionContainer(child) && t.isStringLiteral(child.expression)) {
          out.push({
            current: child.expression.value,
            from: child.start ?? 0,
            to: child.end ?? 0,
            format: (value) => `{${jsString(value)}}`,
          })
        }
      }
    }
    if (t.isJSXAttribute(node) && node.value) {
      const name = t.isJSXIdentifier(node.name) ? node.name.name : null
      if (name === 'className' || name === 'src' || name === 'alt' || name === 'style') return
      if (t.isStringLiteral(node.value)) pushStringLiteralCandidate(node.value, out)
      else if (t.isJSXExpressionContainer(node.value) && t.isStringLiteral(node.value.expression)) {
        pushStringLiteralCandidate(node.value.expression, out)
      } else if (t.isJSXExpressionContainer(node.value)) {
        walkAll(node.value.expression, (child) => {
          if (t.isStringLiteral(child)) pushStringLiteralCandidate(child, out)
        })
      }
    }
    // Ternary / expression string literals inside JSX expression containers.
    if (
      t.isJSXExpressionContainer(node) &&
      !t.isJSXAttribute(node as unknown as Node) &&
      t.isStringLiteral(node.expression)
    ) {
      // Already handled via children walk when parent is JSX.
    }
  })

  // Also catch string literals used in JSX expressions like ternaries that are
  // not attribute values — walk expression containers under JSX children.
  walkAll(ast, (node) => {
    if (!t.isJSXExpressionContainer(node)) return
    if (t.isStringLiteral(node.expression)) return
    walkAll(node.expression, (child) => {
      if (t.isStringLiteral(child)) pushStringLiteralCandidate(child, out)
    })
  })

  return out
}

function candidatesAtLocation(ast: File, line: number, column: number): TextCandidate[] {
  const out: TextCandidate[] = []
  const seen = new Set<string>()

  const add = (candidates: TextCandidate[]) => {
    for (const candidate of candidates) {
      const key = `${candidate.from}:${candidate.to}:${candidate.current}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(candidate)
    }
  }

  walkAll(ast, (node) => {
    if (!locMatches(node, line, column)) return

    if (t.isStringLiteral(node)) {
      add([
        {
          current: node.value,
          from: node.start ?? 0,
          to: node.end ?? 0,
          format: (value) => formatStringLiteral(node, value),
        },
      ])
      return
    }

    if (t.isJSXText(node)) {
      const current = node.value.trim()
      if (current) {
        add([
          {
            current,
            from: node.start ?? 0,
            to: node.end ?? 0,
            format: formatJsxText,
          },
        ])
      }
      return
    }

    if (t.isJSXElement(node) || t.isJSXFragment(node) || t.isJSXOpeningElement(node)) {
      const element = t.isJSXOpeningElement(node) ? findJsxElementForOpening(ast, node) : node
      if (element) {
        const local: TextCandidate[] = []
        collectCandidatesUnder(element, local)
        add(local)
      }
    }
  })

  return out
}

function findJsxElementForOpening(ast: File, opening: t.JSXOpeningElement): t.JSXElement | null {
  let found: t.JSXElement | null = null
  walkAll(ast, (node) => {
    if (t.isJSXElement(node) && node.openingElement === opening) {
      found = node
    }
  })
  return found
}

function pickCandidate(candidates: TextCandidate[], prevText: string): TextCandidate | null {
  const matches = candidates.filter((c) => textsMatch(c.current, prevText))
  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0] ?? null
  const exact = matches.filter((c) => c.current === prevText)
  if (exact.length === 1) return exact[0] ?? null
  return null
}

function resolveEdit(ast: File, edit: CarouselTextEdit): TextCandidate | { error: string } {
  if (edit.prevText === edit.nextText) {
    return { error: 'no change' }
  }

  for (const loc of edit.locations) {
    const atLoc = candidatesAtLocation(ast, loc.line, loc.column)
    const hit = pickCandidate(atLoc, edit.prevText)
    if (hit) return hit
  }

  const unique = pickCandidate(collectAllCandidates(ast), edit.prevText)
  if (unique) return unique

  return { error: 'could not find a unique string literal for this edit' }
}

function applySplices(source: string, splices: Splice[]): ApplyCarouselTextResult {
  const ordered = [...splices].sort((a, b) => b.from - a.from || b.to - a.to)
  let next = source
  for (const splice of ordered) {
    next = next.slice(0, splice.from) + splice.text + next.slice(splice.to)
  }
  if (!parseCarouselSource(next)) {
    return { ok: false, error: 'edit would produce invalid source' }
  }
  return { ok: true, source: next }
}

/**
 * Splice carousel text edits into source. Applies from the end of the file so
 * earlier offsets stay valid. Rejects edits that are not string literals or
 * that would make the file fail to parse.
 */
export function applyCarouselTextEdits(
  source: string,
  edits: CarouselTextEdit[],
): ApplyCarouselTextResult {
  if (edits.length === 0) return { ok: true, source }

  const ast = parseCarouselSource(source)
  if (!ast) return { ok: false, error: 'could not parse source' }

  const splices: Splice[] = []
  const usedRanges = new Set<string>()

  for (const edit of edits) {
    const resolved = resolveEdit(ast, edit)
    if ('error' in resolved) {
      if (resolved.error === 'no change') continue
      return { ok: false, error: resolved.error }
    }

    const rangeKey = `${resolved.from}:${resolved.to}`
    if (usedRanges.has(rangeKey)) {
      return { ok: false, error: 'overlapping edits target the same source range' }
    }
    usedRanges.add(rangeKey)

    splices.push({
      from: resolved.from,
      to: resolved.to,
      text: resolved.format(edit.nextText),
    })
  }

  if (splices.length === 0) return { ok: true, source }
  return applySplices(source, splices)
}
