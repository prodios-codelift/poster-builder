import { useLayoutEffect } from 'react'

import { CAROUSEL_LOC_ATTR, parseCarouselLoc } from './carousel-loc'
import {
  editKey,
  getPendingCarouselTextEdits,
  upsertCarouselTextEdit,
  type PendingCarouselEdit,
} from './carousel-text-edits'
import type { SourceLocation } from './edit-carousel-source'
import { checkCarouselText } from './save-carousel-text'
import { textHunks, type TextHunk } from './text-diff'

type FiberLike = {
  return: FiberLike | null
  memoizedProps?: unknown
}

// Tags that are part of a text run rather than a container of their own, so
// `<h1>Say it <mark>once.</mark></h1>` stays one editable target.
const INLINE_TEXT_TAGS = new Set([
  'B',
  'CODE',
  'DEL',
  'EM',
  'I',
  'INS',
  'MARK',
  'S',
  'SMALL',
  'SPAN',
  'STRONG',
  'SUB',
  'SUP',
  'U',
])

const ATTR = {
  editing: 'data-carousel-editing',
  original: 'data-carousel-original',
  key: 'data-carousel-edit-key',
  atomic: 'data-carousel-atomic',
} as const

/** Icons and images inside a text host: kept whole, never edited or deleted. */
function isAtomicContent(node: Node): node is SVGSVGElement | HTMLImageElement {
  return node instanceof SVGSVGElement || node instanceof HTMLImageElement
}

/** Vite fires `vite:afterUpdate` before React Fast Refresh (debounced) re-renders the slide. */
const HMR_REBIND_DELAY_MS = 120

function getFiber(el: Element): FiberLike | null {
  const key = Object.keys(el).find((name) => name.startsWith('__reactFiber$'))
  if (!key) return null
  return (el as unknown as Record<string, FiberLike>)[key] ?? null
}

function locProp(fiber: FiberLike): unknown {
  const props = fiber.memoizedProps
  if (!props || typeof props !== 'object') return undefined
  return (props as Record<string, unknown>)[CAROUSEL_LOC_ATTR]
}

/**
 * Source locations for `el`, nearest first. React fibers carry the
 * `data-carousel-loc` prop of component call sites too (`<Eyebrow>Copy</Eyebrow>`),
 * which never reach the DOM. React 19 fibers have no `_debugSource`.
 */
export function collectCarouselLocations(el: HTMLElement, carouselId: string): SourceLocation[] {
  const locations: SourceLocation[] = []
  const seen = new Set<string>()
  const add = (value: unknown) => {
    if (typeof value !== 'string') return
    const loc = parseCarouselLoc(value, carouselId)
    if (!loc) return
    const key = `${loc.line}:${loc.column}`
    if (seen.has(key)) return
    seen.add(key)
    locations.push(loc)
  }

  const fiber = getFiber(el)
  if (fiber) {
    for (let current: FiberLike | null = fiber; current; current = current.return) {
      add(locProp(current))
    }
  } else {
    for (let node: HTMLElement | null = el; node; node = node.parentElement) {
      add(node.getAttribute(CAROUSEL_LOC_ATTR))
    }
  }
  return locations
}

// DOM text is read from Text nodes, never `innerText`: that applies CSS such as
// `text-transform: uppercase` and would not match the source.

type DomTextPart = {
  node: Text | HTMLBRElement
  current: string
  preserveWhitespace?: boolean
}

function preservesWhitespace(el: Element | null): boolean {
  if (!el) return false
  const whiteSpace = getComputedStyle(el).whiteSpace
  return whiteSpace === 'pre' || whiteSpace === 'pre-wrap' || whiteSpace === 'break-spaces'
}

function collectDomTextPartsRaw(node: Node, out: DomTextPart[]): void {
  for (const child of node.childNodes) {
    if (child instanceof Text) {
      const preserveWhitespace = preservesWhitespace(child.parentElement)
      const current = preserveWhitespace ? child.data : child.data.replace(/\s+/g, ' ')
      if (current) out.push({ node: child, current, preserveWhitespace })
    } else if (child instanceof HTMLBRElement) {
      out.push({ node: child, current: '\n' })
    } else if (child instanceof HTMLElement) {
      collectDomTextPartsRaw(child, out)
    }
  }
}

