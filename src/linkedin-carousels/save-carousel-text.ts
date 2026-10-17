import { createServerFn } from '@tanstack/react-start'

import type { CarouselTextEdit } from './edit-carousel-source'

const CAROUSELS_DIR = 'src/linkedin-carousels/carousels'

type SaveCarouselTextInput = {
  edits: CarouselTextEdit[]
}

function isTextEdit(value: unknown): value is CarouselTextEdit {
  if (!value || typeof value !== 'object') return false
  const edit = value as Record<string, unknown>
  return (
    typeof edit.file === 'string' &&
    typeof edit.position === 'string' &&
    typeof edit.prevText === 'string' &&
    typeof edit.nextText === 'string'
  )
}

function validateInput(data: unknown): SaveCarouselTextInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid save payload')
  }
  const body = data as { edits?: unknown }
  if (!Array.isArray(body.edits) || !body.edits.every(isTextEdit)) {
    throw new Error('Invalid edits')
  }
  return { edits: body.edits }
}

/**
 * Dev-only: write inline text edits back to the carousel source file named by
 * each edit's `file` (stamped by the slide-source Vite plugin). Only `.tsx`
 * files under `carousels/` are valid targets; themes are never written.
 */
export const saveCarouselText = createServerFn({ method: 'POST' })
  .validator(validateInput)
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      throw new Error('Inline carousel editing is only available in development')
    }
    if (data.edits.length === 0) {
      return { ok: true as const }
    }

    const [{ readFile, writeFile, rename }, { applyCarouselTextEdits }, path] = await Promise.all([
      import('node:fs/promises'),
      import('./edit-carousel-source'),
      import('node:path'),
    ])

    const carouselsRoot = path.resolve(process.cwd(), CAROUSELS_DIR)
    const byFile = new Map<string, CarouselTextEdit[]>()
    for (const edit of data.edits) {
      const filePath = path.resolve(process.cwd(), edit.file)
      if (!filePath.startsWith(`${carouselsRoot}${path.sep}`) || !filePath.endsWith('.tsx')) {
        throw new Error(`Invalid carousel file: ${edit.file}`)
      }
      byFile.set(filePath, [...(byFile.get(filePath) ?? []), edit])
    }

    // Resolve every file first so a bad edit never leaves a partial save.
    const writes: { filePath: string; source: string }[] = []
    for (const [filePath, edits] of byFile) {
      let source: string
      try {
        source = await readFile(filePath, 'utf8')
      } catch {
        throw new Error(`Carousel file not found: ${path.relative(process.cwd(), filePath)}`)
      }
      const result = applyCarouselTextEdits(source, edits)
      if (!result.ok) throw new Error(result.error)
      if (result.source !== source) writes.push({ filePath, source: result.source })
    }

    for (const { filePath, source } of writes) {
      const tmp = `${filePath}.tmp`
      await writeFile(tmp, source, 'utf8')
      await rename(tmp, filePath)
    }

    return { ok: true as const }
  })
