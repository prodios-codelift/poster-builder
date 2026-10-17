import { createServerFn } from '@tanstack/react-start'

import { insertCarouselComment, isCommentableFile, parseTsdSource } from './carousel-comments'

type AddCarouselCommentInput = {
  /** Raw `data-tsd-source` attribute value. */
  source: string
  text: string
  /** 0-based slide index open in the studio. */
  page?: number
}

function validateInput(data: unknown): AddCarouselCommentInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid comment payload')
  }
  const body = data as Record<string, unknown>
  if (typeof body.source !== 'string' || !body.source) {
    throw new Error('Missing source location')
  }
  if (typeof body.text !== 'string') {
    throw new Error('Missing comment text')
  }
  const page =
    body.page === undefined
      ? undefined
      : typeof body.page === 'number' && Number.isFinite(body.page) && body.page >= 0
        ? Math.floor(body.page)
        : undefined
  if (body.page !== undefined && page === undefined) {
    throw new Error('Invalid page')
  }
  return { source: body.source, text: body.text, page }
}

/**
 * Dev-only: insert a `@slide-comment` marker into a carousel or theme source
 * file at the JSX location named by `data-tsd-source`.
 */
export const addCarouselComment = createServerFn({ method: 'POST' })
  .validator(validateInput)
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      throw new Error('Slide comments are only available in development')
    }

    const parsed = parseTsdSource(data.source)
    if (!parsed) {
      throw new Error(`Invalid data-tsd-source: ${data.source}`)
    }
    if (!isCommentableFile(parsed.file)) {
      throw new Error(`Comments are only allowed under linkedin-carousels: ${parsed.file}`)
    }

    const [{ readFile, writeFile, rename }, path] = await Promise.all([
      import('node:fs/promises'),
      import('node:path'),
    ])

    const carouselsRoot = path.resolve(process.cwd(), 'src/linkedin-carousels')
    const filePath = path.resolve(process.cwd(), parsed.file)
    if (!filePath.startsWith(`${carouselsRoot}${path.sep}`) || !filePath.endsWith('.tsx')) {
      throw new Error(`Invalid carousel file: ${parsed.file}`)
    }

    let source: string
    try {
      source = await readFile(filePath, 'utf8')
    } catch {
      throw new Error(`File not found: ${parsed.file}`)
    }

    const result = insertCarouselComment(source, {
      line: parsed.line,
      column: parsed.column,
      note: data.text,
      page: data.page,
    })
    if (!result.ok) throw new Error(result.error)

    const tmp = `${filePath}.tmp`
    await writeFile(tmp, result.source, 'utf8')
    await rename(tmp, filePath)

    return { ok: true as const, id: result.id, line: result.line, file: parsed.file }
  })
