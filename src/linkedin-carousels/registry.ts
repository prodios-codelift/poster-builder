import { slides as sampleSlides } from './carousels/sample'
import type { LinkedInCarousel } from './types'

export { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'
export type { LinkedInCarousel } from './types'

export const carousels: LinkedInCarousel[] = [
  {
    id: 'sample',
    name: 'Sample carousel',
    slides: sampleSlides,
  },
]
