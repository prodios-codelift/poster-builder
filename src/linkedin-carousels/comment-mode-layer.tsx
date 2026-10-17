import { MessageSquareIcon, Trash2Icon } from 'lucide-react'
import type { ComponentProps, ReactNode, RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import { type CarouselComment, parseTsdSource } from './carousel-comments'
import type { CarouselCommentsState } from './use-carousel-comments'

type ScreenRect = { left: number; top: number; width: number; height: number }
type Size = { width: number; height: number }

type Draft = { element: HTMLElement; source: string }

type Layout = {
  pins: Record<string, { frame: ScreenRect; anchor: ScreenRect }>
  hoverFrame: ScreenRect | null
  draftFrame: ScreenRect | null
}

const EMPTY_LAYOUT: Layout = { pins: {}, hoverFrame: null, draftFrame: null }

const PIN = 24
const PIN_STACK = 20
const GAP = 8
const CARD_WIDTH = 288
const SUBMIT_HINT = '⌘/Ctrl+Enter'

// Writing a marker reloads the slide through HMR, which can briefly leave a
// pin without its anchor. Remember each pin's last frame across renders and
// remounts so it doesn't jump to the fallback corner in between.
const rememberedFrames = new Map<string, ScreenRect>()

// A speech bubble with its tail at the bottom-left; the hotspot sits on the
// tail so the pointer "stamps" where the comment will land.
const COMMENT_CURSOR_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>" +
  "<path d='M12 3a9 9 0 0 1 9 9a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 9-9z' " +
  "fill='#fff' stroke='#0ea5e9' stroke-width='1.75' stroke-linejoin='round'/></svg>"
const COMMENT_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(COMMENT_CURSOR_SVG)}") 3 21, crosshair`
const COMMENT_CURSOR_CSS = `[data-comment-mode], [data-comment-mode] * { cursor: ${COMMENT_CURSOR} !important; }`

