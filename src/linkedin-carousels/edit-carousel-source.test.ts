import { describe, expect, it } from 'vite-plus/test'

import {
  applyCarouselTextEdits,
  findEditableCarouselText,
  parseCarouselSource,
} from './edit-carousel-source'

function locOf(source: string, needle: string, nth = 1): { line: number; column: number } {
  let index = -1
  for (let i = 0; i < nth; i++) index = source.indexOf(needle, index + 1)
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

  it('edits the plain part of a heading with a highlighted word', () => {
    const source = `function Cover() {
  return (
    <h1>
      Say it big. Say it <mark>once.</mark>
    </h1>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<h1>')],
        prevText: 'Say it big. Say it once.',
        nextText: 'Say it small. Say it once.',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('      Say it small. Say it <mark>once.</mark>\n')
  })

  it('edits the highlighted word of a heading', () => {
    const source = `function Cover() {
  return (
    <h1>
      Say it big. Say it <mark>once.</mark>
    </h1>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<h1>')],
        prevText: 'Say it big. Say it once.',
        nextText: 'Say it big. Say it twice.',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('Say it big. Say it <mark>twice.</mark>')
  })

  it('keeps the highlight when the plain part and the highlighted words both change', () => {
    const source = `function Brief() {
  return <h2>A buyer describes <mark>a life.</mark></h2>
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<h2>')],
        prevText: 'A buyer describes a life.',
        nextText: 'A client describes a life together.',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('<h2>A client describes <mark>a life together.</mark></h2>')
  })

  it('writes line breaks as <br />', () => {
    const source = `function Cover() {
  return <h1>Say it big. Say it once.</h1>
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<h1>')],
        prevText: 'Say it big. Say it once.',
        nextText: 'Say it big.\nSay it once.',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain('<h1>Say it big.<br />Say it once.</h1>')
  })

  it('keeps multi-line JSX text layout when editing one word', () => {
    const source = `function Brief() {
  return (
    <Body>
      Area. Budget. Bedrooms. Move-in date. The details arrive in conversation, not a perfect
      form.
    </Body>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<Body>')],
        prevText:
          'Area. Budget. Bedrooms. Move-in date. The details arrive in conversation, not a perfect form.',
        nextText:
          'Area. Budget. Bedrooms. Move-in date. The details arrive in chat, not a perfect form.',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(
      '      Area. Budget. Bedrooms. Move-in date. The details arrive in chat, not a perfect\n      form.\n',
    )
  })

  it('edits the call site a children-passthrough component was rendered from', () => {
    const source = `function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="uppercase">{children}</p>
}

function Cover() {
  return (
    <div>
      <Eyebrow>The moment</Eyebrow>
    </div>
  )
}

function Brief() {
  return (
    <div>
      <Eyebrow>The moment</Eyebrow>
    </div>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [
          locOf(source, '<p className'),
          locOf(source, '<Eyebrow>', 2),
          locOf(source, '<div>', 2),
        ],
        prevText: 'The moment',
        nextText: 'The brief',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(
      'function Cover() {\n  return (\n    <div>\n      <Eyebrow>The moment</Eyebrow>',
    )
    expect(result.source).toContain(
      'function Brief() {\n  return (\n    <div>\n      <Eyebrow>The brief</Eyebrow>',
    )
  })

  it('edits a field of a module-level const object', () => {
    const source = `const AUTHOR = { name: 'Prodios Labs', handle: '@prodioslabs' }

function AuthorCard() {
  return (
    <div>
      <p className="name">{AUTHOR.name}</p>
      <p>{AUTHOR.handle}</p>
    </div>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<p className="name"'), locOf(source, '<div>')],
        prevText: 'Prodios Labs',
        nextText: 'Prodios',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain("const AUTHOR = { name: 'Prodios', handle: '@prodioslabs' }")
  })

  it('edits a module-level const array item rendered through .map and a spread', () => {
    const source = `const CHANNELS = [
  { label: 'WhatsApp', logo: 'wa.svg' },
  { label: 'Email', logo: 'mail.svg' },
]

function ChannelTile({ label }: { label: string }) {
  return (
    <div className="tile">
      <p>{label}</p>
    </div>
  )
}

function MergeDiagram() {
  return (
    <div className="grid">
      {CHANNELS.map((channel) => (
        <ChannelTile key={channel.label} {...channel} />
      ))}
    </div>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [
          locOf(source, '<p>'),
          locOf(source, '<div className="tile"'),
          locOf(source, '<ChannelTile key'),
          locOf(source, '<div className="grid"'),
        ],
        prevText: 'WhatsApp',
        nextText: 'WhatsApp Business',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain("{ label: 'WhatsApp Business', logo: 'wa.svg' }")
  })

  it('keeps a JSX attribute valid when the new value has both quote styles', () => {
    const source = `function Channels() {
  return <Point label="Plain">Text</Point>
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<Point')],
        prevText: 'Plain',
        nextText: `It's "big"`,
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(`label={'It\\'s "big"'}`)
  })

  it('edits text that sits next to an icon component', () => {
    const source = `function SwipeCue() {
  return (
    <p className="flex items-center">
      Swipe
      <ArrowRight className="icon" strokeWidth={3} />
    </p>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<p className')],
        prevText: 'Swipe',
        nextText: 'Keep swiping',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(
      '      Keep swiping\n      <ArrowRight className="icon" strokeWidth={3} />',
    )
  })

  it('edits a ternary label rendered after an icon', () => {
    const source = `function CompareColumn({ kind }: { kind: 'do' | 'dont' }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <p className="uppercase">
      <Icon className="icon" />
      {kind === 'do' ? 'Do' : "Don't"}
    </p>
  )
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<p className')],
        prevText: "Don't",
        nextText: 'Avoid',
      },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.source).toContain(`{kind === 'do' ? 'Do' : "Avoid"}`)
    expect(result.source).toContain(`const Icon = kind === 'do' ? Check : X`)
  })

  it('does not treat comparison operands as copy', () => {
    const source = `function Label({ kind }: { kind: 'do' | 'dont' }) {
  return <p>{kind === 'do' ? 'Yes' : 'No'}</p>
}
`
    const result = applyCarouselTextEdits(source, [
      {
        locations: [locOf(source, '<p>')],
        prevText: 'do',
        nextText: 'done',
      },
    ])
    expect(result.ok).toBe(false)
  })
})

describe('findEditableCarouselText', () => {
  it('accepts literal text and rejects text computed in code', () => {
    const source = `function Footer({ page }: { page: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div>
      <span>Prodios Labs</span>
      <span>{pad(page)} / 08</span>
    </div>
  )
}
`
    const editable = findEditableCarouselText(source, [
      { locations: [locOf(source, '<span>'), locOf(source, '<div>')], text: 'Prodios Labs' },
      { locations: [locOf(source, '<span>', 2), locOf(source, '<div>')], text: '01 / 08' },
    ])
    expect(editable).toEqual([true, false])
  })
})
