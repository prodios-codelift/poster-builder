import { Link } from '@tanstack/react-router'
import { SearchIcon, UploadIcon } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import { filterAssets, isImageAssetName } from './asset-files'
import { errorMessage, uploadWithAutoRename, useAssetLibrary } from './asset-client'
import { AssetThumb } from './asset-thumb'

/**
 * Choose an image from the global asset library, or upload one (which is
 * picked straight away). Only images are listed.
 */
export function AssetPickerDialog({
  open,
  title = 'Replace image',
  description = 'Pick an image from assets/ or upload a new one.',
  onOpenChange,
  onPick,
}: {
  open: boolean
  title?: string
  description?: string
  onOpenChange: (open: boolean) => void
  onPick: (name: string) => void
}) {
  const library = useAssetLibrary()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setError(null)
  }, [open])

  const images = useMemo(
    () => filterAssets(library.assets, { query: deferredQuery, kind: 'image' }),
    [library.assets, deferredQuery],
  )

  async function upload(file: File | undefined) {
    if (!file) return
    if (!isImageAssetName(file.name)) {
      setError(`${file.name} is not an image.`)
      return
    }
    setUploading(true)
    setError(null)
    try {
      onPick(await uploadWithAutoRename(file))
    } catch (cause) {
      setError(errorMessage(cause, 'Upload failed'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(40rem,85vh)] flex-col sm:max-w-2xl"
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes('Files')) return
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setDragging(false)
        }}
        onDrop={(event) => {
          if (!event.dataTransfer.types.includes('Files')) return
          event.preventDefault()
          setDragging(false)
          void upload(event.dataTransfer.files[0])
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              placeholder="Search images"
              aria-label="Search images"
              className="pl-8"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button variant="outline" disabled={uploading} onClick={() => fileInput.current?.click()}>
            {uploading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <UploadIcon data-icon="inline-start" />
            )}
            Upload
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              void upload(file)
            }}
          />
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        <div
          className={cn(
            'min-h-40 flex-1 overflow-y-auto rounded-lg',
            dragging && 'ring-2 ring-primary/60 ring-dashed',
          )}
        >
          {!library.available ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Assets are only available in dev mode.
            </p>
          ) : !library.loaded ? (
            <div className="flex justify-center p-6">
              <Spinner />
            </div>
          ) : images.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {query ? 'No images match.' : 'No images in assets/ yet. Upload or drop one here.'}
            </p>
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 p-0.5">
              {images.map((asset) => (
                <li key={asset.name}>
                  <button
                    type="button"
                    onClick={() => onPick(asset.name)}
                    className="flex w-full flex-col gap-1.5 rounded-lg p-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <AssetThumb
                      asset={asset}
                      className="aspect-square w-full rounded-md ring-1 ring-border"
                    />
                    <span className="truncate px-0.5 text-xs font-medium" title={asset.name}>
                      {asset.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Manage files in the{' '}
          <Link
            to="/assets"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            asset library
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  )
}
