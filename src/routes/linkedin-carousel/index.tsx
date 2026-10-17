import { Drawer } from '@base-ui/react/drawer'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SaveIcon,
} from 'lucide-react'
import type { FC, ReactNode, RefObject } from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { AssetManager } from '@/asset-library/asset-manager'
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
import {
  clearCarouselTextEdits,
  getCarouselTextEditCount,
  getPendingCarouselTextEdits,
  subscribeCarouselTextEdits,
} from '@/linkedin-carousels/carousel-text-edits'
import { carouselSourceFile } from '@/linkedin-carousels/carousel-comments'
import { CommentModeLayer, CommentModeToggle } from '@/linkedin-carousels/comment-mode-layer'
import { exportCarouselAsImages, exportCarouselAsPdf } from '@/linkedin-carousels/export-carousel'
import { ImageSwapLayer } from '@/linkedin-carousels/image-swap-layer'
import {
  CAROUSEL_HEIGHT,
  CAROUSEL_WIDTH,
  carousels,
  themes,
  type LinkedInCarousel,
} from '@/linkedin-carousels/registry'
import { saveCarouselText } from '@/linkedin-carousels/save-carousel-text'
import { useCarouselComments } from '@/linkedin-carousels/use-carousel-comments'
import { useCarouselInlineEdit } from '@/linkedin-carousels/use-carousel-inline-edit'
import { cn } from '@/lib/utils'

type LibraryTab = 'posts' | 'themes' | 'assets'
/** Sidebar tabs that list carousels; the Assets tab keeps showing one of these. */
type CarouselTab = Exclude<LibraryTab, 'assets'>
type StudioView = 'slide' | 'overview'

/** Studio state kept in the URL so a refresh reopens the same slide. Defaults are omitted. */
type CarouselSearch = {
  tab?: LibraryTab
  carousel?: string
  /** 1-based slide number. */
  slide?: number
  view?: StudioView
}

function validateCarouselSearch(search: Record<string, unknown>): CarouselSearch {
  const slide = Number(search.slide)
  return {
    tab:
      search.tab === 'posts' || search.tab === 'themes' || search.tab === 'assets'
        ? search.tab
        : undefined,
    carousel: typeof search.carousel === 'string' && search.carousel ? search.carousel : undefined,
    slide: Number.isInteger(slide) && slide >= 1 ? slide : undefined,
    view: search.view === 'overview' ? 'overview' : undefined,
  }
}

export const Route = createFileRoute('/linkedin-carousel/')({
  validateSearch: validateCarouselSearch,
  component: RouteComponent,
})

function libraryForTab(tab: CarouselTab): LinkedInCarousel[] {
  return tab === 'posts' ? carousels : themes
}

function defaultTab(): CarouselTab {
  return carousels.length > 0 ? 'posts' : 'themes'
}

/** Which carousel list `id` belongs to, so the Assets tab can keep it on the canvas. */
function carouselTabOf(id: string | undefined): CarouselTab {
  if (id && themes.some((carousel) => carousel.id === id)) return 'themes'
  if (id && carousels.some((carousel) => carousel.id === id)) return 'posts'
  return defaultTab()
}

/** Tailwind's `md` breakpoint: the library sits inline above it and in a drawer below. */
const INLINE_LIBRARY_QUERY = '(min-width: 48rem)'
const LIBRARY_COLLAPSED_KEY = 'linkedin-carousel:library-collapsed'
const LIBRARY_SHORTCUT = '⌘B'

const libraryCollapsedListeners = new Set<() => void>()
let libraryCollapsed: boolean | undefined

function getLibraryCollapsed(): boolean {
  if (libraryCollapsed === undefined) {
    try {
      libraryCollapsed = window.localStorage.getItem(LIBRARY_COLLAPSED_KEY) === '1'
    } catch {
      libraryCollapsed = false
    }
  }
  return libraryCollapsed
}

function setLibraryCollapsed(collapsed: boolean) {
  libraryCollapsed = collapsed
  try {
    window.localStorage.setItem(LIBRARY_COLLAPSED_KEY, collapsed ? '1' : '0')
  } catch {
    // Blocked storage only forgets the choice on the next visit.
  }
  for (const listener of libraryCollapsedListeners) listener()
}

