import { describe, expect, it } from 'vite-plus/test'

import {
  type AssetEntry,
  assetIdentifier,
  assetKind,
  filterAssets,
  findAssetReferences,
  mimeForFilename,
  normalizeAssetName,
  renamedCopy,
  rewriteAssetReferences,
  validateAssetName,
} from './asset-files'

describe('validateAssetName', () => {
  it('accepts flat names with an extension', () => {
    expect(validateAssetName('logo.svg')).toBe('logo.svg')
    expect(validateAssetName('  Team photo (1).jpg ')).toBe('Team photo (1).jpg')
    expect(validateAssetName('café.png')).toBe('café.png')
  })

  it('rejects paths, hidden files, missing extensions and unsafe characters', () => {
    for (const bad of [
      '',
      'logo',
      'logo.',
      '.env',
      '~x.png',
      '../x.png',
      'a/b.png',
      'a\\b.png',
      "it's.png",
      'a#b.png',
      'a%20b.png',
      'a\u0000b.png',
      `${'a'.repeat(121)}.png`,
      42,
    ]) {
      expect(validateAssetName(bad), String(bad)).toBeNull()
    }
  })
})

describe('names and types', () => {
  it('lowercases only the extension', () => {
    expect(normalizeAssetName(' Photo.JPG ')).toBe('Photo.jpg')
    expect(normalizeAssetName('logo.svg')).toBe('logo.svg')
  })

  it('maps extensions to MIME types and kinds', () => {
    expect(mimeForFilename('a.JPG')).toBe('image/jpeg')
    expect(mimeForFilename('a.woff2')).toBe('font/woff2')
    expect(mimeForFilename('a.zip')).toBe('application/octet-stream')
    expect(assetKind('image/svg+xml')).toBe('image')
    expect(assetKind('font/ttf')).toBe('font')
    expect(assetKind('video/mp4')).toBe('video')
    expect(assetKind('application/json')).toBe('other')
  })

  it('finds the first free copy name, case-insensitively', () => {
    expect(renamedCopy('logo.svg', ['logo.svg'])).toBe('logo-1.svg')
    expect(renamedCopy('logo.svg', ['logo.svg', 'LOGO-1.svg'])).toBe('logo-2.svg')
    expect(renamedCopy('logo-1.svg', ['logo-1.svg'])).toBe('logo-2.svg')
  })

  it('builds camelCase import identifiers that avoid collisions', () => {
    expect(assetIdentifier('acme-logo.svg')).toBe('acmeLogo')
    expect(assetIdentifier('Team photo (1).jpg')).toBe('teamPhoto1')
    expect(assetIdentifier('ACME.png')).toBe('acme')
    expect(assetIdentifier('2024-hero.png')).toBe('asset2024Hero')
    expect(assetIdentifier('default.png')).toBe('defaultAsset')
    expect(assetIdentifier('日本.png')).toBe('asset')
    expect(assetIdentifier('logo.png', new Set(['logo', 'logo2']))).toBe('logo3')
  })
})

describe('asset references', () => {
  const code = `import logo from '@assets/logo.svg'
import other from "@assets/team photo.jpg"
import again from '@assets/logo.svg'
import local from './assets/logo.svg'
`

  it('counts quoted @assets specifiers', () => {
    expect(findAssetReferences(code)).toEqual(
      new Map([
        ['logo.svg', 2],
        ['team photo.jpg', 1],
      ]),
    )
  })

  it('rewrites every specifier for one asset and keeps the quote style', () => {
    expect(rewriteAssetReferences(code, 'team photo.jpg', 'team.jpg')).toBe(
      code.replace('"@assets/team photo.jpg"', '"@assets/team.jpg"'),
    )
    expect(
      rewriteAssetReferences(code, 'logo.svg', 'brand.svg')?.match(/@assets\/brand\.svg/g),
    ).toHaveLength(2)
    expect(rewriteAssetReferences(code, 'log.svg', 'x.svg')).toBeNull()
    // `.` is literal, not a regex wildcard.
    expect(rewriteAssetReferences(`'@assets/logoxsvg'`, 'logo.svg', 'x.svg')).toBeNull()
  })
})

describe('filterAssets', () => {
  const entry = (name: string, extra: Partial<AssetEntry> = {}): AssetEntry => ({
    name,
    size: 1,
    mtime: 1,
    mime: mimeForFilename(name),
    kind: assetKind(mimeForFilename(name)),
    url: '',
    importPath: `@assets/${name}`,
    usages: [],
    ...extra,
  })
  const assets = [
    entry('logo-10.svg', { size: 30, mtime: 3 }),
    entry('logo-2.svg', { size: 10, mtime: 1, usages: [{ file: 'src/a.tsx', count: 1 }] }),
    entry('Inter.ttf', { size: 20, mtime: 2 }),
  ]
  const names = (list: AssetEntry[]) => list.map((a) => a.name)

  it('sorts names naturally', () => {
    expect(names(filterAssets(assets, {}))).toEqual(['Inter.ttf', 'logo-2.svg', 'logo-10.svg'])
  })

  it('filters by query, kind and usage', () => {
    expect(names(filterAssets(assets, { query: 'LOGO' }))).toEqual(['logo-2.svg', 'logo-10.svg'])
    expect(names(filterAssets(assets, { kind: 'font' }))).toEqual(['Inter.ttf'])
    expect(names(filterAssets(assets, { usage: 'used' }))).toEqual(['logo-2.svg'])
    expect(names(filterAssets(assets, { usage: 'unused' }))).toEqual(['Inter.ttf', 'logo-10.svg'])
  })

  it('sorts by modified date and size', () => {
    expect(names(filterAssets(assets, {}, { key: 'modified', direction: 'desc' }))).toEqual([
      'logo-10.svg',
      'Inter.ttf',
      'logo-2.svg',
    ])
    expect(names(filterAssets(assets, {}, { key: 'size', direction: 'asc' }))).toEqual([
      'logo-2.svg',
      'Inter.ttf',
      'logo-10.svg',
    ])
  })
})
