import { createServerFn } from '@tanstack/react-start'

import {
  COMMENT_ID_RE,
  insertCarouselComment,
  isCommentableFile,
  parseMarkers,
  parseTsdSource,
  removeMarker,
  resolveTargets,
  updateMarkerNote,
} from './carousel-comments'

type AddCarouselCommentInput = {
  /** Raw `data-tsd-source` attribute value. */
  source: string
  text: string
  /** 0-based slide index open in the studio. */
  page?: number
}

type CommentFileInput = { file: string }
type UpdateCarouselCommentInput = { file: string; id: string; text: string }
type RemoveCarouselCommentInput = { file: string; id: string }

function asRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid comment payload')
  }
  return data as Record<string, unknown>
}

function requireFile(body: Record<string, unknown>): string {
  if (typeof body.file !== 'string' || !isCommentableFile(body.file)) {
    throw new Error(`Invalid carousel file: ${String(body.file)}`)
  }
  return body.file.replace(/^\//, '')
}

function requireId(body: Record<string, unknown>): string {
  if (typeof body.id !== 'string' || !COMMENT_ID_RE.test(body.id)) {
    throw new Error('Invalid comment id')
  }
  return body.id
}

function requireText(body: Record<string, unknown>): string {
  if (typeof body.text !== 'string' || !body.text.trim()) {
    throw new Error('Missing comment text')
  }
  return body.text.trim()
}

function validateInput(data: unknown): AddCarouselCommentInput {
  const body = asRecord(data)
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
 * Dev-only access to a commentable carousel / theme file. Writes go through a
 * temp file + rename so Vite never reloads a half-written module.
 */
async function openCommentFile(file: string) {
  if (!import.meta.env.DEV) {
    throw new Error('Slide comments are only available in development')
  }
  if (!isCommentableFile(file)) {
    throw new Error(`Comments are only allowed on carousels and themes: ${file}`)
  }

  const [{ readFile, writeFile, rename }, path] = await Promise.all([
    import('node:fs/promises'),
    import('node:path'),
  ])

  const carouselsRoot = path.resolve(process.cwd(), 'src/linkedin-carousels')
  const filePath = path.resolve(process.cwd(), file)
  if (!filePath.startsWith(`${carouselsRoot}${path.sep}`) || !filePath.endsWith('.tsx')) {
    throw new Error(`Invalid carousel file: ${file}`)
  }

  return {
    async read(): Promise<string | null> {
      try {
        return await readFile(filePath, 'utf8')
      } catch {
        return null
      }
    },
    async write(source: string): Promise<void> {
      const tmp = `${filePath}.tmp`
      await writeFile(tmp, source, 'utf8')
      await rename(tmp, filePath)
    },
  }
}

/**
 * Dev-only: insert a `@slide-comment` marker into a carousel or theme source
 * file at the JSX location named by `data-tsd-source`.
 */
export const addCarouselComment = createServerFn({ method: 'POST' })
  .validator(validateInput)
  .handler(async ({ data }) => {
    const parsed = parseTsdSource(data.source)
    if (!parsed) {
      throw new Error(`Invalid data-tsd-source: ${data.source}`)
    }

    const handle = await openCommentFile(parsed.file)
    const source = await handle.read()
    if (source === null) throw new Error(`File not found: ${parsed.file}`)

    const result = insertCarouselComment(source, {
      line: parsed.line,
      column: parsed.column,
      note: data.text,
      page: data.page,
    })
    if (!result.ok) throw new Error(result.error)

    await handle.write(result.source)
    return { ok: true as const, id: result.id, line: result.line, file: parsed.file }
  })

/** Dev-only: every pending `@slide-comment` marker in a file, with its target element. */
export const listCarouselComments = createServerFn({ method: 'GET' })
  .validator((data: unknown): CommentFileInput => ({ file: requireFile(asRecord(data)) }))
  .handler(async ({ data }) => {
    const source = await (await openCommentFile(data.file)).read()
    if (source === null) return []
    return resolveTargets(source, parseMarkers(source))
  })

/** Dev-only: replace the note of an existing marker. */
export const updateCarouselComment = createServerFn({ method: 'POST' })
  .validator((data: unknown): UpdateCarouselCommentInput => {
    const body = asRecord(data)
    return { file: requireFile(body), id: requireId(body), text: requireText(body) }
  })
  .handler(async ({ data }) => {
    const handle = await openCommentFile(data.file)
    const source = await handle.read()
    if (source === null) throw new Error(`File not found: ${data.file}`)
    const next = updateMarkerNote(source, data.id, data.text)
    if (next === null) throw new Error('Comment not found — it may already have been applied')
    await handle.write(next)
    return { ok: true as const }
  })

/** Dev-only: delete a marker. */
export const removeCarouselComment = createServerFn({ method: 'POST' })
  .validator((data: unknown): RemoveCarouselCommentInput => {
    const body = asRecord(data)
    return { file: requireFile(body), id: requireId(body) }
  })
  .handler(async ({ data }) => {
    const handle = await openCommentFile(data.file)
    const source = await handle.read()
    if (source === null) throw new Error(`File not found: ${data.file}`)
    const next = removeMarker(source, data.id)
    if (next === null) throw new Error('Comment not found — it may already have been applied')
    await handle.write(next)
    return { ok: true as const }
  })
