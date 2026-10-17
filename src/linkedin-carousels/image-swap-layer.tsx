import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import { ASSET_DRAG_TYPE, isImageAssetName } from '@/asset-library/asset-files'
import { errorMessage, uploadWithAutoRename } from '@/asset-library/asset-client'
import { AssetPickerDialog } from '@/asset-library/asset-picker-dialog'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import {
  clearCarouselTextEdits,
  getCarouselTextEditCount,
  getPendingCarouselTextEdits,
} from './carousel-text-edits'
import { saveCarouselText } from './save-carousel-text'
import { swapCarouselImage } from './swap-carousel-image'

/** `<img>` elements stamped by `vite-plugin-slide-source.ts`. */
const IMAGE_SELECTOR = 'img[data-slide-element-type="image"]'
const TEXT_SELECTOR = '[data-slide-element-type="text"]'

type ScreenRect = { left: number; top: number; width: number; height: number }
type Status = { tone: 'info' | 'error' | 'busy'; text: string } | null

function rectOf(el: Element): ScreenRect {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

/**
 * Topmost slide image under the point, looking through overlays such as a
 * `Photo` tint or `PhotoBackdrop` gradient. Text on top wins, so clicking a
 * headline over a photo still edits the headline.
 */
function imageAt(root: HTMLElement, x: number, y: number): HTMLImageElement | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (!root.contains(el)) continue
    if (el.closest(TEXT_SELECTOR)) return null
    if (el instanceof HTMLImageElement && el.matches(IMAGE_SELECTOR)) return el
  }
  return null
}

function isAssetDrag(event: DragEvent): boolean {
  const types = event.dataTransfer?.types ?? []
  return types.includes(ASSET_DRAG_TYPE) || types.includes('Files')
}

/**
 * Dev-only: hover an image on the main slide canvas to outline it, click it to
 * pick a replacement from the global asset library, or drop an asset (from
 * the studio's Assets tab) or an image file onto it. The carousel source is
 * rewritten to import the asset from `@assets/…` and HMR shows the result.
 */
