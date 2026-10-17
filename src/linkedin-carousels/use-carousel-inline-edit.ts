import { useLayoutEffect } from 'react'

import {
  clearCarouselTextEdits,
  editKey,
  getPendingCarouselTextEdits,
  upsertCarouselTextEdit,
} from './carousel-text-edits'

/**
 * Elements are stamped at compile time by `vite-plugin-slide-source.ts` with
 * data-slide-file / data-slide-position / data-slide-element-type.
 */
const TEXT_SELECTOR = '[data-slide-element-type="text"]'
const ORIGINAL_ATTR = 'data-slide-original'

function readText(el: HTMLElement): string {
  return (el.innerText ?? el.textContent ?? '').replace(/ /g, ' ').trim()
}

function sourceOf(el: HTMLElement): { file: string; position: string } | null {
  const file = el.dataset.slideFile
  const position = el.dataset.slidePosition
  return file && position ? { file, position } : null
}

function stopEditing(el: HTMLElement): void {
  el.removeAttribute('contenteditable')
  el.removeAttribute('spellcheck')
}

function clearEditing(root: HTMLElement): void {
  for (const el of root.querySelectorAll<HTMLElement>(`${TEXT_SELECTOR}[contenteditable]`)) {
    stopEditing(el)
  }
}

function startEditing(el: HTMLElement): void {
  if (el.hasAttribute('contenteditable')) return
  if (!el.hasAttribute(ORIGINAL_ATTR)) el.setAttribute(ORIGINAL_ATTR, readText(el))
  el.setAttribute('contenteditable', 'plaintext-only')
  if (el.contentEditable !== 'plaintext-only' && el.contentEditable !== 'true') {
    el.setAttribute('contenteditable', 'true')
  }
  el.setAttribute('spellcheck', 'false')
  el.focus()
}

function commit(el: HTMLElement): void {
  const source = sourceOf(el)
  const prevText = el.getAttribute(ORIGINAL_ATTR)
  if (!source || prevText === null) return
  upsertCarouselTextEdit({
    key: editKey(source.file, source.position),
    ...source,
    prevText,
    nextText: readText(el),
  })
}

/** After a rebind (slide change, HMR) put unsaved edits back into the DOM. */
function reapplyPending(root: HTMLElement): void {
  const pending = new Map(getPendingCarouselTextEdits().map((edit) => [edit.key, edit]))
  if (pending.size === 0) return
  for (const el of root.querySelectorAll<HTMLElement>(TEXT_SELECTOR)) {
    const source = sourceOf(el)
    const edit = source && pending.get(editKey(source.file, source.position))
    if (!edit || readText(el) !== edit.prevText) continue
    el.setAttribute(ORIGINAL_ATTR, edit.prevText)
    el.innerText = edit.nextText
  }
}

export type UseCarouselInlineEditOptions = {
  enabled: boolean
  carouselId: string | null
  /** Bumps when the visible slide changes so edits are re-applied. */
  slideIndex: number
  /** Mounted slide root element (null until the scaled canvas has laid out). */
  canvasElement: HTMLElement | null
}

/**
 * Click-to-edit for text elements on the main canvas of a user carousel.
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
      if (root) clearEditing(root)
      return
    }

    const textTarget = (event: Event): HTMLElement | null => {
      const target = event.target
      return target instanceof Element ? target.closest<HTMLElement>(TEXT_SELECTOR) : null
    }

    const onClick = (event: MouseEvent) => {
      const el = textTarget(event)
      if (el) startEditing(el)
    }

    const onFocusOut = (event: FocusEvent) => {
      const el = textTarget(event)
      if (!el?.hasAttribute('contenteditable')) return
      commit(el)
      stopEditing(el)
    }

    const onInput = (event: Event) => {
      const el = textTarget(event)
      if (el?.hasAttribute('contenteditable')) commit(el)
    }

    const onBeforeInput = (event: Event) => {
      const inputEvent = event as InputEvent
      const el = textTarget(event)
      if (!el?.hasAttribute('contenteditable')) return

      if (inputEvent.inputType === 'insertFromPaste') {
        inputEvent.preventDefault()
        const text = inputEvent.dataTransfer?.getData('text/plain') ?? ''
        document.execCommand('insertText', false, text.replace(/\r\n?/g, '\n'))
        commit(el)
      } else if (
        inputEvent.inputType === 'insertParagraph' ||
        inputEvent.inputType === 'insertLineBreak'
      ) {
        inputEvent.preventDefault()
        document.execCommand('insertText', false, '\n')
        commit(el)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const el = textTarget(event)
      if (!el?.hasAttribute('contenteditable')) return
      // Keep arrow keys etc. from navigating slides while typing.
      event.stopPropagation()
      if (event.key === 'Escape') el.blur()
    }

    reapplyPending(root)

    root.addEventListener('click', onClick)
    root.addEventListener('focusout', onFocusOut)
    root.addEventListener('input', onInput)
    root.addEventListener('beforeinput', onBeforeInput)
    root.addEventListener('keydown', onKeyDown)

    const hot = import.meta.hot
    const onHotUpdate = () => reapplyPending(root)
    hot?.on('vite:afterUpdate', onHotUpdate)

    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('focusout', onFocusOut)
      root.removeEventListener('input', onInput)
      root.removeEventListener('beforeinput', onBeforeInput)
      root.removeEventListener('keydown', onKeyDown)
      hot?.off('vite:afterUpdate', onHotUpdate)
      clearEditing(root)
    }
  }, [enabled, carouselId, slideIndex, canvasElement])
}

export { clearCarouselTextEdits }
