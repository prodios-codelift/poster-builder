import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { AssetManager } from '@/asset-library/asset-manager'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/assets/')({
  head: () => ({ meta: [{ title: 'Assets · Poster Builder' }] }),
  component: AssetsPage,
})

function AssetsPage() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-2 border-b px-3 py-2.5 md:px-5 md:py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link to="/" />}
          nativeButton={false}
          role="link"
          aria-label="Back to home"
        >
          <ArrowLeftIcon />
        </Button>
        <div className="flex min-w-0 flex-col">
          <h1 className="text-sm font-medium">Asset library</h1>
          <p className="truncate text-xs text-muted-foreground">
            Logos, photos and fonts shared by every post and poster.
          </p>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">
        <AssetManager variant="page" />
      </main>
    </div>
  )
}