function normalizeFile(file: string): string {
  return file.replace(/\\/g, '/').replace(/^\//, '')
}

/** Nearest `[data-tsd-source]` ancestor inside `root` that belongs to `file`. */
function closestTagged(
  target: EventTarget | null,
  root: HTMLElement,
  file: string,
): { element: HTMLElement; source: string } | null {
  let el = target instanceof Element ? target.closest('[data-tsd-source]') : null
  while (el instanceof HTMLElement && root.contains(el)) {
    const source = el.getAttribute('data-tsd-source') ?? ''
    const parsed = parseTsdSource(source)
    if (parsed && normalizeFile(parsed.file) === file) return { element: el, source }
    el = el.parentElement?.closest('[data-tsd-source]') ?? null
  }
  return null
}

function rectOf(el: Element): ScreenRect {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

function sameRect(a: ScreenRect | null, b: ScreenRect | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height
}

function sameLayout(a: Layout, b: Layout): boolean {
  if (!sameRect(a.hoverFrame, b.hoverFrame) || !sameRect(a.draftFrame, b.draftFrame)) return false
  const ids = Object.keys(a.pins)
  if (ids.length !== Object.keys(b.pins).length) return false
  return ids.every(
    (id) =>
      b.pins[id] &&
      sameRect(a.pins[id].frame, b.pins[id].frame) &&
      sameRect(a.pins[id].anchor, b.pins[id].anchor),
  )
}

/** Pin sits on the frame's top-right corner; `stack` shifts extra pins left. */
function pinRect(frame: ScreenRect, stack = 0): ScreenRect {
  return {
    left: frame.left + frame.width - PIN + 3 - stack * PIN_STACK,
    top: frame.top - PIN + 3,
    width: PIN,
    height: PIN,
  }
}

function viewport(): Size {
  return { width: window.innerWidth, height: window.innerHeight }
}

/** Right of the anchor, flipped left when it would overflow, clamped to the viewport. */
function placeBeside(anchor: ScreenRect, size: Size, bounds: Size): { left: number; top: number } {
  let left = anchor.left + anchor.width + GAP
  if (left + size.width > bounds.width - GAP) left = anchor.left - size.width - GAP
  if (left < GAP) left = Math.max(GAP, Math.min(anchor.left, bounds.width - size.width - GAP))
  const top = Math.max(GAP, Math.min(anchor.top, bounds.height - size.height - GAP))
  return { left, top }
}

/** Rendered elements of `file` on the canvas, keyed by 1-based source line. */
function indexByLine(
  root: HTMLElement,
  file: string,
): Map<number, { el: HTMLElement; column: number }[]> {
  const index = new Map<number, { el: HTMLElement; column: number }[]>()
  for (const el of root.querySelectorAll<HTMLElement>('[data-tsd-source]')) {
    const parsed = parseTsdSource(el.getAttribute('data-tsd-source') ?? '')
    if (!parsed || normalizeFile(parsed.file) !== file) continue
    const list = index.get(parsed.line) ?? []
    list.push({ el, column: parsed.column })
    index.set(parsed.line, list)
  }
  return index
}

/**
 * The element a comment points at. Columns can drift when the slide-source
 * plugin stamps attributes earlier on the same line, so fall back to the
 * first element on that line.
 */
function findAnchor(
  index: Map<number, { el: HTMLElement; column: number }[]>,
  comment: CarouselComment,
): HTMLElement | null {
  if (!comment.target) return null
  const candidates = index.get(comment.target.line)
  if (!candidates?.length) return null
  return (candidates.find((c) => c.column === comment.target!.column) ?? candidates[0]).el
}

function useMeasuredSize(
  fallback: Size,
  mountKey: unknown = null,
): [RefObject<HTMLDivElement | null>, Size] {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>(fallback)
  useLayoutEffect(() => {
    void mountKey
    const node = ref.current
    if (!node) return
    const update = () => {
      const next = { width: node.offsetWidth, height: node.offsetHeight }
      setSize((previous) =>
        previous.width === next.width && previous.height === next.height ? previous : next,
      )
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [mountKey])
  return [ref, size]
}

/**
 * Dev-only overlay: while comment mode is on, highlight `[data-tsd-source]`
 * elements on the slide canvas, open a note popup on click that writes a
 * `@slide-comment` marker into the source file, and pin every pending comment
 * to its element so it can be read, edited or deleted.
 */
export function CommentModeLayer({
  enabled,
  canvasElement,
  pageIndex,
  file,
  comments,
  error,
  onAdd,
  onUpdate,
  onRemove,
  onExit,
}: {
  enabled: boolean
  canvasElement: HTMLElement | null
  /** 0-based slide index stored on the marker payload. */
  pageIndex: number
  /** Project-relative source file of the open carousel or theme. */
  file: string | null
  comments: CarouselComment[]
  error: string | null
  onAdd: CarouselCommentsState['add']
  onUpdate: CarouselCommentsState['update']
  onRemove: CarouselCommentsState['remove']
  onExit: () => void
}) {
  const [hover, setHover] = useState<HTMLElement | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [layout, setLayout] = useState<Layout>(EMPTY_LAYOUT)

  const reset = useCallback(() => {
    setHover(null)
    setDraft(null)
    setOpenId(null)
    setHoverId(null)
  }, [])

  useEffect(() => {
    if (!enabled) reset()
  }, [enabled, reset])

  // Bubble cursor across the whole slide, overriding any cursor the slide's
  // own elements set.
  useEffect(() => {
    if (!enabled || !canvasElement) return
    const style = document.createElement('style')
    style.textContent = COMMENT_CURSOR_CSS
    document.head.appendChild(style)
    canvasElement.setAttribute('data-comment-mode', '')
    return () => {
      style.remove()
      canvasElement.removeAttribute('data-comment-mode')
    }
  }, [enabled, canvasElement])

  useEffect(() => {
    void pageIndex
    void file
    reset()
  }, [pageIndex, file, reset])

  useLayoutEffect(() => {
    if (!enabled || !canvasElement || !file) {
      setLayout(EMPTY_LAYOUT)
      return
    }
    let raf = 0
    const measure = () => {
      const index = indexByLine(canvasElement, file)
      const canvas = rectOf(canvasElement)
      const pins: Layout['pins'] = {}
      const stacks = new Map<HTMLElement | null, number>()
      for (const comment of comments) {
        // Slides often share a wrapper component, so the target alone would
        // match on every slide; the stored page decides.
        if (comment.page !== undefined && comment.page !== pageIndex) continue
        const key = `${file}:${comment.id}`
        const anchor = findAnchor(index, comment)
        let frame: ScreenRect | null = null
        if (anchor) {
          frame = rectOf(anchor)
          rememberedFrames.set(key, frame)
        } else if (comment.page === pageIndex) {
          frame = rememberedFrames.get(key) ?? {
            left: canvas.left + canvas.width - 72,
            top: canvas.top + 24,
            width: 48,
            height: 48,
          }
        }
        if (!frame) continue
        const stack = stacks.get(anchor) ?? 0
        stacks.set(anchor, stack + 1)
        pins[comment.id] = { frame, anchor: pinRect(frame, stack) }
      }
      setLayout((previous) => {
        const next: Layout = {
          pins,
          hoverFrame: hover?.isConnected ? rectOf(hover) : null,
          draftFrame: !draft
            ? null
            : draft.element.isConnected
              ? rectOf(draft.element)
              : previous.draftFrame,
        }
        return sameLayout(previous, next) ? previous : next
      })
    }
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }
    // Follow the canvas for a moment so scale transitions and HMR settle.
    const stopAt = performance.now() + 420
    const track = () => {
      measure()
      raf = performance.now() < stopAt ? requestAnimationFrame(track) : 0
    }
    track()
    const resize = new ResizeObserver(schedule)
    resize.observe(canvasElement)
    const mutations = new MutationObserver(schedule)
    mutations.observe(canvasElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tsd-source', 'style', 'class'],
    })
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)
    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      mutations.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
    }
  }, [enabled, canvasElement, file, comments, pageIndex, hover, draft])

  useEffect(() => {
    if (!enabled || !canvasElement || !file) {
      setHover(null)
      return
    }

    function onPointerMove(event: PointerEvent) {
      if (draft) return
      setHover(closestTagged(event.target, canvasElement!, file!)?.element ?? null)
    }

    function onPointerLeave() {
      setHover(null)
    }

    function onClick(event: MouseEvent) {
      const hit = closestTagged(event.target, canvasElement!, file!)
      if (!hit) return
      event.preventDefault()
      event.stopPropagation()
      setHover(null)
      setOpenId(null)
      setDraft(hit)
    }

    canvasElement.addEventListener('pointermove', onPointerMove)
    canvasElement.addEventListener('pointerleave', onPointerLeave)
    canvasElement.addEventListener('click', onClick, true)
    return () => {
      canvasElement.removeEventListener('pointermove', onPointerMove)
      canvasElement.removeEventListener('pointerleave', onPointerLeave)
      canvasElement.removeEventListener('click', onClick, true)
    }
  }, [enabled, canvasElement, file, draft])

  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.isComposing) return
      event.preventDefault()
      event.stopPropagation()
      if (draft) setDraft(null)
      else if (openId) setOpenId(null)
      else onExit()
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [enabled, draft, openId, onExit])

  if (!enabled) return null

  const count = comments.length

  return (
    <>
      {layout.hoverFrame && !draft ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 rounded-[2px] border-2 border-dashed border-sky-500 bg-sky-500/5"
          style={layout.hoverFrame}
        />
      ) : null}

      {comments.map((comment) => {
        const pin = layout.pins[comment.id]
        if (!pin) return null
        const open = openId === comment.id
        return (
          <CommentPin
            key={comment.id}
            comment={comment}
            frame={pin.frame}
            anchor={pin.anchor}
            open={open}
            hovered={hoverId === comment.id}
            onToggle={() => {
              setDraft(null)
              setOpenId(open ? null : comment.id)
            }}
            onHover={(hovering) => setHoverId(hovering ? comment.id : null)}
            onSave={async (text) => {
              await onUpdate(comment.id, text)
              setOpenId(null)
            }}
            onRemove={async () => {
              await onRemove(comment.id)
              setOpenId((current) => (current === comment.id ? null : current))
            }}
          />
        )
      })}

      {draft && layout.draftFrame ? (
        <Composer
          key={draft.source}
          frame={layout.draftFrame}
          onCancel={() => setDraft(null)}
          onSubmit={async (text) => {
            await onAdd({ source: draft.source, text, page: pageIndex })
            setDraft(null)
          }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center">
        <div
          className={cn(
            'max-w-[calc(100%-2rem)] truncate rounded-full border bg-background/95 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur',
            error && 'text-destructive',
          )}
          title={error ?? undefined}
        >
          {error ? (
            error
          ) : count === 0 ? (
            'Click any element to leave a comment · Esc to exit'
          ) : (
            <>
              <span className="font-medium text-foreground tabular-nums">
                {count} {count === 1 ? 'comment' : 'comments'}
              </span>
              <span aria-hidden className="mx-1.5">
                ·
              </span>
              Run{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                /apply-comment
              </code>{' '}
              to apply comments
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Pin({
  anchor,
  lit,
  className,
  ...props
}: ComponentProps<'button'> & { anchor: ScreenRect; lit: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'fixed z-50 flex size-6 cursor-pointer items-center justify-center rounded-full rounded-bl-[3px] bg-sky-500 text-white shadow-md ring-2 ring-background',
        'transition-[scale] duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-sky-300',
        lit && 'scale-110',
        className,
      )}
      style={{ left: anchor.left, top: anchor.top }}
    />
  )
}

function SelectionFrame({ frame }: { frame: ScreenRect }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-40 rounded-[2px] border-2 border-sky-500"
      style={frame}
    />
  )
}

function CommentCard({
  cardRef,
  style,
  label,
  children,
  className,
}: {
  cardRef: RefObject<HTMLDivElement | null>
  style: { left: number; top: number }
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-label={label}
      className={cn(
        'fixed z-[60] w-72 cursor-auto rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function CommentTextarea({
  textareaRef,
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
  placeholder?: string
}) {
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) return
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          onSubmit()
        }
      }}
      placeholder={placeholder}
      rows={3}
      disabled={disabled}
      className="w-full resize-none rounded-md border bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
    />
  )
}