function collectDomTextParts(el: HTMLElement): DomTextPart[] {
  const parts: DomTextPart[] = []
  collectDomTextPartsRaw(el, parts)
  // A trailing `<br>` renders no line; Chrome adds one as a placeholder when text is cleared.
  if (parts.at(-1)?.node instanceof HTMLBRElement) parts.pop()
  return parts.flatMap((part, index) => {
    if (part.preserveWhitespace || part.current === '\n') return [part]
    let current = part.current
    if (parts[index - 1]?.current === '\n') current = current.replace(/^\s+/, '')
    if (parts[index + 1]?.current === '\n') current = current.replace(/\s+$/, '')
    return current ? [{ ...part, current }] : []
  })
}

export function readEditableText(el: HTMLElement): string {
  return collectDomTextParts(el)
    .map((part) => part.current)
    .join('')
}

function textFragment(value: string): DocumentFragment {
  const fragment = document.createDocumentFragment()
  const lines = value.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) fragment.append(document.createTextNode(lines[i] ?? ''))
    if (i < lines.length - 1) fragment.append(document.createElement('br'))
  }
  return fragment
}

function replaceDomTextPart(part: DomTextPart, value: string): void {
  if (part.node instanceof Text && !value.includes('\n')) {
    part.node.data = value
    return
  }
  part.node.replaceWith(textFragment(value))
}

/** Applies one hunk with the same part rules as the source splicer. */
function applyDomHunk(el: HTMLElement, hunk: TextHunk): void {
  const spans: Array<{ part: DomTextPart; start: number; end: number }> = []
  let offset = 0
  for (const part of collectDomTextParts(el)) {
    spans.push({ part, start: offset, end: offset + part.current.length })
    offset += part.current.length
  }

  if (hunk.start === hunk.end) {
    const at = hunk.start
    const isText = (span?: { part: DomTextPart }) => span?.part.node instanceof Text
    const left = spans.find((span) => span.end === at)
    const right = spans.find((span) => span.start === at)
    const target =
      spans.find((span) => span.start < at && at < span.end) ??
      (isText(left) ? left : isText(right) ? right : (left ?? right))
    if (!target) {
      el.append(textFragment(hunk.value))
    } else if (target.part.node instanceof Text) {
      const local = at - target.start
      const text = target.part.current
      replaceDomTextPart(target.part, `${text.slice(0, local)}${hunk.value}${text.slice(local)}`)
    } else if (at === target.start) {
      target.part.node.before(textFragment(hunk.value))
    } else {
      target.part.node.after(textFragment(hunk.value))
    }
    return
  }

  let placed = false
  for (const { part, start, end } of spans) {
    if (hunk.start >= end || hunk.end <= start) continue
    const value = placed ? '' : hunk.value
    if (part.node instanceof Text) {
      const from = Math.max(hunk.start, start) - start
      const to = Math.min(hunk.end, end) - start
      replaceDomTextPart(part, `${part.current.slice(0, from)}${value}${part.current.slice(to)}`)
    } else {
      replaceDomTextPart(part, value)
    }
    placed = true
  }
}

/**
 * Rewrites only the changed ranges, in place, so React keeps owning its text
 * nodes (replacing them would leave React updating detached nodes after HMR).
 */
function setEditableText(el: HTMLElement, value: string): void {
  const current = readEditableText(el)
  if (current === value) return
  if (collectDomTextParts(el).length === 0) {
    el.append(textFragment(value))
    return
  }
  // Right to left, so the offsets of earlier hunks stay valid.
  for (const hunk of textHunks(current, value).reverse()) applyDomHunk(el, hunk)
}

function hasOnlyInlineTextChildren(el: HTMLElement): boolean {
  for (const child of el.childNodes) {
    // SSR leaves `<!-- -->` separators between adjacent text nodes.
    if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.COMMENT_NODE) continue
    // `<p>Swipe <ArrowRight /></p>`: the icon rides along with the text.
    if (isAtomicContent(child)) continue
    if (!(child instanceof HTMLElement)) return false
    if (child.tagName === 'BR') continue
    if (!INLINE_TEXT_TAGS.has(child.tagName) || !hasOnlyInlineTextChildren(child)) return false
  }
  return true
}

function isEditableTextContainer(el: HTMLElement): boolean {
  if (!el.textContent?.trim()) return false
  return hasOnlyInlineTextChildren(el)
}