function subscribeLibraryCollapsed(listener: () => void): () => void {
  libraryCollapsedListeners.add(listener)
  // Follow toggles made in other tabs.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== LIBRARY_COLLAPSED_KEY) return
    libraryCollapsed = event.newValue === '1'
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    libraryCollapsedListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function isEditableTarget(target: HTMLElement): boolean {
  return (
    target.isContentEditable ||
    Boolean(
      target.closest(
        'input, textarea, select, [contenteditable="true"], [contenteditable="plaintext-only"]',
      ),
    )
  )
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

function ScaledSlide({
  Slide,
  className,
  fit = 'width',
  onSlideElement,
}: {
  Slide: FC
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
        ? Math.min(width / CAROUSEL_WIDTH, height / CAROUSEL_HEIGHT)
        : 0
      : width > 0
        ? width / CAROUSEL_WIDTH
        : 0

  const displayWidth = CAROUSEL_WIDTH * scale
  const displayHeight = CAROUSEL_HEIGHT * scale
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
                  aspectRatio: `${CAROUSEL_WIDTH} / ${CAROUSEL_HEIGHT}`,
                  visibility: 'hidden',
                }
              : { width: 0, height: 0, visibility: 'hidden' }
        }
      >
        <div
          ref={slideInnerRef}
          className="origin-top-left"
          style={{
            width: CAROUSEL_WIDTH,
            height: CAROUSEL_HEIGHT,
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
const MainSlideCanvas = memo(function MainSlideCanvas({
  Slide,
  onSlideElement,
}: {
  Slide: FC
  onSlideElement: (element: HTMLDivElement | null) => void
}) {
  return <ScaledSlide Slide={Slide} fit="contain" onSlideElement={onSlideElement} />
})

function SaveCarouselButton() {
  const editCount = useSyncExternalStore(
    subscribeCarouselTextEdits,
    getCarouselTextEditCount,
    () => 0,
  )
  const saveFn = useServerFn(saveCarouselText)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSave() {
    if (editCount === 0 || isSaving) return
    setIsSaving(true)
    setError(null)
    try {
      const edits = getPendingCarouselTextEdits().map(({ file, position, prevText, nextText }) => ({
        file,
        position,
        prevText,
        nextText,
      }))
      await saveFn({ data: { edits } })
      clearCarouselTextEdits()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  const label = isSaving ? 'Saving...' : 'Save'

  return (
    <div className="flex items-center gap-2">
      {error ? (
        <span className="hidden max-w-48 truncate text-xs text-destructive md:block" title={error}>
          {error}
        </span>
      ) : null}
      <Button
        variant="outline"
        disabled={editCount === 0 || isSaving}
        aria-label={label}
        title={error ?? label}
        onClick={() => void onSave()}
      >
        {isSaving ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
        <span className="hidden lg:inline">{label}</span>
      </Button>
    </div>
  )
}

function LibraryPanel({
  activeTab,
  items,
  selectedId,
  onTabChange,
  onSelect,
}: {
  activeTab: LibraryTab
  items: LinkedInCarousel[]
  selectedId: string | null
  onTabChange: (tab: string | number | null) => void
  onSelect: (id: string) => void
}) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="flex min-h-0 flex-1 flex-col gap-0"
    >
      <div className="p-3 pb-2">
        <TabsList data-library-tabs className="w-full">
          <TabsTrigger value="posts">My posts</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          {import.meta.env.DEV ? <TabsTrigger value="assets">Assets</TabsTrigger> : null}
        </TabsList>
      </div>
      {activeTab === 'assets' ? (
        <AssetManager variant="panel" />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 pt-1">
          <LibraryList
            items={items}
            selectedId={selectedId}
            emptyLabel={activeTab === 'posts' ? 'No posts yet.' : 'No themes registered yet.'}
            onSelect={onSelect}
          />
        </div>
      )}
    </Tabs>
  )
}

/** The library below `md`: a left drawer that swipes, taps or Escs closed. */
function LibraryDrawer({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="left">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black [--backdrop-opacity:0.3] opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*300ms)] dark:[--backdrop-opacity:0.6]" />
        <Drawer.Viewport className="fixed inset-0 flex items-stretch justify-start">
          <Drawer.Popup className="flex h-full w-[min(20rem,85vw)] flex-col border-r bg-sidebar text-sidebar-foreground shadow-xl outline-none transform-[translateX(var(--drawer-swipe-movement-x))] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:transform-[translateX(-100%)] data-ending-style:transform-[translateX(-100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*300ms)]">
            <Drawer.Content className="flex min-h-0 flex-1 flex-col">
              <Drawer.Title className="sr-only">Library</Drawer.Title>
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
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
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Bring a selection restored from the URL into view; a no-op after a click.
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

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
              ref={isSelected ? selectedRef : undefined}
              onClick={() => onSelect(carousel.id)}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 border border-transparent',
                isSelected ? 'border-border bg-background shadow-xs' : 'hover:bg-muted',
              )}
            >
              {FirstSlide ? (
                <div className="overflow-hidden rounded-md ring-1 ring-border">
                  <ScaledSlide Slide={FirstSlide} fit="width" className="[&>div]:shadow-none" />
                </div>
              ) : null}
              <div className="flex flex-col gap-0.5 px-0.5">
                <span className="truncate text-sm font-medium">{carousel.name}</span>
                <span className="text-xs text-muted-foreground">
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
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [isExporting, setIsExporting] = useState(false)
  const [commentMode, setCommentMode] = useState(false)
  const overviewGridRef = useRef<HTMLDivElement>(null)
  const [slideCanvasElement, setSlideCanvasElement] = useState<HTMLDivElement | null>(null)
  const onSlideElement = useCallback((element: HTMLDivElement | null) => {
    setSlideCanvasElement(element)
  }, [])
  const exitCommentMode = useCallback(() => setCommentMode(false), [])

  // SSR renders the library open; the stored choice applies once hydrated.
  const isLibraryCollapsed = useSyncExternalStore(
    subscribeLibraryCollapsed,
    getLibraryCollapsed,
    () => false,
  )
  // Only animate after a click, so a stored "collapsed" does not slide shut on load.
  const [animateLibrary, setAnimateLibrary] = useState(false)
  const [libraryDrawerOpen, setLibraryDrawerOpen] = useState(false)

  const toggleInlineLibrary = useCallback(() => {
    setAnimateLibrary(true)
    setLibraryCollapsed(!getLibraryCollapsed())
  }, [])

  const activeTab = search.tab ?? defaultTab()
  const carouselTab: CarouselTab =
    activeTab === 'assets' ? carouselTabOf(search.carousel) : activeTab
  const studioView: StudioView = search.view ?? 'slide'
  const library = libraryForTab(carouselTab)

  const selected = useMemo(
    () => library.find((carousel) => carousel.id === search.carousel) ?? library[0] ?? null,
    [library, search.carousel],
  )
  const selectedId = selected?.id ?? null

  const isUserPost = carouselTab === 'posts' && Boolean(selected)
  const canComment = import.meta.env.DEV && studioView === 'slide' && Boolean(selected)
  const canInlineEdit =
    import.meta.env.DEV && isUserPost && studioView === 'slide' && Boolean(selected) && !commentMode

  const totalSlides = selected?.slides.length ?? 0
  const slideIndex = Math.min(Math.max((search.slide ?? 1) - 1, 0), Math.max(totalSlides - 1, 0))
  const CurrentSlide = selected?.slides[slideIndex]
  const canGoPrev = slideIndex > 0
  const canGoNext = slideIndex < totalSlides - 1
  const canExport = Boolean(selected) && !isExporting

  // Remember each tab's pick for the session so switching tabs back restores it.
  const lastSelectedByTab = useRef<Partial<Record<CarouselTab, string>>>({})

  useEffect(() => {
    if (selectedId) lastSelectedByTab.current[carouselTab] = selectedId
  }, [carouselTab, selectedId])

  useEffect(() => {
    if (!canComment) setCommentMode(false)
  }, [canComment])

  const commentFile = selectedId ? carouselSourceFile(selectedId) : null
  const slideComments = useCarouselComments({
    file: commentFile,
    enabled: canComment,
  })

  useCarouselInlineEdit({
    enabled: canInlineEdit,
    carouselId: canInlineEdit ? selectedId : null,
    slideIndex,
    canvasElement: slideCanvasElement,
  })

  // Not keyed on activeTab: opening the Assets tab keeps the carousel and its unsaved text.
  useEffect(() => {
    clearCarouselTextEdits()
  }, [carouselTab, selectedId])

  /** Replace (not push) so stepping through slides does not fill browser history. */
  const updateSearch = useCallback(
    (patch: Partial<CarouselSearch>) => {
      void navigate({
        search: (prev) => ({ ...prev, ...patch }),
        replace: true,
        resetScroll: false,
      })
    },
    [navigate],
  )

  const goToSlide = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), Math.max(totalSlides - 1, 0))
      updateSearch({ slide: next === 0 ? undefined : next + 1 })
    },
    [totalSlides, updateSearch],
  )

  const setStudioView = useCallback(
    (view: StudioView) => {
      updateSearch({ view: view === 'overview' ? 'overview' : undefined })
    },
    [updateSearch],
  )

  function selectCarousel(id: string) {
    updateSearch({ carousel: id, slide: undefined })
    setLibraryDrawerOpen(false)
  }

  function switchTab(tab: string | number | null) {
    if (tab === 'assets') {
      updateSearch({ tab: 'assets' })
      return
    }
    if (tab !== 'posts' && tab !== 'themes') return
    // Back from Assets to the list the open carousel belongs to: keep it and its slide.
    if (tab === carouselTab) {
      updateSearch({ tab: tab === defaultTab() ? undefined : tab })
      return
    }
    updateSearch({
      tab: tab === defaultTab() ? undefined : tab,
      carousel: lastSelectedByTab.current[tab],
      slide: undefined,
    })
  }

  function switchStudioView(view: string | number | null) {
    if (view !== 'slide' && view !== 'overview') return
    setStudioView(view)
  }

  function openSlide(index: number) {
    updateSearch({
      slide: index === 0 ? undefined : index + 1,
      view: undefined,
    })
  }

  // The drawer only exists below `md`; close it if the window grows past that.
  useEffect(() => {
    if (!libraryDrawerOpen) return
    const query = window.matchMedia(INLINE_LIBRARY_QUERY)
    const onChange = () => {
      if (query.matches) setLibraryDrawerOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [libraryDrawerOpen])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
      if (event.key.toLowerCase() !== 'b') return
      // Leave ⌘B to bold while editing slide text or typing a comment.
      if (event.target instanceof HTMLElement && isEditableTarget(event.target)) return
      event.preventDefault()
      if (window.matchMedia(INLINE_LIBRARY_QUERY).matches) toggleInlineLibrary()
      else setLibraryDrawerOpen((open) => !open)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleInlineLibrary])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (totalSlides === 0) return
      // The drawer is modal; keys belong to it, not the slide behind.
      if (libraryDrawerOpen) return

      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (isEditableTarget(target)) return

      // Leave arrow keys to menus and the library tabs.
      if (target.closest('[role="menu"], [role="menuitem"]')) return
      if (target.closest('[data-library-tabs]')) return

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
        goToSlide(slideIndex - 1)
        return
      }

      if (event.key === 'ArrowRight') {
        if (!canGoNext) return
        event.preventDefault()
        event.stopPropagation()
        goToSlide(slideIndex + 1)
        return
      }

      if (studioView !== 'overview') return

      const columns = overviewGridRef.current ? getGridColumnCount(overviewGridRef.current) : 1

      if (event.key === 'ArrowUp') {
        if (slideIndex === 0) return
        event.preventDefault()
        event.stopPropagation()
        goToSlide(slideIndex - columns)
        return
      }

      if (event.key === 'ArrowDown') {
        if (slideIndex >= totalSlides - 1) return
        event.preventDefault()
        event.stopPropagation()
        goToSlide(slideIndex + columns)
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (event.defaultPrevented || isOnInteractiveControl) return
        event.preventDefault()
        setStudioView('slide')
        return
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [
    canGoNext,
    canGoPrev,
    goToSlide,
    libraryDrawerOpen,
    setStudioView,
    slideIndex,
    studioView,
    totalSlides,
  ])

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

  const libraryPanel = (
    <LibraryPanel
      activeTab={activeTab}
      items={library}
      selectedId={selectedId}
      onTabChange={switchTab}
      onSelect={selectCarousel}
    />
  )
  const libraryToggleLabel = isLibraryCollapsed ? 'Show library' : 'Hide library'
  const exportLabel = isExporting ? 'Exporting...' : 'Export'

  return (
    <div className="flex h-dvh flex-col bg-background md:bg-sidebar">
      <header className="flex items-center gap-2 border-b px-3 py-2.5 md:border-b-0 md:px-5 md:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:inline-flex"
            aria-controls="carousel-library"
            aria-expanded={!isLibraryCollapsed}
            aria-label={libraryToggleLabel}
            title={`${libraryToggleLabel} (${LIBRARY_SHORTCUT})`}
            onClick={toggleInlineLibrary}
          >
            {isLibraryCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-haspopup="dialog"
            aria-expanded={libraryDrawerOpen}
            aria-label="Open library"
            title="Open library"
            onClick={() => setLibraryDrawerOpen(true)}
          >
            <PanelLeftOpenIcon />
          </Button>
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
          <h1 className="sr-only text-sm font-medium sm:not-sr-only sm:flex sm:min-w-0 sm:items-baseline sm:gap-1.5">
            <span className="hidden shrink-0 text-muted-foreground lg:inline">
              LinkedIn carousel studio
            </span>
            {selected ? (
              <>
                <span aria-hidden className="hidden text-muted-foreground/60 lg:inline">
                  /
                </span>
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <span className="truncate lg:hidden">LinkedIn carousel studio</span>
            )}
          </h1>
        </div>

        <Tabs value={studioView} onValueChange={switchStudioView}>
          <TabsList>
            <TabsTrigger value="slide">Slide</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 items-center justify-end gap-2">
          {canComment ? (
            <CommentModeToggle
              active={commentMode}
              count={slideComments.comments.length}
              onToggle={() => setCommentMode((on) => !on)}
            />
          ) : null}
          {import.meta.env.DEV && isUserPost && selectedId ? <SaveCarouselButton /> : null}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  disabled={!canExport}
                  aria-label={exportLabel}
                  title={exportLabel}
                />
              }
            >
              {isExporting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <DownloadIcon data-icon="inline-start" />
              )}
              <span className="hidden lg:inline">{exportLabel}</span>
              <ChevronDownIcon data-icon="inline-end" className="hidden sm:block" />
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

      <div className="flex min-h-0 flex-1 md:px-2 md:pb-2">
        {/* Clip, not hidden: a clip box is not a scroll container, so the list's
            scrollIntoView cannot shift it sideways while collapsed. */}
        <aside
          id="carousel-library"
          aria-label="Library"
          inert={isLibraryCollapsed}
          className={cn(
            'hidden min-h-0 shrink-0 overflow-clip md:flex',
            animateLibrary &&
              'transition-[width] duration-200 ease-out motion-reduce:transition-none',
          )}
          style={{ width: isLibraryCollapsed ? 0 : '16rem' }}
        >
          <div className="flex min-h-0 w-64 shrink-0 flex-col">{libraryPanel}</div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 bg-muted/40 p-3 md:gap-6 md:rounded-xl md:bg-background md:p-6 md:shadow-xs md:ring-1 md:ring-foreground/[0.06]">
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
                <div className="relative min-h-0 flex-1">
                  <MainSlideCanvas Slide={CurrentSlide} onSlideElement={onSlideElement} />
                  <CommentModeLayer
                    enabled={commentMode}
                    canvasElement={slideCanvasElement}
                    pageIndex={slideIndex}
                    file={commentFile}
                    comments={slideComments.comments}
                    error={slideComments.error}
                    onAdd={slideComments.add}
                    onUpdate={slideComments.update}
                    onRemove={slideComments.remove}
                    onExit={exitCommentMode}
                  />
                  <ImageSwapLayer enabled={canInlineEdit} canvasElement={slideCanvasElement} />
                </div>

                <div className="flex shrink-0 items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="max-md:size-10"
                    aria-label="Previous slide"
                    disabled={!canGoPrev}
                    onClick={() => goToSlide(slideIndex - 1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <p className="min-w-16 text-center text-sm tabular-nums text-muted-foreground">
                    {slideIndex + 1} / {totalSlides}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    className="max-md:size-10"
                    aria-label="Next slide"
                    disabled={!canGoNext}
                    onClick={() => goToSlide(slideIndex + 1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </>
            ) : null
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {carouselTab === 'posts'
                  ? 'Select a post to preview its slides.'
                  : 'Select a theme to preview its slides.'}
              </p>
            </div>
          )}
        </section>
      </div>

      <LibraryDrawer open={libraryDrawerOpen} onOpenChange={setLibraryDrawerOpen}>
        {libraryPanel}
      </LibraryDrawer>
    </div>
  )
}
