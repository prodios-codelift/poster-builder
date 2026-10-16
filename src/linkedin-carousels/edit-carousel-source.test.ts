import { describe, expect, it } from 'vite-plus/test'

import { applyCarouselTextEdits, parseCarouselSource } from './edit-carousel-source'

function locOf(source: string, needle: string): { line: number; column: number } {
  const index = source.indexOf(needle)
  if (index < 0) throw new Error(`needle not found: ${needle}`)
  const before = source.slice(0, index)
  const line = before.split('\n').length
  const lastNl = before.lastIndexOf('\n')
  const column = lastNl < 0 ? index : index - lastNl - 1
  return { line, column }
}

describe('applyCarouselTextEdits', () => {
  it('replaces JSX text children', () => {
    const source = `function Cover() {
  return (
    <Frame>
      <Hero>Your next deal is in an unread DM</Hero>
    </Frame>
  )
}
`
    const loc = locOf(source, '<Hero>')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: 'Your next deal is in an unread DM',
        nextText: 'Your next deal is in WhatsApp',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('<Hero>Your next deal is in WhatsApp</Hero>')
    expect(parseCarouselSource(result.source)).not.toBeNull()
  })

  it('replaces a string prop', () => {
    const source = `function Channels() {
  return <Point n="1">WhatsApp, day and night</Point>
}
`
    const loc = locOf(source, '<Point')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: '1',
        nextText: '01',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('n="01"')
  })

  it('replaces a string inside an array prop', () => {
    const source = `function TheCost() {
  return (
    <CompareColumn
      kind="dont"
      items={['Make them repeat', 'Chase leads from memory', 'Leave leads unowned']}
    />
  )
}
`
    const loc = locOf(source, '<CompareColumn')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: 'Make them repeat',
        nextText: 'Make customers repeat themselves',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain("'Make customers repeat themselves'")
    expect(result.source).toContain("'Chase leads from memory'")
  })

  it('replaces a string literal in a JSX expression', () => {
    const source = `function Label({ kind }: { kind: 'do' | 'dont' }) {
  return <p>{kind === 'do' ? 'Do' : "Don't"}</p>
}
`
    const loc = locOf(source, '<p>')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: "Don't",
        nextText: 'Avoid',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('"Avoid"')
    expect(result.source).toContain("'Do'")
  })

  it('rejects expressions that are not string literals', () => {
    const source = `function Footer({ page }: { page: number }) {
  return <p>{page}</p>
}
`
    const loc = locOf(source, '<p>')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: '3',
        nextText: '4',
      },
    ])
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/unique string literal/)
  })

  it('wraps JSX text containing special characters as an expression', () => {
    const source = `function Cover() {
  return <Hero>Plain title</Hero>
}
`
    const loc = locOf(source, '<Hero>')
    const result = applyCarouselTextEdits(source, [
      {
        locations: [loc],
        prevText: 'Plain title',
        nextText: 'Growth < scale',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain("{'Growth < scale'}")
  })
})
