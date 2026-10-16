import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
} from 'lucide-react'
import type { FC, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { exportCarouselAsImages, exportCarouselAsPdf } from '@/linkedin-carousels/export-carousel'
import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH, carousels } from '@/linkedin-carousels/registry'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/linkedin-carousel/')({
  component: RouteComponent,
})

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}

function ScaledSlide({
  Slide,
  className,
  fit = 'width',
}: {
  Slide: FC
  className?: string
  /** width: scale to container width (sidebar thumbs). contain: fit inside width and height (main canvas). */
  fit?: 'width' | 'contain'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(containerRef)

  const scale =
    fit === 'contain'
      ? width > 0 && height > 0
        ? Math.min(width / CAROUSEL_WIDTH, height / CAROUSEL_HEIGHT)
        : 0
      : width > 0
        ? width / CAROUSEL_WIDTH
        : 0

  const displayWidth = CAROUSEL_WIDTH * scale
  const displayHeight = CAROUSEL_HEIGHT * scale

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center',
        fit === 'width' && 'w-full',
        // Inset so box-shadow has room; measuring content box keeps the slide inside.
        fit === 'contain' && 'size-full min-h-0 p-4',
        className,
      )}
    >
      {scale > 0 ? (
        <div
          className="relative overflow-hidden shadow-lg"
          style={{ width: displayWidth, height: displayHeight }}
        >
          <div
            className="origin-top-left"
            style={{
              width: CAROUSEL_WIDTH,
              height: CAROUSEL_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            <Slide />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RouteComponent() {
  const [selectedId, setSelectedId] = useState(carousels[0]?.id ?? null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  const selected = useMemo(
    () => carousels.find((carousel) => carousel.id === selectedId) ?? null,
    [selectedId],
  )

  const totalSlides = selected?.slides.length ?? 0
  const CurrentSlide = selected?.slides[slideIndex]
  const canGoPrev = slideIndex > 0
  const canGoNext = slideIndex < totalSlides - 1
  const canExport = Boolean(selected) && !isExporting

  function selectCarousel(id: string) {
    setSelectedId(id)
    setSlideIndex(0)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [contenteditable="true"]'))
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        if (!canGoPrev) return
        event.preventDefault()
        setSlideIndex((index) => index - 1)
        return
      }

      if (event.key === 'ArrowRight') {
        if (!canGoNext) return
        event.preventDefault()
        setSlideIndex((index) => index + 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canGoNext, canGoPrev])

  async function runExport(action: 'pdf' | 'images') {
    if (!selected || isExporting) return
    setIsExporting(true)
    try {
      if (action === 'pdf') {
        await exportCarouselAsPdf(selected)
      } else {
        await exportCarouselAsImages(selected)
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link to="/" />}
          nativeButton={false}
          role="link"
          aria-label="Back to formats"
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-sm font-medium">LinkedIn carousel studio</h1>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="ml-auto" disabled={!canExport} />}
          >
            {isExporting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <DownloadIcon data-icon="inline-start" />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuGroup>
              <DropdownMenuItem className="whitespace-nowrap" onClick={() => void runExport('pdf')}>
                <FileTextIcon />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                className="whitespace-nowrap"
                onClick={() => void runExport('images')}
              >
                <ImageIcon />
                Export as image
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[16rem_1fr]">
        <aside className="flex min-h-0 flex-col border-r">
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {carousels.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No carousels registered yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {carousels.map((carousel) => {
                  const isSelected = carousel.id === selectedId
                  const FirstSlide = carousel.slides[0]
                  return (
                    <li key={carousel.id}>
                      <button
                        type="button"
                        onClick={() => selectCarousel(carousel.id)}
                        className={cn(
                          'flex w-full flex-col gap-2 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                          isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                        )}
                      >
                        {FirstSlide ? (
                          <div className="overflow-hidden rounded-md ring-1 ring-border">
                            <ScaledSlide
                              Slide={FirstSlide}
                              fit="width"
                              className="[&>div]:shadow-none"
                            />
                          </div>
                        ) : null}
                        <div className="flex flex-col gap-0.5 px-0.5">
                          <span className="truncate text-sm font-medium">{carousel.name}</span>
                          <span
                            className={cn(
                              'text-xs',
                              isSelected ? 'text-accent-foreground/70' : 'text-muted-foreground',
                            )}
                          >
                            {carousel.slides.length}{' '}
                            {carousel.slides.length === 1 ? 'slide' : 'slides'}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col gap-6 bg-muted/40 p-6">
          {CurrentSlide ? (
            <>
              <div className="min-h-0 flex-1">
                <ScaledSlide Slide={CurrentSlide} fit="contain" />
              </div>

              <div className="flex shrink-0 items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous slide"
                  disabled={!canGoPrev}
                  onClick={() => setSlideIndex((index) => index - 1)}
                >
                  <ChevronLeftIcon />
                </Button>
                <p className="min-w-16 text-center text-sm tabular-nums text-muted-foreground">
                  {slideIndex + 1} / {totalSlides}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next slide"
                  disabled={!canGoNext}
                  onClick={() => setSlideIndex((index) => index + 1)}
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a carousel to preview its slides.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