function CommentPin({
  comment,
  frame,
  anchor,
  open,
  hovered,
  onToggle,
  onHover,
  onSave,
  onRemove,
}: {
  comment: CarouselComment
  frame: ScreenRect
  anchor: ScreenRect
  open: boolean
  hovered: boolean
  onToggle: () => void
  onHover: (hovering: boolean) => void
  onSave: (text: string) => Promise<void>
  onRemove: () => Promise<void>
}) {
  const lit = open || hovered
  const [cardRef, cardSize] = useMeasuredSize(
    { width: CARD_WIDTH, height: 120 },
    open ? 'editor' : hovered ? 'preview' : null,
  )
  const card = placeBeside(anchor, cardSize, viewport())
  const meta = `Line ${comment.line}`

  return (
    <>
      {lit ? <SelectionFrame frame={frame} /> : null}
      <Pin
        anchor={anchor}
        lit={lit}
        aria-label={`Comment: ${comment.note}`}
        aria-expanded={open}
        onClick={onToggle}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
      >
        <MessageSquareIcon className="size-3" />
      </Pin>
      {open ? (
        <CommentEditor
          cardRef={cardRef}
          style={card}
          meta={meta}
          note={comment.note}
          onSave={onSave}
          onRemove={onRemove}
        />
      ) : hovered ? (
        <div
          ref={cardRef}
          className="pointer-events-none fixed z-[60] w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
          style={card}
        >
          <div className="font-mono text-[10px] text-muted-foreground">{meta}</div>
          <p className="mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {comment.note}
          </p>
        </div>
      ) : null}
    </>
  )
}