export function ImageSwapLayer({
  enabled,
  canvasElement,
}: {
  enabled: boolean
  canvasElement: HTMLElement | null
}) {
  const swapFn = useServerFn(swapCarouselImage)
  const saveFn = useServerFn(saveCarouselText)
  const [hover, setHover] = useState<{ img: HTMLImageElement; rect: ScreenRect } | null>(null)
  const [dropTarget, setDropTarget] = useState<ScreenRect | null>(null)
  const [picking, setPicking] = useState<HTMLImageElement | null>(null)
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => {
    if (!status || status.tone === 'busy') return
    const id = setTimeout(() => setStatus(null), status.tone === 'error' ? 6000 : 2500)
    return () => clearTimeout(id)
  }, [status])

  async function swap(img: HTMLImageElement, assetName: string) {
    const file = img.dataset.slideFile
    const position = img.dataset.slidePosition
    if (!file || !position) return
    const src = new URL(img.currentSrc || img.src, window.location.href).pathname
    setStatus({ tone: 'busy', text: 'Replacing image…' })
    try {
      // The swap adds/removes import lines, which would shift the line:column
      // keys of unsaved text edits, so save those first.
      if (getCarouselTextEditCount() > 0) {
        const edits = getPendingCarouselTextEdits().map(
          ({ file, position, prevText, nextText }) => ({
            file,
            position,
            prevText,
            nextText,
          }),
        )
        await saveFn({ data: { edits } })
        clearCarouselTextEdits()
      }
      const { replaced } = await swapFn({ data: { file, position, src, assetName } })
      setStatus({
        tone: 'info',
        text:
          replaced === 0
            ? 'Already using that image'
            : replaced === 1
              ? `Image replaced with ${assetName}`
              : `Replaced in ${replaced} places with ${assetName}`,
      })
    } catch (cause) {
      setStatus({ tone: 'error', text: errorMessage(cause, 'Could not replace the image') })
    }
  }

  useEffect(() => {
    const root = canvasElement
    if (!enabled || !root) {
      setHover(null)
      setDropTarget(null)
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const img = imageAt(root, event.clientX, event.clientY)
      root.style.cursor = img ? 'pointer' : ''
      setHover((current) =>
        current?.img === img ? current : img ? { img, rect: rectOf(img) } : null,
      )
    }

    const onPointerLeave = () => {
      root.style.cursor = ''
      setHover(null)
    }

    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(TEXT_SELECTOR)) return
      const img = imageAt(root, event.clientX, event.clientY)
      if (!img) return
      event.preventDefault()
      setHover(null)
      setPicking(img)
    }

    const onDragOver = (event: DragEvent) => {
      if (!isAssetDrag(event)) return
      const img = imageAt(root, event.clientX, event.clientY)
      if (!img) {
        setDropTarget(null)
        return
      }
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
      setDropTarget(rectOf(img))
    }

    const onDragLeave = (event: DragEvent) => {
      if (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget)) {
        setDropTarget(null)
      }
    }

    const onDrop = (event: DragEvent) => {
      setDropTarget(null)
      if (!isAssetDrag(event) || !event.dataTransfer) return
      const img = imageAt(root, event.clientX, event.clientY)
      if (!img) return
      event.preventDefault()
      const assetName = event.dataTransfer.getData(ASSET_DRAG_TYPE)
      if (assetName) {
        void swap(img, assetName)
        return
      }
      const file = [...event.dataTransfer.files].find((f) => isImageAssetName(f.name))
      if (!file) {
        setStatus({ tone: 'error', text: 'Drop an image file to replace this image' })
        return
      }
      setStatus({ tone: 'busy', text: `Uploading ${file.name}…` })
      uploadWithAutoRename(file)
        .then((name) => swap(img, name))
        .catch((cause: unknown) =>
          setStatus({ tone: 'error', text: errorMessage(cause, 'Upload failed') }),
        )
    }

    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerleave', onPointerLeave)
    root.addEventListener('click', onClick)
    root.addEventListener('dragover', onDragOver)
    root.addEventListener('dragleave', onDragLeave)
    root.addEventListener('drop', onDrop)
    return () => {
      root.style.cursor = ''
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', onPointerLeave)
      root.removeEventListener('click', onClick)
      root.removeEventListener('dragover', onDragOver)
      root.removeEventListener('dragleave', onDragLeave)
      root.removeEventListener('drop', onDrop)
    }
    // `swap` only reads stable server-fn handles and module stores.
  }, [enabled, canvasElement])

  if (!enabled) return null

  const frame = dropTarget ?? (hover && !picking ? hover.rect : null)

  return (
    <>
      {frame ? (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none fixed z-40 rounded-[2px] border-2 border-sky-500',
            dropTarget ? 'bg-sky-500/15' : 'border-dashed bg-sky-500/5',
          )}
          style={frame}
        >
          <span className="absolute top-1.5 left-1.5 rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-white shadow-sm">
            {dropTarget ? 'Drop to replace' : 'Click to replace'}
          </span>
        </div>
      ) : null}

      {status ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center">
          <div
            role="status"
            className={cn(
              'flex max-w-[calc(100%-2rem)] items-center gap-2 truncate rounded-full border bg-background/95 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur',
              status.tone === 'error' && 'text-destructive',
            )}
            title={status.text}
          >
            {status.tone === 'busy' ? <Spinner className="size-3.5" /> : null}
            {status.text}
          </div>
        </div>
      ) : null}

      <AssetPickerDialog
        open={picking !== null}
        onOpenChange={(open) => {
          if (!open) setPicking(null)
        }}
        onPick={(name) => {
          const img = picking
          setPicking(null)
          if (img) void swap(img, name)
        }}
      />
    </>
  )
}
