import type { FC } from 'react'

import { sampleSlides } from './sample'

export { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'

export type LinkedInCarousel = {
  id: string
  name: string
  slides: FC[]
}

export const carousels: LinkedInCarousel[] = [
  {
    id: 'sample',
    name: 'Sample carousel',
    slides: sampleSlides,
  },
]
