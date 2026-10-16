import type { FC } from 'react'

import { slides as uaeBuyerRequirementSlides } from './carousels/uae-buyer-requirement'
import { slides as uaeOmnichannelCrmSlides } from './carousels/uae-omnichannel-crm'
import * as auroraGlowTheme from './themes/aurora-glow'
import * as bentoPopTheme from './themes/bento-pop'
import * as boardroomNavyTheme from './themes/boardroom-navy'
import * as boldDuotoneTheme from './themes/bold-duotone'
import * as condensedImpactTheme from './themes/condensed-impact'
import * as dataBriefTheme from './themes/data-brief'
import * as geometricCorporateTheme from './themes/geometric-corporate'
import * as giantNumeralTheme from './themes/giant-numeral'
import * as halftonePopTheme from './themes/halftone-pop'
import * as highlighterNotesTheme from './themes/highlighter-notes'
import * as midnightTerminalTheme from './themes/midnight-terminal'
import * as neoBrutalistTheme from './themes/neo-brutalist'
import * as noirLuxeTheme from './themes/noir-luxe'
import * as oliveSerifTheme from './themes/olive-serif'
import * as paperEditorialTheme from './themes/paper-editorial'
import * as softGradientTheme from './themes/soft-gradient'
import * as splitVersusTheme from './themes/split-versus'
import * as swissGridTheme from './themes/swiss-grid'
import * as tornPaperTheme from './themes/torn-paper'
import type { LinkedInCarousel } from './types'
import { type ThemePalette, withPalette } from './with-palette'

export { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'
export type { LinkedInCarousel } from './types'

type ThemeDemo = { slides: FC[]; PALETTES: Record<string, ThemePalette> }

/** One studio entry per palette variant of a theme demo. */
function themeEntries(id: string, name: string, theme: ThemeDemo): LinkedInCarousel[] {
  return Object.entries(theme.PALETTES).map(([key, palette]) => ({
    id: `theme-${id}--${key}`,
    name: `${name} · ${palette.name}`,
    slides: withPalette(theme.slides, palette.tokens),
  }))
}

/** User-created carousels shown under My posts. */
export const carousels: LinkedInCarousel[] = [
  {
    id: 'uae-buyer-requirement',
    name: 'Match inventory to the buyer brief',
    slides: uaeBuyerRequirementSlides,
  },
  {
    id: 'uae-omnichannel-crm',
    name: 'One inbox: AI-native CRM for the UAE',
    slides: uaeOmnichannelCrmSlides,
  },
]

/** Built-in theme demos shown under Themes. */
export const themes: LinkedInCarousel[] = [
  ...themeEntries('paper-editorial', 'Paper Editorial', paperEditorialTheme),
  ...themeEntries('boardroom-navy', 'Boardroom Navy', boardroomNavyTheme),
  ...themeEntries('swiss-grid', 'Swiss Grid', swissGridTheme),
  ...themeEntries('data-brief', 'Data Brief', dataBriefTheme),
  ...themeEntries('midnight-terminal', 'Midnight Terminal', midnightTerminalTheme),
  ...themeEntries('aurora-glow', 'Aurora Glow', auroraGlowTheme),
  ...themeEntries('noir-luxe', 'Noir Luxe', noirLuxeTheme),
  ...themeEntries('neo-brutalist', 'Neo-Brutalist', neoBrutalistTheme),
  ...themeEntries('bold-duotone', 'Bold Duotone', boldDuotoneTheme),
  ...themeEntries('bento-pop', 'Bento Pop', bentoPopTheme),
  ...themeEntries('highlighter-notes', 'Highlighter Notes', highlighterNotesTheme),
  ...themeEntries('condensed-impact', 'Condensed Impact', condensedImpactTheme),
  ...themeEntries('torn-paper', 'Torn Paper', tornPaperTheme),
  ...themeEntries('olive-serif', 'Olive Serif', oliveSerifTheme),
  ...themeEntries('split-versus', 'Split Versus', splitVersusTheme),
  ...themeEntries('soft-gradient', 'Soft Gradient', softGradientTheme),
  ...themeEntries('geometric-corporate', 'Geometric Corporate', geometricCorporateTheme),
  ...themeEntries('giant-numeral', 'Giant Numeral', giantNumeralTheme),
  ...themeEntries('halftone-pop', 'Halftone Pop', halftonePopTheme),
]