function CommentEditor({
  cardRef,
  style,
  meta,
  note,
  onSave,
  onRemove,
}: {
  cardRef: RefObject<HTMLDivElement | null>
  style: { left: number; top: number }
  meta: string
  note: string
  onSave: (text: string) => Promise<void>
  onRemove: () => Promise<void>
}) {
  const [text, setText] = useState(note)
  const [busy, setBusy] = useState<'save' | 'remove' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dirty = text.trim() !== '' && text.trim() !== note

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.focus({ preventScroll: true })
    node.setSelectionRange(node.value.length, node.value.length)
  }, [])

  async function run(kind: 'save' | 'remove', action: () => Promise<void>) {
    if (busy) return
    setBusy(kind)
    setError(null)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Failed to ${kind} comment`)
      setBusy(null)
    }
  }

  const save = () => {
    if (dirty) void run('save', () => onSave(text.trim()))
  }

  return (
    <CommentCard cardRef={cardRef} style={style} label="Slide comment">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageSquareIcon className="size-3.5" />
          Comment
          <span className="font-mono text-[10px] font-normal">· {meta}</span>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Delete comment"
          title="Delete comment"
          disabled={busy !== null}
          onClick={() => void run('remove', onRemove)}
          className="text-muted-foreground hover:text-destructive"
        >
          {busy === 'remove' ? <Spinner /> : <Trash2Icon />}
        </Button>
      </div>
      <CommentTextarea
        textareaRef={textareaRef}
        value={text}
        onChange={setText}
        onSubmit={save}
        disabled={busy !== null}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" title={error}>
          {error}
        </p>
      ) : null}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">{SUBMIT_HINT} to save</span>
        <Button type="button" size="sm" disabled={busy !== null || !dirty} onClick={save}>
          {busy === 'save' ? <Spinner data-icon="inline-start" /> : null}
          {busy === 'save' ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </CommentCard>
  )
}

function Composer({
  frame,
  onCancel,
  onSubmit,
}: {
  frame: ScreenRect
  onCancel: () => void
  onSubmit: (text: string) => Promise<void>
}) {
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cardRef, cardSize] = useMeasuredSize({ width: CARD_WIDTH, height: 160 })
  const anchor = pinRect(frame)
  const card = placeBeside(anchor, cardSize, viewport())

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true })
  }, [])

  async function submit() {
    const text = note.trim()
    if (!text || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(text)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to add comment')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SelectionFrame frame={frame} />
      <Pin anchor={anchor} lit aria-hidden tabIndex={-1} className="pointer-events-none">
        <MessageSquareIcon className="size-3" />
      </Pin>
      <CommentCard cardRef={cardRef} style={card} label="Add slide comment">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageSquareIcon className="size-3.5" />
          New comment
        </div>
        <CommentTextarea
          textareaRef={textareaRef}
          value={note}
          onChange={setNote}
          onSubmit={() => void submit()}
          disabled={isSubmitting}
          placeholder="e.g. make this red"
        />
        {error ? (
          <p className="mt-1.5 text-xs text-destructive" title={error}>
            {error}
          </p>
        ) : null}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">{SUBMIT_HINT} · Esc</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={onCancel}
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
        </div>
      </CommentCard>
    </>
  )
}

export function CommentModeToggle({
  active,
  count = 0,
  onToggle,
  className,
}: {
  active: boolean
  /** Pending comments in the open carousel; shown as a badge when non-zero. */
  count?: number
  onToggle: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'outline'}
      aria-pressed={active}
      aria-label={
        (active ? 'Exit comment mode' : 'Enter comment mode') +
        (count > 0 ? ` (${count} pending)` : '')
      }
      onClick={onToggle}
      className={cn(className)}
    >
      <MessageSquareIcon data-icon="inline-start" />
      {active ? 'Commenting' : 'Comment'}
      {count > 0 ? (
        <span className="ml-0.5 min-w-4 rounded-full bg-sky-500 px-1 text-center text-[10px] leading-4 font-semibold text-white tabular-nums">
          {count}
        </span>
      ) : null}
    </Button>
  )
}
