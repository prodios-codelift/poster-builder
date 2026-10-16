import { slides as sampleSlides } from './carousels/sample'
import { slides as paperEditorialThemeSlides } from './themes/paper-editorial'
import type { LinkedInCarousel } from './types'

export { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'
export type { LinkedInCarousel } from './types'

export const carousels: LinkedInCarousel[] = [
  {
    id: 'sample',
    name: 'Sample carousel',
    slides: sampleSlides,
  },

  // Theme demos
  {
    id: 'theme-paper-editorial',
    name: 'Theme · Paper Editorial',
    slides: paperEditorialThemeSlides,
  },
]
