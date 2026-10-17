import { Drawer } from '@base-ui/react/drawer'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { AssetManager } from '@/asset-library/asset-manager'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { ScaledSlide } from './slide-views'
import type { SlideSize, StudioPost, StudioTab } from './types'

/** Dev-only library tab that shows the global asset manager instead of posts. */
export const ASSETS_TAB = 'assets'

/** Tailwind's `md` breakpoint: the library sits inline above it and in a drawer below. */
export const INLINE_LIBRARY_QUERY = '(min-width: 48rem)'
export const LIBRARY_SHORTCUT = '⌘B'

const LIBRARY_ID = 'studio-library'
const LIBRARY_COLLAPSED_KEY = 'studio:library-collapsed'

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

/** Whether the inline (≥ `md`) library is collapsed, remembered across visits and tabs. */
export function useLibraryCollapsed() {
  // SSR renders the library open; the stored choice applies once hydrated.
  const collapsed = useSyncExternalStore(
    subscribeLibraryCollapsed,
    getLibraryCollapsed,
    () => false,
  )
  // Only animate after a click, so a stored "collapsed" does not slide shut on load.
  const [animate, setAnimate] = useState(false)

  const toggle = useCallback(() => {
    setAnimate(true)
    setLibraryCollapsed(!getLibraryCollapsed())
  }, [])

  return { collapsed, animate, toggle, controlsId: LIBRARY_ID }
}

export function LibraryPanel({
  tabs,
  activeTab,
  list,
  size,
  selectedId,
  onTabChange,
  onSelect,
}: {
  tabs: StudioTab[]
  /** A tab id from `tabs`, or `ASSETS_TAB`. */
  activeTab: string
  /** The tab whose posts are listed (the open post's tab while Assets is showing). */
  list: StudioTab
  size: SlideSize
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
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
          {import.meta.env.DEV ? <TabsTrigger value={ASSETS_TAB}>Assets</TabsTrigger> : null}
        </TabsList>
      </div>
      {activeTab === ASSETS_TAB ? (
        <AssetManager variant="panel" />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 pt-1">
          <LibraryList
            items={list.items}
            size={size}
            selectedId={selectedId}
            emptyLabel={list.emptyLabel}
            onSelect={onSelect}
          />
        </div>
      )}
    </Tabs>
  )
}

/** The library at `md` and up: an inline column that collapses to zero width. */
export function LibrarySidebar({
  collapsed,
  animate,
  children,
}: {
  collapsed: boolean
  animate: boolean
  children: ReactNode
}) {
  return (
    // Clip, not hidden: a clip box is not a scroll container, so the list's
    // scrollIntoView cannot shift it sideways while collapsed.
    <aside
      id={LIBRARY_ID}
      aria-label="Library"
      inert={collapsed}
      className={cn(
        'hidden min-h-0 shrink-0 overflow-clip md:flex',
        animate && 'transition-[width] duration-200 ease-out motion-reduce:transition-none',
      )}
      style={{ width: collapsed ? 0 : '16rem' }}
    >
      <div className="flex min-h-0 w-64 shrink-0 flex-col">{children}</div>
    </aside>
  )
}

/** The library below `md`: a left drawer that swipes, taps or Escs closed. */
export function LibraryDrawer({
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
  size,
  selectedId,
  emptyLabel,
  onSelect,
}: {
  items: StudioPost[]
  size: SlideSize
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
      {items.map((post) => {
        const isSelected = post.id === selectedId
        const FirstSlide = post.slides[0]
        return (
          <li key={post.id}>
            <button
              type="button"
              ref={isSelected ? selectedRef : undefined}
              onClick={() => onSelect(post.id)}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 border border-transparent',
                isSelected ? 'border-border bg-background shadow-xs' : 'hover:bg-muted',
              )}
            >
              {FirstSlide ? (
                <div className="overflow-hidden rounded-md ring-1 ring-border">
                  <ScaledSlide
                    Slide={FirstSlide}
                    size={size}
                    fit="width"
                    className="[&>div]:shadow-none"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-0.5 px-0.5">
                <span className="truncate text-sm font-medium">{post.name}</span>
                <span className="text-xs text-muted-foreground">
                  {post.slides.length} {post.slides.length === 1 ? 'slide' : 'slides'}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
