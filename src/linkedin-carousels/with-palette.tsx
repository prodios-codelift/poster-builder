import type { CSSProperties, FC } from 'react'

import { PaletteOverrideProvider } from './linkedin-carousel-slide'

export type ThemePalette = { name: string; tokens: CSSProperties }

/** Wraps each slide so its `--cx-*` tokens are replaced by `palette`. */
export function withPalette(slides: FC[], palette: CSSProperties): FC[] {
  return slides.map((Slide) => {
    function PalettedSlide() {
      return (
        <PaletteOverrideProvider palette={palette}>
          <Slide />
        </PaletteOverrideProvider>
      )
    }
    PalettedSlide.displayName = `Paletted(${Slide.displayName ?? Slide.name})`
    return PalettedSlide
  })
}
