import type { SourceLocation } from './edit-carousel-source'

/**
 * Injected in dev onto every JSX element of `carousels/<id>/index.tsx` as
 * `<id>:<line>:<column>` (Babel's 0-based column). Host elements render it to
 * the DOM; component call sites keep it in their fiber props.
 */
export const CAROUSEL_LOC_ATTR = 'data-carousel-loc'

export function formatCarouselLoc(carouselId: string, line: number, column: number): string {
  return `${carouselId}:${line}:${column}`
}

export function parseCarouselLoc(value: string, carouselId: string): SourceLocation | null {
  const prefix = `${carouselId}:`
  if (!value.startsWith(prefix)) return null
  const match = /^(\d+):(\d+)$/.exec(value.slice(prefix.length))
  if (!match) return null
  return { line: Number(match[1]), column: Number(match[2]) }
}
