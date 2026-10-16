import { useLayoutEffect } from 'react'

import {
  clearCarouselTextEdits,
  editKey,
  getPendingCarouselTextEdits,
  upsertCarouselTextEdit,
  type PendingCarouselEdit,
} from './carousel-text-edits'
import type { SourceLocation } from './edit-carousel-source'

type FiberLike = {
  return: FiberLike | null
  _debugSource?: {
    fileName?: string
    lineNumber?: number
    columnNumber?: number
  }
  memoizedProps?: {
    __source?: {
      fileName?: string
      lineNumber?: number
      columnNumber?: number
    }
  }
}

const INLINE_TAGS = new Set([
  'SPAN',
  'STRONG',
  'EM',
  'B',
  'I',
  'U',
  'BR',
  'CODE',
  'MARK',
  'SMALL',
  'SUB',
  'SUP',
  'A',
])

const ATTR = {
  editing: 'data-carousel-editing',
  original: 'data-carousel-original',
  key: 'data-carousel-edit-key',
} as const

const HOST_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, span, li, td, th, label, div'

function normalizeDebugFileName(fileName: string): string {
  return fileName.split(/[?#]/)[0].replace(/\\/g, '/')
}

function getFiber(el: Element): FiberLike | null {
  const key = Object.keys(el).find((name) => name.startsWith('__reactFiber$'))
  if (!key) return null
  return (el as unknown as Record<string, FiberLike>)[key] ?? null
}

function getSource(fiber: FiberLike) {
  return fiber._debugSource ?? fiber.memoizedProps?.__source
}

function parseTsdSource(value: string, needle: string): SourceLocation | null {
  const normalized = value.replace(/\\/g, '/')
  if (!normalized.includes(needle)) return null
  const match = normalized.match(/:(\d+):(\d+)$/)
  if (!match) return null
  const line = Number(match[1])
  const column = Number(match[2])
  if (!Number.isFinite(line) || !Number.isFinite(column)) return null
  // data-tsd-source columns are 1-based; Babel AST columns are 0-based.
  return { line, column: Math.max(0, column - 1) }
}

export function collectCarouselLocations(el: HTMLElement, carouselId: string): SourceLocation[] {
  const needle = `/carousels/${carouselId}/index.tsx`
  const locations: SourceLocation[] = []
  const seen = new Set<string>()

  const add = (loc: SourceLocation) => {
    const key = `${loc.line}:${loc.column}`
    if (seen.has(key)) return
    seen.add(key)
    locations.push(loc)
  }

  // Primary: TanStack Devtools injects data-tsd-source on host JSX (dev only).
  let node: HTMLElement | null = el
  while (node) {
    const attr = node.getAttribute('data-tsd-source')
    if (attr) {
      const loc = parseTsdSource(attr, needle)
      if (loc) add(loc)
    }
    node = node.parentElement
  }

  // Fallback: classic React __source / _debugSource when present.
  let fiber = getFiber(el)
  while (fiber) {
    const src = getSource(fiber)
    if (
      src?.fileName &&
      normalizeDebugFileName(src.fileName).includes(needle) &&
      typeof src.lineNumber === 'number' &&
      Number.isFinite(src.lineNumber)
    ) {
      add({
        line: src.lineNumber,
        column: src.columnNumber ?? 0,
      })
    }
    fiber = fiber.return
  }

  return locations
}

function hasOnlyInlineTextChildren(el: HTMLElement): boolean {
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) continue
    if (child.nodeType !== Node.ELEMENT_NODE) return false
    const childEl = child as HTMLElement
    if (!INLINE_TAGS.has(childEl.tagName)) return false
    if (!hasOnlyInlineTextChildren(childEl)) return false
  }
  return true
}

function isEditableHost(el: HTMLElement): boolean {
  if (el.closest('svg, script, style')) return false
  if (!el.textContent?.trim()) return false
  return hasOnlyInlineTextChildren(el)
}

function readEditableText(el: HTMLElement): string {
  return (el.innerText ?? el.textContent ?? '').replace(/\u00a0/g, ' ').trim()
}

function clearEditable(root: HTMLElement): void {
  for (const el of root.querySelectorAll<HTMLElement>(`[${ATTR.editing}]`)) {
    el.removeAttribute('contenteditable')
    el.removeAttribute('spellcheck')
    el.removeAttribute(ATTR.editing)
    el.removeAttribute(ATTR.original)
    el.removeAttribute(ATTR.key)
  }
}

