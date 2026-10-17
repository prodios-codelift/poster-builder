import { describe, expect, it } from 'vite-plus/test'

import { applyCarouselTextEdits } from './edit-carousel-source'

const FILE = 'src/linkedin-carousels/carousels/x/index.tsx'

function positionOf(source: string, needle: string): string {
  const index = source.indexOf(needle)
  if (index < 0) throw new Error(`needle not found: ${needle}`)
  const before = source.slice(0, index)
  const line = before.split('\n').length
  const lastNl = before.lastIndexOf('\n')
  return `${line}:${lastNl < 0 ? index : index - lastNl - 1}`
}

function edit(source: string, anchor: string, prevText: string, nextText: string) {
  return { file: FILE, position: positionOf(source, anchor), prevText, nextText }
}

describe('applyCarouselTextEdits', () => {
  const source = `function Cover() {
  return (
    <Frame>
      <Hero>Your next deal is in an unread DM</Hero>
      <Body>
        Same words
      </Body>
      <Body>Same words</Body>
    </Frame>
  )
}
`

  it('replaces the JSX text at the exact position', () => {
    const result = applyCarouselTextEdits(source, [
      edit(source, '<Hero>', 'Your next deal is in an unread DM', 'Fresh headline'),
    ])
    expect(result).toEqual({
      ok: true,
      source: source.replace('Your next deal is in an unread DM', 'Fresh headline'),
    })
  })

  it('only edits the clicked occurrence of duplicated text', () => {
    const result = applyCarouselTextEdits(source, [
      edit(source, '<Body>Same words', 'Same words', 'Changed'),
    ])
    expect(result.ok && result.source).toContain('<Body>Changed</Body>')
    expect(result.ok && result.source).toContain('        Same words\n')
  })

  it('keeps indentation of multi-line text', () => {
    const result = applyCarouselTextEdits(source, [
      edit(source, '<Body>\n', 'Same words', 'Different'),
    ])
    expect(result.ok && result.source).toContain('\n        Different\n      </Body>')
  })

  it('wraps text that is unsafe as raw JSX', () => {
    const result = applyCarouselTextEdits(source, [
      edit(source, '<Hero>', 'Your next deal is in an unread DM', "a {b} <c> it's"),
    ])
    expect(result.ok && result.source).toContain("<Hero>{'a {b} <c> it\\'s'}</Hero>")
  })

  it('applies several edits in one file', () => {
    const result = applyCarouselTextEdits(source, [
      edit(source, '<Hero>', 'Your next deal is in an unread DM', 'One'),
      edit(source, '<Body>Same words', 'Same words', 'Two'),
    ])
    expect(result.ok && result.source).toContain('<Hero>One</Hero>')
    expect(result.ok && result.source).toContain('<Body>Two</Body>')
  })

  it('rejects when the text no longer matches', () => {
    const result = applyCarouselTextEdits(source, [edit(source, '<Hero>', 'something else', 'x')])
    expect(result.ok).toBe(false)
  })

  it('rejects an element that is not a single text element', () => {
    const result = applyCarouselTextEdits(source, [edit(source, '<Frame>', 'x', 'y')])
    expect(result.ok).toBe(false)
  })

  it('rejects a position with no element', () => {
    const result = applyCarouselTextEdits(source, [
      { file: FILE, position: '1:0', prevText: 'a', nextText: 'b' },
    ])
    expect(result.ok).toBe(false)
  })
})
