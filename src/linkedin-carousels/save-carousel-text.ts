import { createServerFn } from '@tanstack/react-start'

import type { CarouselTextEdit } from './edit-carousel-source'

const CAROUSEL_ID = /^[a-z0-9-]+$/

type SaveCarouselTextInput = {
  carouselId: string
  edits: CarouselTextEdit[]
}

function isSourceLocation(value: unknown): value is { line: number; column: number } {
  if (!value || typeof value !== 'object') return false
  const loc = value as { line?: unknown; column?: unknown }
  return (
    typeof loc.line === 'number' &&
    Number.isFinite(loc.line) &&
    typeof loc.column === 'number' &&
    Number.isFinite(loc.column)
  )
}

function isTextEdit(value: unknown): value is CarouselTextEdit {
  if (!value || typeof value !== 'object') return false
  const edit = value as {
    locations?: unknown
    prevText?: unknown
    nextText?: unknown
  }
  return (
    Array.isArray(edit.locations) &&
    edit.locations.every(isSourceLocation) &&
    typeof edit.prevText === 'string' &&
    typeof edit.nextText === 'string'
  )
}

function validateInput(data: unknown): SaveCarouselTextInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid save payload')
  }
  const body = data as { carouselId?: unknown; edits?: unknown }
  if (typeof body.carouselId !== 'string' || !CAROUSEL_ID.test(body.carouselId)) {
    throw new Error('Invalid carousel id')
  }
  if (!Array.isArray(body.edits) || !body.edits.every(isTextEdit)) {
    throw new Error('Invalid edits')
  }
  return { carouselId: body.carouselId, edits: body.edits }
}

/**
 * Dev-only: splice literal text edits into `carousels/<id>/index.tsx`.
 * Theme files under `themes/` are never a valid write target.
 */
export const saveCarouselText = createServerFn({ method: 'POST' })
  .validator(validateInput)
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      throw new Error('Inline carousel editing is only available in development')
    }

    const { carouselId, edits } = data
    if (edits.length === 0) {
      return { ok: true as const }
    }

    const [{ readFile, writeFile }, { applyCarouselTextEdits }] = await Promise.all([
      import('node:fs/promises'),
      import('./edit-carousel-source'),
    ])
    const path = await import('node:path')

    const filePath = path.resolve(
      process.cwd(),
      'src/linkedin-carousels/carousels',
      carouselId,
      'index.tsx',
    )
    const carouselsRoot = path.resolve(process.cwd(), 'src/linkedin-carousels/carousels')
    if (!filePath.startsWith(`${carouselsRoot}${path.sep}`)) {
      throw new Error('Invalid carousel path')
    }

    let source: string
    try {
      source = await readFile(filePath, 'utf8')
    } catch {
      throw new Error(`Carousel file not found: ${carouselId}`)
    }

    const result = applyCarouselTextEdits(source, edits)
    if (!result.ok) {
      throw new Error(result.error)
    }

    if (result.source !== source) {
      await writeFile(filePath, result.source, 'utf8')
    }

    return { ok: true as const }
  })
