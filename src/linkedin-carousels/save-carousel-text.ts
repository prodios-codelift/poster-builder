import { createServerFn } from '@tanstack/react-start'

import type { CarouselTextEdit, CarouselTextTarget } from './edit-carousel-source'

const CAROUSEL_ID = /^[a-z0-9-]+$/

type SaveCarouselTextInput = {
  carouselId: string
  edits: CarouselTextEdit[]
}

type CheckCarouselTextInput = {
  carouselId: string
  targets: CarouselTextTarget[]
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

function hasLocations(value: { locations?: unknown }): boolean {
  return Array.isArray(value.locations) && value.locations.every(isSourceLocation)
}

function isTextEdit(value: unknown): value is CarouselTextEdit {
  if (!value || typeof value !== 'object') return false
  const edit = value as {
    locations?: unknown
    prevText?: unknown
    nextText?: unknown
  }
  return (
    hasLocations(edit) && typeof edit.prevText === 'string' && typeof edit.nextText === 'string'
  )
}

function isTextTarget(value: unknown): value is CarouselTextTarget {
  if (!value || typeof value !== 'object') return false
  const target = value as { locations?: unknown; text?: unknown }
  return hasLocations(target) && typeof target.text === 'string'
}

function validateCarouselId(data: unknown): { carouselId: string } & Record<string, unknown> {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid payload')
  }
  const body = data as { carouselId?: unknown } & Record<string, unknown>
  if (typeof body.carouselId !== 'string' || !CAROUSEL_ID.test(body.carouselId)) {
    throw new Error('Invalid carousel id')
  }
  return { ...body, carouselId: body.carouselId }
}

function validateSaveInput(data: unknown): SaveCarouselTextInput {
  const body = validateCarouselId(data)
  if (!Array.isArray(body.edits) || !body.edits.every(isTextEdit)) {
    throw new Error('Invalid edits')
  }
  return { carouselId: body.carouselId, edits: body.edits }
}

function validateCheckInput(data: unknown): CheckCarouselTextInput {
  const body = validateCarouselId(data)
  if (!Array.isArray(body.targets) || !body.targets.every(isTextTarget)) {
    throw new Error('Invalid targets')
  }
  return { carouselId: body.carouselId, targets: body.targets }
}

/** Resolves `carousels/<id>/index.tsx`; theme files under `themes/` are never a target. */
async function carouselFile(carouselId: string): Promise<{ filePath: string; source: string }> {
  if (!import.meta.env.DEV) {
    throw new Error('Inline carousel editing is only available in development')
  }
  const [{ readFile }, path] = await Promise.all([import('node:fs/promises'), import('node:path')])
  const carouselsRoot = path.resolve(process.cwd(), 'src/linkedin-carousels/carousels')
  const filePath = path.resolve(carouselsRoot, carouselId, 'index.tsx')
  if (!filePath.startsWith(`${carouselsRoot}${path.sep}`)) {
    throw new Error('Invalid carousel path')
  }
  try {
    return { filePath, source: await readFile(filePath, 'utf8') }
  } catch {
    throw new Error(`Carousel file not found: ${carouselId}`)
  }
}

/** Dev-only: splice literal text edits into `carousels/<id>/index.tsx`. */
export const saveCarouselText = createServerFn({ method: 'POST' })
  .validator(validateSaveInput)
  .handler(async ({ data }) => {
    const { carouselId, edits } = data
    if (edits.length === 0) {
      return { ok: true as const }
    }

    const [{ filePath, source }, { writeFile }, { applyCarouselTextEdits }] = await Promise.all([
      carouselFile(carouselId),
      import('node:fs/promises'),
      import('./edit-carousel-source'),
    ])

    const result = applyCarouselTextEdits(source, edits)
    if (!result.ok) {
      throw new Error(result.error)
    }

    if (result.source !== source) {
      await writeFile(filePath, result.source, 'utf8')
    }

    return { ok: true as const }
  })

/**
 * Dev-only: which on-canvas texts map to a literal in the carousel source.
 * Text computed in code (page numbers, joined values) stays read-only.
 */
export const checkCarouselText = createServerFn({ method: 'POST' })
  .validator(validateCheckInput)
  .handler(async ({ data }) => {
    const [{ source }, { findEditableCarouselText }] = await Promise.all([
      carouselFile(data.carouselId),
      import('./edit-carousel-source'),
    ])
    return { editable: findEditableCarouselText(source, data.targets) }
  })
