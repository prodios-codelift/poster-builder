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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { exportCarouselAsImages, exportCarouselAsPdf } from '@/linkedin-carousels/export-carousel'
import {
  CAROUSEL_HEIGHT,
  CAROUSEL_WIDTH,
  carousels,
  themes,
  type LinkedInCarousel,
} from '@/linkedin-carousels/registry'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/linkedin-carousel/')({
  component: RouteComponent,
})

type LibraryTab = 'posts' | 'themes'
type StudioView = 'slide' | 'overview'

function libraryForTab(tab: LibraryTab): LinkedInCarousel[] {
  return tab === 'posts' ? carousels : themes
}

function defaultTab(): LibraryTab {
  return carousels.length > 0 ? 'posts' : 'themes'
}

function getGridColumnCount(grid: HTMLElement): number {
  const columns = getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(Boolean)
  return Math.max(columns.length, 1)
}

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

function LibraryList({
  items,
  selectedId,
  emptyLabel,
  onSelect,
}: {
  items: LinkedInCarousel[]
  selectedId: string | null
  emptyLabel: string
  onSelect: (id: string) => void
}) {
  if (items.length === 0) {
    return <p className="px-2 py-3 text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((carousel) => {
        const isSelected = carousel.id === selectedId
        const FirstSlide = carousel.slides[0]
        return (
          <li key={carousel.id}>
            <button
              type="button"
              onClick={() => onSelect(carousel.id)}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
              )}
            >
              {FirstSlide ? (
                <div className="overflow-hidden rounded-md ring-1 ring-border">
                  <ScaledSlide Slide={FirstSlide} fit="width" className="[&>div]:shadow-none" />
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
                  {carousel.slides.length} {carousel.slides.length === 1 ? 'slide' : 'slides'}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function OverviewGrid({
  slides,
  slideIndex,
  gridRef,
  onOpenSlide,
}: {
  slides: LinkedInCarousel['slides']
  slideIndex: number
  gridRef: RefObject<HTMLDivElement | null>
  onOpenSlide: (index: number) => void
}) {
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    cellRefs.current[slideIndex]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [slideIndex])

  return (
    <div
      ref={gridRef}
      className="grid min-h-0 flex-1 auto-rows-min content-start gap-4 overflow-y-auto p-1"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))' }}
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
              isActive
                ? 'bg-accent/60 ring-2 ring-ring'
                : 'ring-1 ring-border hover:bg-muted',
            )}
          >
            <div className="overflow-hidden rounded-md">
              <ScaledSlide Slide={Slide} fit="width" className="[&>div]:shadow-none" />
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

