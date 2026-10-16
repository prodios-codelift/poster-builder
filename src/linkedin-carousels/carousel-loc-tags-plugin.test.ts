import { describe, expect, it } from 'vite-plus/test'

import { parseCarouselLoc } from './carousel-loc'
import { carouselIdFromModuleId, injectCarouselLocTags } from './carousel-loc-tags-plugin'

describe('injectCarouselLocTags', () => {
  it('tags host and component JSX with the carousel id and Babel location', () => {
    const code = `function Cover() {
  return (
    <Frame>
      <p className="x">Hi</p>
      <>
        <span>a</span>
      </>
      <Fragment>
        <b>b</b>
      </Fragment>
    </Frame>
  )
}
`
    expect(injectCarouselLocTags(code, 'demo')).toBe(`function Cover() {
  return (
    <Frame data-carousel-loc="demo:3:4">
      <p data-carousel-loc="demo:4:6" className="x">Hi</p>
      <>
        <span data-carousel-loc="demo:6:8">a</span>
      </>
      <Fragment>
        <b data-carousel-loc="demo:9:8">b</b>
      </Fragment>
    </Frame>
  )
}
`)
  })

  it('returns null when there is no JSX to tag', () => {
    expect(injectCarouselLocTags('export const slides = []\n', 'demo')).toBeNull()
  })
})

describe('carouselIdFromModuleId', () => {
  const root = '/repo/src/linkedin-carousels/carousels'

  it('returns the id for a carousel index file, ignoring Vite queries', () => {
    expect(carouselIdFromModuleId(`${root}/uae-buyer/index.tsx?t=123`, root)).toBe('uae-buyer')
  })

  it('ignores other files', () => {
    expect(carouselIdFromModuleId(`${root}/uae-buyer/parts.tsx`, root)).toBeNull()
    expect(
      carouselIdFromModuleId('/repo/src/linkedin-carousels/themes/x/index.tsx', root),
    ).toBeNull()
  })
})

describe('parseCarouselLoc', () => {
  it('reads a location for the matching carousel', () => {
    expect(parseCarouselLoc('uae-buyer:12:4', 'uae-buyer')).toEqual({ line: 12, column: 4 })
  })

  it('rejects locations from another carousel', () => {
    expect(parseCarouselLoc('other:12:4', 'uae-buyer')).toBeNull()
  })
})
