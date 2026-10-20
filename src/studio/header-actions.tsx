import { useServerFn } from '@tanstack/react-start'
import { ChevronDownIcon, DownloadIcon, FileTextIcon, ImageIcon, SaveIcon } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import {
  clearCarouselTextEdits,
  getCarouselTextEditCount,
  getPendingCarouselTextEdits,
  subscribeCarouselTextEdits,
} from '@/linkedin-carousels/carousel-text-edits'
import { saveCarouselText } from '@/linkedin-carousels/save-carousel-text'

import { exportAsImages, exportAsPdf } from './export'
import type { SlideSize, StudioPost } from './types'

/** Dev-only: writes pending inline text edits back to the post's source file. */
export function SaveButton() {
  const editCount = useSyncExternalStore(
    subscribeCarouselTextEdits,
    getCarouselTextEditCount,
    () => 0,
  )
  const saveFn = useServerFn(saveCarouselText)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSave() {
    if (editCount === 0 || isSaving) return
    setIsSaving(true)
    setError(null)
    try {
      const edits = getPendingCarouselTextEdits().map(({ file, position, prevText, nextText }) => ({
        file,
        position,
        prevText,
        nextText,
      }))
      await saveFn({ data: { edits } })
      clearCarouselTextEdits()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  const label = isSaving ? 'Saving...' : 'Save'

  return (
    <div className="flex items-center gap-2">
      {error ? (
        <span className="hidden max-w-48 truncate text-xs text-destructive md:block" title={error}>
          {error}
        </span>
      ) : null}
      <Button
        variant="outline"
        disabled={editCount === 0 || isSaving}
        aria-label={label}
        title={error ?? label}
        onClick={() => void onSave()}
      >
        {isSaving ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
        <span className="hidden lg:inline">{label}</span>
      </Button>
    </div>
  )
}

export function ExportMenu({ post, size }: { post: StudioPost | null; size: SlideSize }) {
  const [isExporting, setIsExporting] = useState(false)

  async function runExport(action: 'pdf' | 'images') {
    if (!post || isExporting) return
    setIsExporting(true)
    try {
      if (action === 'pdf') {
        await exportAsPdf(post, size)
      } else {
        await exportAsImages(post, size)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const canExport = Boolean(post) && !isExporting
  const label = isExporting ? 'Exporting...' : 'Export'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" disabled={!canExport} aria-label={label} title={label} />}
      >
        {isExporting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <DownloadIcon data-icon="inline-start" />
        )}
        <span className="hidden lg:inline">{label}</span>
        <ChevronDownIcon data-icon="inline-end" className="hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuGroup>
          <DropdownMenuItem className="whitespace-nowrap" onClick={() => void runExport('pdf')}>
            <FileTextIcon />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem className="whitespace-nowrap" onClick={() => void runExport('images')}>
            <ImageIcon />
            Export as image
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
