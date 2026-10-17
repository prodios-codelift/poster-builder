import type { FC } from 'react'

export type SlideSize = { width: number; height: number }

/** One entry in a studio library: a carousel, a single-image post or a theme demo. */
export type StudioPost = {
  id: string
  name: string
  slides: FC[]
}

/** A library tab that lists posts. The studio adds a dev-only Assets tab after these. */
export type StudioTab = {
  /** Value kept in the `tab` search param. */
  id: string
  label: string
  items: StudioPost[]
  /** Shown in the library when `items` is empty. */
  emptyLabel: string
  /** Shown on the canvas when nothing is selected. */
  placeholder: string
  /** Dev-only inline text edit, image swap and Save for this tab's posts. */
  editable?: boolean
}

export type StudioConfig = {
  /** Shown in the header, e.g. "LinkedIn carousel studio". */
  title: string
  /** Native slide size; the studio scales slides to fit. */
  size: SlideSize
  tabs: StudioTab[]
  /** Source file of a post, where slide comments are written. */
  sourceFileOf: (id: string) => string
}

export type StudioView = 'slide' | 'overview'

/** Studio state kept in the URL so a refresh reopens the same slide. Defaults are omitted. */
export type StudioSearch = {
  tab?: string
  carousel?: string
  /** 1-based slide number. */
  slide?: number
  view?: StudioView
}

export function validateStudioSearch(search: Record<string, unknown>): StudioSearch {
  const slide = Number(search.slide)
  return {
    tab: typeof search.tab === 'string' && search.tab ? search.tab : undefined,
    carousel: typeof search.carousel === 'string' && search.carousel ? search.carousel : undefined,
    slide: Number.isInteger(slide) && slide >= 1 ? slide : undefined,
    view: search.view === 'overview' ? 'overview' : undefined,
  }
}
