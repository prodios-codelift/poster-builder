import { describe, expect, it } from 'vite-plus/test'

import {
  b64urlDecode,
  b64urlEncode,
  insertCarouselComment,
  isCommentableFile,
  parseTsdSource,
  SLIDE_COMMENT_MARKER_RE,
} from './carousel-comments'

function positionOf(source: string, needle: string): { line: number; column: number } {
  const index = source.indexOf(needle)
  if (index < 0) throw new Error(`needle not found: ${needle}`)
  const before = source.slice(0, index)
  const line = before.split('\n').length
  const lastNl = before.lastIndexOf('\n')
  return { line, column: lastNl < 0 ? index : index - lastNl - 1 }
}

describe('b64urlEncode / b64urlDecode', () => {
  it('round-trips JSON payloads', () => {
    const payload = JSON.stringify({ note: 'make this red', page: 2 })
    expect(JSON.parse(b64urlDecode(b64urlEncode(payload)))).toEqual({
      note: 'make this red',
      page: 2,
    })
  })

  it('uses URL-safe alphabet without padding', () => {
    const encoded = b64urlEncode(JSON.stringify({ note: '>>??' }))
    expect(encoded).not.toMatch(/[+/=]/)
  })
})

describe('parseTsdSource', () => {
  it('parses a leading-slash path and converts 1-based column to 0-based', () => {
    expect(parseTsdSource('/src/linkedin-carousels/carousels/x/index.tsx:120:5')).toEqual({
      file: 'src/linkedin-carousels/carousels/x/index.tsx',
      line: 120,
      column: 4,
    })
  })

  it('accepts paths without a leading slash', () => {
    expect(parseTsdSource('src/linkedin-carousels/themes/noir-luxe/index.tsx:1:1')).toEqual({
      file: 'src/linkedin-carousels/themes/noir-luxe/index.tsx',
      line: 1,
      column: 0,
    })
  })

  it('rejects malformed values', () => {
    expect(parseTsdSource('no-colons')).toBeNull()
    expect(parseTsdSource('file.tsx:0:1')).toBeNull()
  })
})

describe('isCommentableFile', () => {
  it('allows carousel and theme tsx files', () => {
    expect(isCommentableFile('src/linkedin-carousels/carousels/x/index.tsx')).toBe(true)
    expect(isCommentableFile('/src/linkedin-carousels/themes/noir-luxe/index.tsx')).toBe(true)
  })

  it('rejects studio chrome and non-tsx paths', () => {
    expect(isCommentableFile('src/routes/linkedin-carousel/index.tsx')).toBe(false)
    expect(isCommentableFile('src/linkedin-carousels/registry.ts')).toBe(false)
    expect(isCommentableFile('src/linkedin-carousels/carousels/../registry.ts')).toBe(false)
  })
})

describe('insertCarouselComment', () => {
  const source = `function Cover() {
  return (
    <Frame>
      <Hero>Headline</Hero>
      <Inbox />
    </Frame>
  )
}
`

  it('inserts the marker as the first child of the clicked element', () => {
    const pos = positionOf(source, '<Hero>')
    const result = insertCarouselComment(source, {
      ...pos,
      note: 'make this bigger',
      page: 0,
      id: 'c-abcdef01',
      ts: '2026-10-17T00:00:00.000Z',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(
      '      <Hero>\n' +
        '        {/* @slide-comment id="c-abcdef01" ts="2026-10-17T00:00:00.000Z" text="',
    )
    expect(result.source).toContain('Headline</Hero>')

    const match = [...result.source.matchAll(SLIDE_COMMENT_MARKER_RE)][0]
    expect(match).toBeDefined()
    expect(match[1]).toBe('c-abcdef01')
    expect(JSON.parse(b64urlDecode(match[3]))).toEqual({ note: 'make this bigger', page: 0 })
  })

  it('hoists self-closing elements to the nearest container', () => {
    const pos = positionOf(source, '<Inbox />')
    const result = insertCarouselComment(source, {
      ...pos,
      note: 'swap icon',
      id: 'c-deadbeef',
      ts: '2026-10-17T00:00:00.000Z',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    // Marker lands inside <Frame>, before its children.
    expect(result.source).toMatch(/<Frame>\n\s+\{\/\* @slide-comment id="c-deadbeef"/)
    expect(result.source).toContain('<Inbox />')
  })

  it('rejects empty notes', () => {
    const pos = positionOf(source, '<Hero>')
    expect(insertCarouselComment(source, { ...pos, note: '   ' })).toEqual({
      ok: false,
      error: 'comment text is empty',
    })
  })
})
