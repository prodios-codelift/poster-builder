import { cn } from 'cn'
import { createContext, useContext } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './dimensions'

const PaletteOverrideContext = createContext<CSSProperties>({})

/** Overrides a slide's `--cx-*` tokens. Used by the studio to preview theme palette variants. */
export function PaletteOverrideProvider({
  palette,
  children,
}: {
  palette: CSSProperties
  children: ReactNode
}) {
  return <PaletteOverrideContext value={palette}>{children}</PaletteOverrideContext>
}

export function LinkedInCarouselSlide({
  children,
  className,
  tokens,
}: {
  children: ReactNode
  className?: string
  /** The carousel's `--cx-*` CSS variables, applied to the slide root. */
  tokens?: CSSProperties
}) {
  const override = useContext(PaletteOverrideContext)
  return (
    <div
      className={cn('relative overflow-hidden bg-white text-black', className)}
      style={{ ...tokens, ...override, width: CAROUSEL_WIDTH, height: CAROUSEL_HEIGHT }}
    >
      {children}
    </div>
  )
}
