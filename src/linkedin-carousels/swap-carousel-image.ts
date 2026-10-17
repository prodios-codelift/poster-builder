import { createServerFn } from '@tanstack/react-start'

import { ASSETS_DIR, isImageAssetName, validateAssetName } from '@/asset-library/asset-files'

import type { CarouselImageSwap } from './edit-carousel-image'

const CAROUSELS_DIR = 'src/linkedin-carousels/carousels'

function validateInput(data: unknown): CarouselImageSwap {
  if (!data || typeof data !== 'object') throw new Error('Invalid image swap payload')
  const body = data as Record<string, unknown>
  for (const key of ['file', 'position', 'src', 'assetName'] as const) {
    if (typeof body[key] !== 'string') throw new Error(`Missing ${key}`)
  }
  const assetName = validateAssetName(body.assetName)
  if (!assetName || !isImageAssetName(assetName)) {
    throw new Error(`Not an image asset: ${String(body.assetName)}`)
  }
  return {
    file: body.file as string,
    position: body.position as string,
    src: body.src as string,
    assetName,
  }
}

/**
 * Dev-only: point an image on a carousel slide at a file in the global
 * `assets/` folder by rewriting the carousel's imports (see
 * `applyCarouselImageSwap`). Only `.tsx` files under `carousels/` are written.
 */
export const swapCarouselImage = createServerFn({ method: 'POST' })
  .validator(validateInput)
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      throw new Error('Image swapping is only available in development')
    }

    const [{ readFile, rename, stat, writeFile }, { applyCarouselImageSwap }, path] =
      await Promise.all([
        import('node:fs/promises'),
        import('./edit-carousel-image'),
        import('node:path'),
      ])

    const carouselsRoot = path.resolve(process.cwd(), CAROUSELS_DIR)
    const filePath = path.resolve(process.cwd(), data.file)
    if (!filePath.startsWith(`${carouselsRoot}${path.sep}`) || !filePath.endsWith('.tsx')) {
      throw new Error(`Invalid carousel file: ${data.file}`)
    }
    const assetFile = await stat(path.resolve(process.cwd(), ASSETS_DIR, data.assetName)).catch(
      () => null,
    )
    if (!assetFile?.isFile()) throw new Error(`Asset not found: ${data.assetName}`)

    let source: string
    try {
      source = await readFile(filePath, 'utf8')
    } catch {
      throw new Error(`Carousel file not found: ${data.file}`)
    }

    const result = applyCarouselImageSwap(source, data)
    if (!result.ok) throw new Error(result.error)
    if (result.source !== source) {
      const tmp = `${filePath}.tmp`
      await writeFile(tmp, result.source, 'utf8')
      await rename(tmp, filePath)
    }
    return { ok: true as const, replaced: result.replaced }
  })