/** Text containers in document order, so a heading comes before its `<mark>`. */
function findTextContainers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('*')].filter(
    (el): el is HTMLElement => el instanceof HTMLElement && isEditableTextContainer(el),
  )
}

function clearHost(el: HTMLElement): void {
  el.removeAttribute('contenteditable')
  el.removeAttribute('spellcheck')
  el.removeAttribute(ATTR.editing)
  el.removeAttribute(ATTR.original)
  el.removeAttribute(ATTR.key)
  for (const atom of el.querySelectorAll(`[${ATTR.atomic}]`)) {
    atom.removeAttribute('contenteditable')
    atom.removeAttribute(ATTR.atomic)
  }
}

function clearEditable(root: HTMLElement): void {
  for (const el of root.querySelectorAll<HTMLElement>(`[${ATTR.editing}]`)) clearHost(el)
}

function editingHost(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null
  return target.closest<HTMLElement>(`[${ATTR.editing}]`)
}

type Host = {
  el: HTMLElement
  locations: SourceLocation[]
  /** Text as it is in the source file (before any unsaved edit). */
  original: string
}

/** Text hosts on the canvas, with any unsaved edit put back after a remount. */
function prepareHosts(root: HTMLElement, carouselId: string): Host[] {
  const pending = getPendingCarouselTextEdits()
  const hosts: Host[] = []
  for (const el of findTextContainers(root)) {
    const locations = collectCarouselLocations(el, carouselId)
    if (locations.length === 0) continue
    const current = readEditableText(el)
    const bound = el.getAttribute(ATTR.original)
    const keys = new Set([editKey(locations, current)])
    if (bound !== null) keys.add(editKey(locations, bound))
    const edit = pending.find((item) => keys.has(item.key))
    if (edit && current !== edit.nextText) setEditableText(el, edit.nextText)
    const original = edit ? edit.prevText : current
    if (original.trim()) hosts.push({ el, locations, original })
  }
  return hosts
}

function applyHosts(root: HTMLElement, hosts: Host[], editable: boolean[]): void {
  const bound = new Set<HTMLElement>()
  hosts.forEach((host, index) => {
    const { el, locations, original } = host
    if (!editable[index] || !el.isConnected || !root.contains(el)) return
    // The outermost container that maps to source owns the text: a highlighted
    // heading edits as one unit, while a footer `<div>` that joins a literal
    // `<span>` with a computed one falls back to just the literal span.
    for (const owner of bound) if (owner.contains(el)) return
    bound.add(el)
    // Re-setting the same value keeps focus and caret in an element being edited.
    if (el.getAttribute('contenteditable') !== 'true') el.setAttribute('contenteditable', 'true')
    el.setAttribute('spellcheck', 'false')
    el.setAttribute(ATTR.editing, 'true')
    el.setAttribute(ATTR.original, original)
    el.setAttribute(ATTR.key, editKey(locations, original))
    // The caret can't enter an icon; React still owns the node.
    for (const atom of el.querySelectorAll('svg, img')) {
      if (!isAtomicContent(atom)) continue
      atom.setAttribute('contenteditable', 'false')
      atom.setAttribute(ATTR.atomic, 'true')
    }
  })
  for (const el of root.querySelectorAll<HTMLElement>(`[${ATTR.editing}]`)) {
    if (!bound.has(el)) clearHost(el)
  }
}

function commitHost(el: HTMLElement, carouselId: string): void {
  const original = el.getAttribute(ATTR.original)
  if (original === null) return
  const locations = collectCarouselLocations(el, carouselId)
  if (locations.length === 0) return
  const key = editKey(locations, original)
  el.setAttribute(ATTR.key, key)
  const edit: PendingCarouselEdit = {
    key,
    locations,
    prevText: original,
    nextText: readEditableText(el),
  }
  upsertCarouselTextEdit(edit)
}

/**
 * Whether an input would delete or overwrite an icon in `host`. Removing a node
 * React rendered breaks the next render, and the source still has the icon.
 * Chrome already keeps `contenteditable="false"` icons out of edits; this is the
 * backstop for browsers that delete them as a unit.
 */