function RouteComponent() {
  const initialTab = defaultTab()
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab)
  const [selectedByTab, setSelectedByTab] = useState<Record<LibraryTab, string | null>>(() => ({
    posts: carousels[0]?.id ?? null,
    themes: themes[0]?.id ?? null,
  }))
  const [slideIndex, setSlideIndex] = useState(0)
  const [studioView, setStudioView] = useState<StudioView>('slide')
  const [isExporting, setIsExporting] = useState(false)
  const overviewGridRef = useRef<HTMLDivElement>(null)

  const library = libraryForTab(activeTab)
  const selectedId = selectedByTab[activeTab]

  const selected = useMemo(
    () => library.find((carousel) => carousel.id === selectedId) ?? null,
    [library, selectedId],
  )

  const totalSlides = selected?.slides.length ?? 0
  const CurrentSlide = selected?.slides[slideIndex]
  const canGoPrev = slideIndex > 0
  const canGoNext = slideIndex < totalSlides - 1
  const canExport = Boolean(selected) && !isExporting

  function selectCarousel(id: string) {
    setSelectedByTab((current) => ({ ...current, [activeTab]: id }))
    setSlideIndex(0)
  }

  function switchTab(tab: string | number | null) {
    if (tab !== 'posts' && tab !== 'themes') return
    setActiveTab(tab)
    setSlideIndex(0)
  }

  function switchStudioView(view: string | number | null) {
    if (view !== 'slide' && view !== 'overview') return
    setStudioView(view)
  }

  function openSlide(index: number) {
    setSlideIndex(index)
    setStudioView('slide')
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (totalSlides === 0) return

      const target = event.target
      if (!(target instanceof HTMLElement)) return

      if (
        target.isContentEditable ||
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      // Leave arrow keys to menus and the sidebar library tabs.
      if (target.closest('[role="menu"], [role="menuitem"]')) return
      if (target.closest('aside [data-slot="tabs-list"]')) return

      const isOnInteractiveControl = Boolean(
        target.closest('button, a, [role="menuitem"], [role="tab"]'),
      )

      if (studioView === 'overview' && event.key === 'Enter') {
        if (event.defaultPrevented || isOnInteractiveControl) return
        event.preventDefault()
        setStudioView('slide')
        return
      }

      // Capture phase so the header Slide/Overview tabs do not steal arrow keys.
      if (event.key === 'ArrowLeft') {
        if (!canGoPrev) return
        event.preventDefault()
        event.stopPropagation()
        setSlideIndex((index) => index - 1)
        return
      }

      if (event.key === 'ArrowRight') {
        if (!canGoNext) return
        event.preventDefault()
        event.stopPropagation()
        setSlideIndex((index) => index + 1)
        return
      }

      if (studioView !== 'overview') return

      const columns = overviewGridRef.current
        ? getGridColumnCount(overviewGridRef.current)
        : 1

      if (event.key === 'ArrowUp') {
        if (slideIndex === 0) return
        event.preventDefault()
        event.stopPropagation()
        setSlideIndex((index) => Math.max(index - columns, 0))
        return
      }

      if (event.key === 'ArrowDown') {
        if (slideIndex >= totalSlides - 1) return
        event.preventDefault()
        event.stopPropagation()
        setSlideIndex((index) => Math.min(index + columns, totalSlides - 1))
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [canGoNext, canGoPrev, slideIndex, studioView, totalSlides])

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
        <div className="flex min-w-0 flex-1 items-center gap-3">
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
          <h1 className="truncate text-sm font-medium">LinkedIn carousel studio</h1>
        </div>

        <Tabs value={studioView} onValueChange={switchStudioView}>
          <TabsList>
            <TabsTrigger value="slide">Slide</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" disabled={!canExport} />}
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
                <DropdownMenuItem
                  className="whitespace-nowrap"
                  onClick={() => void runExport('pdf')}
                >
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
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[16rem_1fr]">
        <aside className="flex min-h-0 flex-col border-r">
          <Tabs
            value={activeTab}
            onValueChange={switchTab}
            className="flex min-h-0 flex-1 flex-col gap-0"
          >
            <div className="sticky top-0 z-10 border-b bg-background p-3 pb-2">
              <TabsList className="w-full">
                <TabsTrigger value="posts">My posts</TabsTrigger>
                <TabsTrigger value="themes">Themes</TabsTrigger>
              </TabsList>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <LibraryList
                items={library}
                selectedId={selectedId}
                emptyLabel={activeTab === 'posts' ? 'No posts yet.' : 'No themes registered yet.'}
                onSelect={selectCarousel}
              />
            </div>
          </Tabs>
        </aside>

        <section className="flex min-h-0 flex-col gap-6 bg-muted/40 p-6">
          {selected && selected.slides.length > 0 ? (
            studioView === 'overview' ? (
              <OverviewGrid
                slides={selected.slides}
                slideIndex={slideIndex}
                gridRef={overviewGridRef}
                onOpenSlide={openSlide}
              />
            ) : CurrentSlide ? (
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
            ) : null
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {activeTab === 'posts'
                  ? 'Select a post to preview its slides.'
                  : 'Select a theme to preview its slides.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
