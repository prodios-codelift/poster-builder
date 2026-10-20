import { createFileRoute } from '@tanstack/react-router'
import { useCallback } from 'react'

import { carouselSourceFile } from '@/linkedin-carousels/carousel-comments'
import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH, carousels, themes } from '@/linkedin-carousels/registry'
import { Studio } from '@/studio/studio'
import { type StudioConfig, type StudioSearch, validateStudioSearch } from '@/studio/types'

const config: StudioConfig = {
  title: 'LinkedIn carousel studio',
  size: { width: CAROUSEL_WIDTH, height: CAROUSEL_HEIGHT },
  tabs: [
    {
      id: 'posts',
      label: 'My posts',
      items: carousels,
      emptyLabel: 'No posts yet.',
      placeholder: 'Select a post to preview its slides.',
      editable: true,
    },
    {
      id: 'themes',
      label: 'Themes',
      items: themes,
      emptyLabel: 'No themes registered yet.',
      placeholder: 'Select a theme to preview its slides.',
    },
  ],
  sourceFileOf: carouselSourceFile,
}

export const Route = createFileRoute('/linkedin-carousel/')({
  validateSearch: validateStudioSearch,
  component: LinkedInCarouselStudio,
})

function LinkedInCarouselStudio() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  /** Replace (not push) so stepping through slides does not fill browser history. */
  const updateSearch = useCallback(
    (patch: Partial<StudioSearch>) => {
      void navigate({
        search: (prev) => ({ ...prev, ...patch }),
        replace: true,
        resetScroll: false,
      })
    },
    [navigate],
  )

  return <Studio config={config} search={search} onSearchChange={updateSearch} />
}
