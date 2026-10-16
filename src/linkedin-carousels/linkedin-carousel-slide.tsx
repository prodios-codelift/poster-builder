import { cn } from 'cn'
import type { ReactNode } from 'react'

import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'

export function LinkedInCarouselSlide({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden bg-white text-black', className)}
      style={{ width: CAROUSEL_WIDTH, height: CAROUSEL_HEIGHT }}
    >
      {children}
    </div>
  )
}
