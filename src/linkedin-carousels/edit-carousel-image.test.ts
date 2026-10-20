import { describe, expect, it } from 'vite-plus/test'

import { applyCarouselImageSwap, importUrl } from './edit-carousel-image'

const FILE = 'src/linkedin-carousels/carousels/x/index.tsx'
const DIR_URL = '/src/linkedin-carousels/carousels/x'

function positionOf(source: string, needle: string): string {
  const index = source.indexOf(needle)
  if (index < 0) throw new Error(`needle not found: ${needle}`)
  const before = source.slice(0, index)
  const lastNl = before.lastIndexOf('\n')
  return `${before.split('\n').length}:${lastNl < 0 ? index : index - lastNl - 1}`
}

describe('importUrl', () => {
  it('maps relative, @/ and @assets specifiers to dev URL paths', () => {
    expect(importUrl('./assets/a.jpg', FILE)).toBe(`${DIR_URL}/assets/a.jpg`)
    expect(importUrl('../shared/b.png', FILE)).toBe(
      '/src/linkedin-carousels/carousels/shared/b.png',
    )
    expect(importUrl('@/brand/c.svg', FILE)).toBe('/src/brand/c.svg')
    expect(importUrl('@assets/d.webp', FILE)).toBe('/assets/d.webp')
    expect(importUrl('some-package/e.png', FILE)).toBeNull()
  })
})

describe('applyCarouselImageSwap', () => {
  it('swaps a direct <img src={x}> and replaces its now-unused import in place', () => {
    const source = `import hero from './assets/hero.jpg'
import { cn } from '@/lib/utils'

export const Cover = () => <img src={hero} alt="" className={cn('a')} />
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: `${DIR_URL}/assets/hero.jpg`,
      assetName: 'team-photo.jpg',
    })
    expect(result).toEqual({
      ok: true,
      replaced: 1,
      source: `import teamPhoto from '@assets/team-photo.jpg'
import { cn } from '@/lib/utils'

export const Cover = () => <img src={teamPhoto} alt="" className={cn('a')} />
`,
    })
  })

  it('swaps only the clicked site when the import is used elsewhere too', () => {
    const source = `import hero from './assets/hero.jpg'

export const A = () => <img src={hero} alt="" />
export const B = () => <img src={hero} alt="b" />
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img src={hero} alt="b"'),
      src: `${DIR_URL}/assets/hero.jpg`,
      assetName: 'logo.svg',
    })
    expect(result).toEqual({
      ok: true,
      replaced: 1,
      source: `import hero from './assets/hero.jpg'
import logo from '@assets/logo.svg'

export const A = () => <img src={hero} alt="" />
export const B = () => <img src={logo} alt="b" />
`,
    })
  })

  it('traces an image drawn through a helper by its URL and swaps every usage', () => {
    const source = `import dubai from './assets/dubai.jpg'

function Photo({ src }: { src: string }) {
  return <img src={src} alt="" />
}

export const A = () => <Photo src={dubai} />
export const B = () => <Photo src={dubai} />
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: `${DIR_URL}/assets/dubai.jpg?t=123`,
      assetName: 'skyline.jpg',
    })
    expect(result.ok && result.replaced).toBe(2)
    expect(result.ok && result.source).toBe(`import skyline from '@assets/skyline.jpg'

function Photo({ src }: { src: string }) {
  return <img src={src} alt="" />
}

export const A = () => <Photo src={skyline} />
export const B = () => <Photo src={skyline} />
`)
  })

  it('expands shorthand properties in a mapped logo array', () => {
    const source = `import gmail from './assets/logos/gmail.svg'

const LOGOS = [{ label: 'Email', gmail }, { label: 'x', logo: gmail.toString() }]
export const A = () => LOGOS.map((l) => <img key={l.label} src={l.gmail} alt="" />)
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: `${DIR_URL}/assets/logos/gmail.svg`,
      assetName: 'outlook.svg',
    })
    expect(result.ok && result.source).toBe(`import outlook from '@assets/outlook.svg'

const LOGOS = [{ label: 'Email', gmail: outlook }, { label: 'x', logo: outlook.toString() }]
export const A = () => LOGOS.map((l) => <img key={l.label} src={l.gmail} alt="" />)
`)
  })

  it('reuses an existing import of the asset and drops the old one', () => {
    const source = `import hero from './assets/hero.jpg'
import brand from '@assets/brand.png'

export const A = () => <img src={hero} alt="" />
export const B = () => <img src={brand} alt="" />
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img src={hero}'),
      src: `${DIR_URL}/assets/hero.jpg`,
      assetName: 'brand.png',
    })
    expect(result.ok && result.source).toBe(`import brand from '@assets/brand.png'

export const A = () => <img src={brand} alt="" />
export const B = () => <img src={brand} alt="" />
`)
  })

  it('picks a fresh identifier when the asset name collides', () => {
    const source = `import hero from './assets/hero.jpg'

const logo = 'text'
export const A = () => <img src={hero} alt={logo} />
`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: '',
      assetName: 'logo.png',
    })
    expect(result.ok && result.source).toContain(`import logo2 from '@assets/logo.png'`)
    expect(result.ok && result.source).toContain('<img src={logo2} alt={logo} />')
  })

  it('is a no-op when the image already uses the asset', () => {
    const source = `import brand from '@assets/brand.png'\n\nexport const A = () => <img src={brand} alt="" />\n`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: '/assets/brand.png',
      assetName: 'brand.png',
    })
    expect(result).toEqual({ ok: true, source, replaced: 0 })
  })

  it('errors when the image cannot be traced to an import', () => {
    const source = `export const A = ({ url }: { url: string }) => <img src={url} alt="" />\n`
    const result = applyCarouselImageSwap(source, {
      file: FILE,
      position: positionOf(source, '<img'),
      src: 'https://example.com/a.png',
      assetName: 'a.png',
    })
    expect(result.ok).toBe(false)
  })
})