function inputTouchesAtomicContent(host: HTMLElement, event: InputEvent): boolean {
  const atoms = [...host.querySelectorAll(`[${ATTR.atomic}]`)]
  if (atoms.length === 0) return false
  const ranges: Range[] = event.getTargetRanges().map((target) => {
    const range = document.createRange()
    range.setStart(target.startContainer, target.startOffset)
    range.setEnd(target.endContainer, target.endOffset)
    return range
  })
  if (ranges.length === 0) {
    const selection = getSelection()
    for (let i = 0; selection && i < selection.rangeCount; i++) ranges.push(selection.getRangeAt(i))
  }
  return ranges.some((range) => atoms.some((atom) => range.intersectsNode(atom)))
}

function insertPlainText(text: string): void {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  lines.forEach((line, index) => {
    if (index > 0) document.execCommand('insertLineBreak')
    if (line) document.execCommand('insertText', false, line)
  })
}

export type UseCarouselInlineEditOptions = {
  enabled: boolean
  carouselId: string | null
  /** Bumps when the visible slide changes so hosts are re-bound. */
  slideIndex: number
  /** Mounted slide root element (null until the scaled canvas has laid out). */
  canvasElement: HTMLElement | null
}

/**
 * Makes text on the main canvas contentEditable for a user carousel, but only
 * text the server can map back to a literal in the carousel source.
 * Themes, overview, thumbnails, and production builds stay read-only.
 */
export function useCarouselInlineEdit({
  enabled,
  carouselId,
  slideIndex,
  canvasElement,
}: UseCarouselInlineEditOptions): void {
  useLayoutEffect(() => {
    const root = canvasElement
    if (!enabled || !carouselId || !root) {
      if (root) clearEditable(root)
      return
    }

    let disposed = false
    let generation = 0
    const bind = async () => {
      const current = ++generation
      const hosts = prepareHosts(root, carouselId)
      let editable: boolean[] = []
      if (hosts.length > 0) {
        try {
          const result = await checkCarouselText({
            data: {
              carouselId,
              targets: hosts.map(({ locations, original }) => ({ locations, text: original })),
            },
          })
          editable = result.editable
        } catch {
          // Without the check, fall back to editable; save still validates each edit.
          editable = hosts.map(() => true)
        }
      }
      if (disposed || current !== generation) return
      applyHosts(root, hosts, editable)
    }

    const onInput = (event: Event) => {
      if ((event as InputEvent).isComposing) return
      const host = editingHost(event.target)
      if (host) commitHost(host, carouselId)
    }

    const onCompositionEnd = (event: Event) => {
      const host = editingHost(event.target)
      if (host) commitHost(host, carouselId)
    }

    const onBeforeInput = (event: Event) => {
      const inputEvent = event as InputEvent
      const host = editingHost(event.target)
      if (inputEvent.isComposing || !host) return
      const type = inputEvent.inputType
      if (
        (type.startsWith('insert') || type.startsWith('delete')) &&
        inputTouchesAtomicContent(host, inputEvent)
      ) {
        inputEvent.preventDefault()
      } else if (type === 'insertParagraph' || type === 'insertLineBreak') {
        inputEvent.preventDefault()
        document.execCommand('insertLineBreak')
      } else if (type === 'insertFromPaste' || type === 'insertFromDrop') {
        inputEvent.preventDefault()
        const text = inputEvent.dataTransfer?.getData('text/plain') ?? inputEvent.data
        if (text) insertPlainText(text)
      } else if (type.startsWith('format')) {
        // Bold/italic shortcuts would add markup the source does not have.
        inputEvent.preventDefault()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (editingHost(event.target)) event.stopPropagation()
    }

    void bind()

    root.addEventListener('input', onInput)
    root.addEventListener('compositionend', onCompositionEnd)
    root.addEventListener('beforeinput', onBeforeInput)
    root.addEventListener('keydown', onKeyDown)

    const hot = import.meta.hot
    let hotTimer: ReturnType<typeof setTimeout> | undefined
    const onHotUpdate = () => {
      clearTimeout(hotTimer)
      hotTimer = setTimeout(() => void bind(), HMR_REBIND_DELAY_MS)
    }
    hot?.on('vite:afterUpdate', onHotUpdate)

    return () => {
      disposed = true
      clearTimeout(hotTimer)
      root.removeEventListener('input', onInput)
      root.removeEventListener('compositionend', onCompositionEnd)
      root.removeEventListener('beforeinput', onBeforeInput)
      root.removeEventListener('keydown', onKeyDown)
      hot?.off('vite:afterUpdate', onHotUpdate)
      clearEditable(root)
    }
  }, [enabled, carouselId, slideIndex, canvasElement])
}