function reapplyPending(root: HTMLElement, carouselId: string): void {
  const pending = getPendingCarouselTextEdits()
  if (pending.length === 0) return

  for (const el of root.querySelectorAll<HTMLElement>(`[${ATTR.editing}]`)) {
    const locations = collectCarouselLocations(el, carouselId)
    if (locations.length === 0) continue
    const original = el.getAttribute(ATTR.original) ?? readEditableText(el)
    const key = editKey(locations, original)
    const edit = pending.find((item) => item.key === key)
    if (!edit) continue
    el.setAttribute(ATTR.key, key)
    el.setAttribute(ATTR.original, edit.prevText)
    if (readEditableText(el) !== edit.nextText) {
      el.innerText = edit.nextText
    }
  }
}

function commitHost(el: HTMLElement, carouselId: string): void {
  const original = el.getAttribute(ATTR.original)
  if (original === null) return
  const locations = collectCarouselLocations(el, carouselId)
  if (locations.length === 0) {
    el.innerText = original
    return
  }
  const nextText = readEditableText(el)
  const key = editKey(locations, original)
  el.setAttribute(ATTR.key, key)
  const edit: PendingCarouselEdit = {
    key,
    locations,
    prevText: original,
    nextText,
  }
  upsertCarouselTextEdit(edit)
}

function bindEditableHosts(root: HTMLElement, carouselId: string): void {
  clearEditable(root)

  for (const el of root.querySelectorAll<HTMLElement>(HOST_SELECTOR)) {
    if (!isEditableHost(el)) continue
    const deeper = [...el.querySelectorAll<HTMLElement>(HOST_SELECTOR)].filter(
      (child) => child !== el && isEditableHost(child),
    )
    if (deeper.length > 0) continue

    const locations = collectCarouselLocations(el, carouselId)
    if (locations.length === 0) continue

    const original = readEditableText(el)
    if (!original) continue

    el.setAttribute('contenteditable', 'plaintext-only')
    if (el.contentEditable !== 'plaintext-only' && el.contentEditable !== 'true') {
      el.setAttribute('contenteditable', 'true')
    }
    el.setAttribute('spellcheck', 'false')
    el.setAttribute(ATTR.editing, 'true')
    el.setAttribute(ATTR.original, original)
    el.setAttribute(ATTR.key, editKey(locations, original))
  }

  reapplyPending(root, carouselId)
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
 * Makes leaf text hosts on the main canvas contentEditable for a user carousel.
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

    const onInput = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.hasAttribute(ATTR.editing)) return
      commitHost(target, carouselId)
    }

    const onBeforeInput = (event: Event) => {
      const inputEvent = event as InputEvent
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.hasAttribute(ATTR.editing)) return

      if (inputEvent.inputType === 'insertFromPaste') {
        inputEvent.preventDefault()
        const text = inputEvent.dataTransfer?.getData('text/plain') ?? ''
        document.execCommand('insertText', false, text.replace(/\r\n?/g, '\n'))
        commitHost(target, carouselId)
        return
      }

      if (
        inputEvent.inputType === 'insertParagraph' ||
        inputEvent.inputType === 'insertLineBreak'
      ) {
        inputEvent.preventDefault()
        document.execCommand('insertText', false, '\n')
        commitHost(target, carouselId)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.hasAttribute(ATTR.editing)) return
      event.stopPropagation()
    }

    // Bind synchronously — rAF may not fire in background tabs.
    bindEditableHosts(root, carouselId)

    root.addEventListener('input', onInput)
    root.addEventListener('beforeinput', onBeforeInput)
    root.addEventListener('keydown', onKeyDown)

    const hot = import.meta.hot
    const onHotUpdate = () => {
      bindEditableHosts(root, carouselId)
    }
    hot?.on('vite:afterUpdate', onHotUpdate)

    return () => {
      root.removeEventListener('input', onInput)
      root.removeEventListener('beforeinput', onBeforeInput)
      root.removeEventListener('keydown', onKeyDown)
      hot?.off('vite:afterUpdate', onHotUpdate)
      clearEditable(root)
    }
  }, [enabled, carouselId, slideIndex, canvasElement])
}

export { clearCarouselTextEdits }
