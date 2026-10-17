import { readFileSync, readdirSync } from 'node:fs'

import { parse } from '@babel/parser'
import { describe, expect, it } from 'vite-plus/test'

import { markSlideSource } from './vite-plugin-slide-source'

const FILE = 'src/linkedin-carousels/carousels/x/index.tsx'

function parses(code: string): boolean {
  try {
    parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'] })
    return true
  } catch {
    return false
  }
}

const FORWARDING_TITLE = `function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return <h2 className="a" {...slide}>{children}</h2>
}
`

describe('markSlideSource', () => {
  it('tags host text elements directly without wrapping', () => {
    const out = markSlideSource(`const a = (\n  <h1>Hello</h1>\n)\n`, FILE)!.code
    expect(out).toContain(
      `<h1 data-slide-file="${FILE}" data-slide-position="2:2" data-slide-element-type="text">Hello</h1>`,
    )
    expect(out).not.toContain('<span')
  })

  it('tags the call site of a component that forwards slide props', () => {
    const src = `${FORWARDING_TITLE}const a = <Title>Hi</Title>\n`
    const result = markSlideSource(src, FILE)!
    expect(result.warnings).toEqual([])
    expect(result.code).toContain('<Title data-slide-file')
    expect(result.code).toContain('data-slide-position="4:10"')
    // The component definition is never rewritten.
    expect(result.code).toContain(FORWARDING_TITLE)
  })

  it('warns, and does not tag, text components that do not forward', () => {
    const src = `function Body({ children }) {\n  return <p>{children}</p>\n}\nconst a = <Body>x</Body>\n`
    const result = markSlideSource(src, FILE)!
    expect(result.code).toBe(src)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]).toContain('<Body>')
  })

  it('does not treat a rest that is never spread as forwarding', () => {
    const src = `function Body({ children, ...rest }) {\n  return <p>{children}</p>\n}\nconst a = <Body>x</Body>\n`
    expect(markSlideSource(src, FILE)!.warnings).toHaveLength(1)
  })

  it('skips expression children, nested elements and svg', () => {
    const src = `const a = (\n  <div>\n    <p>{x}</p>\n    <p>a <b>{y}</b></p>\n    <svg><text>Hi</text></svg>\n  </div>\n)\n`
    expect(markSlideSource(src, FILE)).toBeNull()
  })

  it('tags img and imported icons', () => {
    const src = `import { Inbox } from 'lucide-react'\nconst a = <div><img src={s} /><Inbox size={4} /></div>\n`
    const out = markSlideSource(src, FILE)!.code
    expect(out).toContain('<img data-slide-file')
    expect(out).toContain('data-slide-element-type="image"')
    expect(out).toContain('<Inbox data-slide-file')
    expect(out).toContain('data-slide-element-type="icon"')
  })

  it('keeps line numbers unchanged', () => {
    const src = `${FORWARDING_TITLE}const a = (\n  <Title>\n    Hi\n  </Title>\n)\n`
    const out = markSlideSource(src, FILE)!.code
    expect(out.split('\n')).toHaveLength(src.split('\n').length)
  })

  it('produces parseable output with no warnings for every real carousel file', () => {
    const dir = new URL('./carousels/', import.meta.url)
    for (const name of readdirSync(dir)) {
      let code: string
      try {
        code = readFileSync(new URL(`${name}/index.tsx`, dir), 'utf8')
      } catch {
        continue
      }
      const result = markSlideSource(code, `carousels/${name}/index.tsx`)
      expect(result?.warnings ?? [], name).toEqual([])
      if (result) expect(parses(result.code), name).toBe(true)
    }
  })

  it('has no warnings for any theme demo', () => {
    const dir = new URL('./themes/', import.meta.url)
    for (const name of readdirSync(dir)) {
      let code: string
      try {
        code = readFileSync(new URL(`${name}/index.tsx`, dir), 'utf8')
      } catch {
        continue
      }
      expect(markSlideSource(code, `themes/${name}/index.tsx`)?.warnings ?? [], name).toEqual([])
    }
  })
})
