import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { FC, RefObject } from 'react'
import { memo, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { SlideSize } from './types'

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = (width: number, height: number) => {
      setSize((current) =>
        current.width === width && current.height === height ? current : { width, height },
      )
    }

    update(element.clientWidth, element.clientHeight)

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      update(width, height)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}

export function ScaledSlide({
  Slide,
  size,
  className,
  fit = 'width',
  onSlideElement,
}: {
  Slide: FC
  /** The slide's native size. */
  size: SlideSize
  className?: string
  /** width: scale to container width (sidebar thumbs). contain: fit inside width and height (main canvas). */
  fit?: 'width' | 'contain'
  /** Fires with the unscaled slide root once layout scale is ready (main canvas only). */
  onSlideElement?: (element: HTMLDivElement | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slideInnerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(containerRef)

  const scale =
    fit === 'contain'
      ? width > 0 && height > 0
        ? Math.min(width / size.width, height / size.height)
        : 0
      : width > 0
        ? width / size.width
        : 0

  const displayWidth = size.width * scale
  const displayHeight = size.height * scale
  const ready = scale > 0

  useEffect(() => {
    if (!onSlideElement) return
    onSlideElement(ready ? slideInnerRef.current : null)
    return () => onSlideElement(null)
  }, [ready, onSlideElement, Slide])

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center',
        fit === 'width' && 'w-full',
        // Inset so box-shadow has room; measuring content box keeps the slide inside.
        fit === 'contain' && 'size-full min-h-0 p-2 md:p-4',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden shadow-lg',
          // Keeps white slides distinct on the white canvas card.
          fit === 'contain' && 'ring-1 ring-foreground/10',
        )}
        style={
          ready
            ? { width: displayWidth, height: displayHeight }
            : fit === 'width'
              ? // Reserve the thumb's height before measuring so scrollIntoView lands correctly.
                {
                  width: '100%',
                  aspectRatio: `${size.width} / ${size.height}`,
                  visibility: 'hidden',
                }
              : { width: 0, height: 0, visibility: 'hidden' }
        }
      >
        <div
          ref={slideInnerRef}
          className="origin-top-left"
          style={{
            width: size.width,
            height: size.height,
            transform: `scale(${ready ? scale : 0.0001})`,
            pointerEvents: ready ? 'auto' : 'none',
          }}
        >
          {/* Memoized so scale/measure re-renders do not wipe contentEditable. */}
          <SlideMount Slide={Slide} />
        </div>
      </div>
    </div>
  )
}

const SlideMount = memo(function SlideMount({ Slide }: { Slide: FC }) {
  return <Slide />
})

/** Isolated from studio chrome re-renders so contentEditable text is not reset. */
export const MainSlideCanvas = memo(function MainSlideCanvas({
  Slide,
  size,
  onSlideElement,
}: {
  Slide: FC
  size: SlideSize
  onSlideElement: (element: HTMLDivElement | null) => void
}) {
  return <ScaledSlide Slide={Slide} size={size} fit="contain" onSlideElement={onSlideElement} />
})

/** Previous / "n / total" / next controls under the main canvas. */
export function SlideNav({
  index,
  total,
  onGo,
}: {
  index: number
  total: number
  onGo: (index: number) => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="max-md:size-10"
        aria-label="Previous slide"
        disabled={index <= 0}
        onClick={() => onGo(index - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <p className="min-w-16 text-center text-sm tabular-nums text-muted-foreground">
        {index + 1} / {total}
      </p>
      <Button
        variant="outline"
        size="icon"
        className="max-md:size-10"
        aria-label="Next slide"
        disabled={index >= total - 1}
        onClick={() => onGo(index + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}

export function OverviewGrid({
  slides,
  size,
  slideIndex,
  gridRef,
  onOpenSlide,
}: {
  slides: FC[]
  size: SlideSize
  slideIndex: number
  gridRef: RefObject<HTMLDivElement | null>
  onOpenSlide: (index: number) => void
}) {
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    cellRefs.current[slideIndex]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [slideIndex])

  return (
    <div
      ref={gridRef}
      className="grid min-h-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] content-start gap-3 overflow-y-auto p-1 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:gap-4"
    >
      {slides.map((Slide, index) => {
        const isActive = index === slideIndex
        return (
          <button
            key={index}
            type="button"
            ref={(element) => {
              cellRefs.current[index] = element
            }}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Open slide ${index + 1}`}
            onClick={() => onOpenSlide(index)}
            className={cn(
              'flex flex-col gap-2 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              isActive ? 'bg-accent/60 ring-2 ring-ring' : 'ring-1 ring-border hover:bg-muted',
            )}
          >
            <div className="overflow-hidden rounded-md">
              <ScaledSlide Slide={Slide} size={size} fit="width" className="[&>div]:shadow-none" />
            </div>
            <span className="text-center text-xs tabular-nums text-muted-foreground">
              {index + 1}
            </span>
          </button>
        )
      })}
    </div>
  )
}
