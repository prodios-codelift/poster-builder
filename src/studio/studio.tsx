import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { clearCarouselTextEdits } from '@/linkedin-carousels/carousel-text-edits'
import { CommentModeLayer, CommentModeToggle } from '@/linkedin-carousels/comment-mode-layer'
import { ImageSwapLayer } from '@/linkedin-carousels/image-swap-layer'
import { useCarouselComments } from '@/linkedin-carousels/use-carousel-comments'
import { useCarouselInlineEdit } from '@/linkedin-carousels/use-carousel-inline-edit'

import { ExportMenu, SaveButton } from './header-actions'
import {
  ASSETS_TAB,
  INLINE_LIBRARY_QUERY,
  LIBRARY_SHORTCUT,
  LibraryDrawer,
  LibraryPanel,
  LibrarySidebar,
  useLibraryCollapsed,
} from './library'
import { MainSlideCanvas, OverviewGrid, SlideNav } from './slide-views'
import type { StudioConfig, StudioSearch, StudioTab, StudioView } from './types'

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

/**
 * A post studio: a library of posts on the left, the open post's slides on
 * the canvas, and dev-only editing (inline text, image swap, comments). Each
 * format route passes its own `config` and keeps `search` in its URL.
 */
export function Studio({
  config,
  search,
  onSearchChange,
}: {
  config: StudioConfig
  search: StudioSearch
  /** Merge `patch` into the URL search, replacing the history entry. */
  onSearchChange: (patch: Partial<StudioSearch>) => void
}) {
  const { size, tabs } = config
  const [commentMode, setCommentMode] = useState(false)
  const overviewGridRef = useRef<HTMLDivElement>(null)
  const [slideCanvasElement, setSlideCanvasElement] = useState<HTMLDivElement | null>(null)
  const onSlideElement = useCallback((element: HTMLDivElement | null) => {
    setSlideCanvasElement(element)
  }, [])
  const exitCommentMode = useCallback(() => setCommentMode(false), [])

  const library = useLibraryCollapsed()
  const [libraryDrawerOpen, setLibraryDrawerOpen] = useState(false)
  const toggleInlineLibrary = library.toggle

  const defaultTab = useMemo(() => tabs.find((tab) => tab.items.length > 0) ?? tabs[0], [tabs])
  const urlTab = tabs.find((tab) => tab.id === search.tab)
  const activeTab = search.tab === ASSETS_TAB ? ASSETS_TAB : (urlTab ?? defaultTab).id
  // The Assets tab keeps showing the open post, so the canvas follows the post's own tab.
  const contentTab: StudioTab =
    search.tab === ASSETS_TAB
      ? (tabs.find((tab) => tab.items.some((post) => post.id === search.carousel)) ?? defaultTab)
      : (urlTab ?? defaultTab)
  const studioView: StudioView = search.view ?? 'slide'

  const selected = useMemo(
    () =>
      contentTab.items.find((post) => post.id === search.carousel) ?? contentTab.items[0] ?? null,
    [contentTab, search.carousel],
  )
  const selectedId = selected?.id ?? null

  const isEditablePost = Boolean(contentTab.editable) && Boolean(selected)
  const canComment = import.meta.env.DEV && studioView === 'slide' && Boolean(selected)
  const canInlineEdit =
    import.meta.env.DEV && isEditablePost && studioView === 'slide' && !commentMode

  const totalSlides = selected?.slides.length ?? 0
  const slideIndex = Math.min(Math.max((search.slide ?? 1) - 1, 0), Math.max(totalSlides - 1, 0))
  const CurrentSlide = selected?.slides[slideIndex]
  const canGoPrev = slideIndex > 0
  const canGoNext = slideIndex < totalSlides - 1

  // Remember each tab's pick for the session so switching tabs back restores it.
  const lastSelectedByTab = useRef<Record<string, string>>({})

  useEffect(() => {
    if (selectedId) lastSelectedByTab.current[contentTab.id] = selectedId
  }, [contentTab.id, selectedId])

  useEffect(() => {
    if (!canComment) setCommentMode(false)
  }, [canComment])

  const commentFile = selectedId ? config.sourceFileOf(selectedId) : null
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

  // Not keyed on activeTab: opening the Assets tab keeps the post and its unsaved text.
  useEffect(() => {
    clearCarouselTextEdits()
  }, [contentTab.id, selectedId])

  const updateSearch = onSearchChange

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

  function selectPost(id: string) {
    updateSearch({ carousel: id, slide: undefined })
    setLibraryDrawerOpen(false)
  }

  function switchTab(tab: string | number | null) {
    if (tab === ASSETS_TAB) {
      updateSearch({ tab: ASSETS_TAB })
      return
    }
    const next = tabs.find((candidate) => candidate.id === tab)
    if (!next) return
    const tabParam = next.id === defaultTab.id ? undefined : next.id
    // Back from Assets to the list the open post belongs to: keep it and its slide.
    if (next.id === contentTab.id) {
      updateSearch({ tab: tabParam })
      return
    }
    updateSearch({
      tab: tabParam,
      carousel: lastSelectedByTab.current[next.id],
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

  const libraryPanel = (
    <LibraryPanel
      tabs={tabs}
      activeTab={activeTab}
      list={contentTab}
      size={size}
      selectedId={selectedId}
      onTabChange={switchTab}
      onSelect={selectPost}
    />
  )
  const libraryToggleLabel = library.collapsed ? 'Show library' : 'Hide library'

  return (
    <div className="flex h-dvh flex-col bg-background md:bg-sidebar">
      <header className="flex items-center gap-2 border-b px-3 py-2.5 md:border-b-0 md:px-5 md:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:inline-flex"
            aria-controls={library.controlsId}
            aria-expanded={!library.collapsed}
            aria-label={libraryToggleLabel}
            title={`${libraryToggleLabel} (${LIBRARY_SHORTCUT})`}
            onClick={toggleInlineLibrary}
          >
            {library.collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
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
            <span className="hidden shrink-0 text-muted-foreground lg:inline">{config.title}</span>
            {selected ? (
              <>
                <span aria-hidden className="hidden text-muted-foreground/60 lg:inline">
                  /
                </span>
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <span className="truncate lg:hidden">{config.title}</span>
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
          {import.meta.env.DEV && isEditablePost && selectedId ? <SaveButton /> : null}
          <ExportMenu post={selected} size={size} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 md:px-2 md:pb-2">
        <LibrarySidebar collapsed={library.collapsed} animate={library.animate}>
          {libraryPanel}
        </LibrarySidebar>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 bg-muted/40 p-3 md:gap-6 md:rounded-xl md:bg-background md:p-6 md:shadow-xs md:ring-1 md:ring-foreground/[0.06]">
          {selected && selected.slides.length > 0 ? (
            studioView === 'overview' ? (
              <OverviewGrid
                slides={selected.slides}
                size={size}
                slideIndex={slideIndex}
                gridRef={overviewGridRef}
                onOpenSlide={openSlide}
              />
            ) : CurrentSlide ? (
              <>
                <div className="relative min-h-0 flex-1">
                  <MainSlideCanvas
                    Slide={CurrentSlide}
                    size={size}
                    onSlideElement={onSlideElement}
                  />
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

                <SlideNav index={slideIndex} total={totalSlides} onGo={goToSlide} />
              </>
            ) : null
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">{contentTab.placeholder}</p>
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
