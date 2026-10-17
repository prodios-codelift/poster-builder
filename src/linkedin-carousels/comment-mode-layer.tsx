import { useServerFn } from '@tanstack/react-start'
import { MessageSquareIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import { addCarouselComment } from './add-carousel-comment'

type ScreenRect = { left: number; top: number; width: number; height: number }

type Draft = {
  source: string
  rect: ScreenRect
}

function closestTagged(target: EventTarget | null, root: HTMLElement): HTMLElement | null {
  if (!(target instanceof Element)) return null
  const el = target.closest('[data-tsd-source]')
  if (!(el instanceof HTMLElement)) return null
  if (!root.contains(el)) return null
  return el
}

function rectOf(el: HTMLElement): ScreenRect {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

/**
 * Dev-only overlay: while comment mode is on, highlight `[data-tsd-source]`
 * elements on the slide canvas and open a note popup on click that writes a
 * `@slide-comment` marker into the source file.
 */
export function CommentModeLayer({
  enabled,
  canvasElement,
  pageIndex,
  onExit,
}: {
  enabled: boolean
  canvasElement: HTMLElement | null
  /** 0-based slide index stored on the marker payload. */
  pageIndex: number
  onExit: () => void
}) {
  const addFn = useServerFn(addCarouselComment)
  const [hover, setHover] = useState<{ source: string; rect: ScreenRect } | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const clearDraft = useCallback(() => {
    setDraft(null)
    setNote('')
    setError(null)
    setIsSubmitting(false)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setHover(null)
      clearDraft()
      return
    }
    const previous = document.body.style.cursor
    document.body.style.cursor = 'crosshair'
    return () => {
      document.body.style.cursor = previous
    }
  }, [enabled, clearDraft])

  useEffect(() => {
    if (!enabled || !draft) return
    textareaRef.current?.focus()
  }, [enabled, draft])

  useEffect(() => {
    if (!enabled || !canvasElement) {
      setHover(null)
      return
    }

    function onPointerMove(event: PointerEvent) {
      if (draft) return
      const el = closestTagged(event.target, canvasElement!)
      if (!el) {
        setHover(null)
        return
      }
      const source = el.getAttribute('data-tsd-source')
      if (!source) {
        setHover(null)
        return
      }
      setHover({ source, rect: rectOf(el) })
    }

    function onPointerLeave() {
      if (!draft) setHover(null)
    }

    function onClick(event: MouseEvent) {
      const el = closestTagged(event.target, canvasElement!)
      if (!el) return
      const source = el.getAttribute('data-tsd-source')
      if (!source) return
      event.preventDefault()
      event.stopPropagation()
      setHover(null)
      setError(null)
      setNote('')
      setDraft({ source, rect: rectOf(el) })
    }

    canvasElement.addEventListener('pointermove', onPointerMove)
    canvasElement.addEventListener('pointerleave', onPointerLeave)
    canvasElement.addEventListener('click', onClick, true)
    return () => {
      canvasElement.removeEventListener('pointermove', onPointerMove)
      canvasElement.removeEventListener('pointerleave', onPointerLeave)
      canvasElement.removeEventListener('click', onClick, true)
    }
  }, [enabled, canvasElement, draft])

  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (draft) {
        event.preventDefault()
        event.stopPropagation()
        clearDraft()
        return
      }
      event.preventDefault()
      event.stopPropagation()
      onExit()
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [enabled, draft, clearDraft, onExit])

  async function submit() {
    if (!draft || isSubmitting) return
    const text = note.trim()
    if (!text) return
    setIsSubmitting(true)
    setError(null)
    try {
      await addFn({ data: { source: draft.source, text, page: pageIndex } })
      clearDraft()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to add comment')
      setIsSubmitting(false)
    }
  }

  if (!enabled) return null

  const popupRect = draft?.rect ?? null

  return (
    <>
      {hover && !draft ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 border-2 border-primary bg-primary/10"
          style={{
            left: hover.rect.left,
            top: hover.rect.top,
            width: hover.rect.width,
            height: hover.rect.height,
          }}
        />
      ) : null}

      {draft && popupRect ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed z-40 border-2 border-primary"
            style={{
              left: popupRect.left,
              top: popupRect.top,
              width: popupRect.width,
              height: popupRect.height,
            }}
          />
          <div
            role="dialog"
            aria-label="Add slide comment"
            className="fixed z-50 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
            style={{
              left: Math.min(
                Math.max(8, popupRect.left),
                typeof window !== 'undefined' ? window.innerWidth - 288 - 8 : popupRect.left,
              ),
              top: Math.min(
                popupRect.top + popupRect.height + 8,
                typeof window !== 'undefined' ? window.innerHeight - 200 : popupRect.top,
              ),
            }}
          >
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageSquareIcon className="size-3.5" />
              Comment
            </div>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  void submit()
                }
              }}
              placeholder="e.g. make this red"
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-none rounded-md border bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            />
            {error ? (
              <p className="mt-1.5 text-xs text-destructive" title={error}>
                {error}
              </p>
            ) : null}
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSubmitting}
                onClick={clearDraft}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting || !note.trim()}
                onClick={() => void submit()}
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {isSubmitting ? 'Saving…' : 'Add'}
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              ⌘/Ctrl+Enter to submit · Esc to cancel
            </p>
          </div>
        </>
      ) : null}
    </>
  )
}

export function CommentModeToggle({
  active,
  onToggle,
  className,
}: {
  active: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'outline'}
      aria-pressed={active}
      aria-label={active ? 'Exit comment mode' : 'Enter comment mode'}
      onClick={onToggle}
      className={cn(className)}
    >
      <MessageSquareIcon data-icon="inline-start" />
      {active ? 'Commenting' : 'Comment'}
    </Button>
  )
}
