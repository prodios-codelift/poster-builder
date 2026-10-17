---
name: Swiss Grid
description: International Typographic Style: off-white page, visible six-column hairline grid, heavy Inter Tight grotesk, one signal colour.
mode: light
---

# Swiss Grid

## Palette

Near-black on white with a faint grid. The signal colour points; it never decorates. Use it for the eyebrow square, the big section number, list markers and the swipe cue.

| Role   | Value                    | Notes                                                   |
| ------ | ------------------------ | ------------------------------------------------------- |
| bg     | `#FFFFFF`                | page, every slide                                       |
| fg     | `#111111`                | all type, list and author rules                         |
| accent | `#E4252B`                | eyebrow square, section number, list markers, swipe cue |
| muted  | `#5C5C5C`                | footer name and handle, author handle (≥ 5.5:1 on bg)   |
| grid   | `rgba(17, 17, 17, 0.07)` | six-column hairline overlay drawn by `Frame`            |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Signal Red** unless the user picks another or their brand fits one better.

### Signal Red (default)

Studio demo: `Theme · Swiss Grid · Signal Red` (`theme-swiss-grid--signal-red`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#E4252B',
  '--cx-muted': '#5C5C5C',
  '--cx-grid': 'rgba(17, 17, 17, 0.07)',
```

### Klein Blue

Studio demo: `Theme · Swiss Grid · Klein Blue` (`theme-swiss-grid--klein-blue`).

```tsx
  '--cx-bg': '#F4F4F0',
  '--cx-fg': '#0D0D0D',
  '--cx-accent': '#1F3FD1',
  '--cx-muted': '#57574F',
  '--cx-grid': 'rgba(13, 13, 13, 0.07)',
```

### Safety Orange

Studio demo: `Theme · Swiss Grid · Safety Orange` (`theme-swiss-grid--safety-orange`).

```tsx
  '--cx-bg': '#FAFAF7',
  '--cx-fg': '#121212',
  '--cx-accent': '#F0501A',
  '--cx-muted': '#5A5A55',
  '--cx-grid': 'rgba(18, 18, 18, 0.07)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#E4252B',
  '--cx-muted': '#5C5C5C',
  '--cx-grid': 'rgba(17, 17, 17, 0.07)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Inter Tight', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-[96px] right-[96px] grid grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="border-l border-(--cx-grid) last:border-r" />
          ))}
        </div>
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display and body: `'Inter Tight', system-ui, sans-serif` (weights 500, 700, 800 loaded). Headlines are 800 (`font-extrabold`) with very tight tracking; width factor ≈ 0.48.
- Type scale: hero 136 px / 0.98 / -0.045em (≈ 13 chars per line, ≤ 3 lines, ≤ 6 words); title 92 px / 1.0 / -0.04em (≈ 20 chars per line, ≤ 3 lines); section number 240 px / 0.85; body 40 px / 1.4, max width 740 px; list item 40 px / 1.3 / 600; eyebrow 26 px / 1.2 / 700, uppercase, 0.12em; footer 26 px / 1.3 / 600.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- `Frame` draws a six-column grid (148 px columns) behind the content. Align to it: list text and the footer's second column start at 148 px.
- Cover and CTA are **bottom-aligned** (`justify-end` with 48 px bottom padding) like a poster. Content slides are top-aligned and may open with a `SectionNumber`.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Lists are `Point` rows with a 3 px black top rule and a one-letter or number marker in the first grid column.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Caps only in the eyebrow; the footer is a three-column grid row.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer   | Source                                  |
| ----------- | -------------- | --------------------------------------- |
| `cover.jpg` | I P            | https://unsplash.com/photos/tKk7L7OIx40 |
| `split.jpg` | Matthew Feeney | https://unsplash.com/photos/or_QJKrX_IQ |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: the image is grayscale, then `bg` replaces the highlights (`mix-blend-multiply`) and `fg` replaces the shadows (`mix-blend-lighten`). Switching palette recolours the photo. Pick photos with clear light and dark areas; flat, dark photos turn into a solid block of colour. A crisp black-and-white print that stays neutral, so the signal colour still owns the slide.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (about 560–600 px tall) with the eyebrow and hero below it. Text never sits on the photo. The photo spans the full content width and aligns to the grid; no rounded corners or borders.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Grid3x3, type LucideIcon, Ruler, Square, Type, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes a dot grid to `Frame`: `className="bg-[radial-gradient(var(--cx-grid)_2px,transparent_2.5px)] bg-[size:36px_36px]"`. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Accent square plus uppercase label in ink.

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[20px]">
      <span className="size-[24px] shrink-0 bg-(--cx-accent)" />
      <p className="text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[136px] leading-[0.98] font-extrabold tracking-[-0.045em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[92px] leading-[1.0] font-extrabold tracking-[-0.04em]"
      {...slide}
    >
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="max-w-[740px] text-[40px] leading-[1.4] font-medium" {...slide}>
      {children}
    </p>
  )
}
```

### SectionNumber

Oversized accent number for the top of a content slide. One per slide; budget 204 px.

```tsx
function SectionNumber({ n }: { n: string }) {
  return (
    <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
      {n}
    </p>
  )
}
```

### Point (grid row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="grid grid-cols-[148px_1fr] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <span className="text-[36px] leading-[1.3] font-bold text-(--cx-accent) tabular-nums">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-semibold tracking-[-0.01em]" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">Swipe →</p>
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  return (
    <div className="flex flex-col gap-[8px] border-t-[3px] border-(--cx-fg) pt-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.05] font-extrabold tracking-[-0.03em]">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
    </div>
  )
}
```

### Footer

Page number sits in the first grid column.

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto grid grid-cols-[148px_1fr_auto] items-baseline text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
      <span className="font-bold text-(--cx-fg) tabular-nums">
        {pad(page)}/{pad(total)}
      </span>
      <span>{AUTHOR.name}</span>
      <span>{AUTHOR.handle}</span>
    </div>
  )
}
```

### Photo (tinted image)

Renders an imported asset in grayscale, recoloured by palette tokens, so it follows the active palette. Give it explicit pixel size through `className`.

```tsx
function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.2]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Pass any `lucide-react` icon as `icon`. Use four in a `grid grid-cols-2 gap-[24px]`, with labels of up to about 4 words.

```tsx
function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[44px] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <Icon className="size-[96px]" strokeWidth={2} />
      <p className="text-[44px] leading-[1.2] font-bold tracking-[-0.01em]" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker.

```tsx
function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[220px] leading-[0.55] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[76px] leading-[1.02] font-extrabold tracking-[-0.035em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.3] font-semibold text-(--cx-muted)">
        {by}
      </figcaption>
    </figure>
  )
}
```

### BigStat

One figure (≤ 4 characters) plus a one-line label. One per slide. Use only numbers the user supplied, or rules of thumb.

```tsx
function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[32px] border-t-[3px] border-(--cx-fg) pt-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[300px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="max-w-[740px] text-[44px] leading-[1.2] font-bold tracking-[-0.01em]">
        {label}
      </p>
    </div>
  )
}
```

### CompareColumn (before / after)

Two side by side in `grid grid-cols-2 gap-[24px]`: `kind="dont"` then `kind="do"`, with three short items each (≤ 20 characters).

```tsx
function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className="flex flex-col gap-[40px] border-t-[3px] border-(--cx-fg) pt-[24px]">
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : 'Don’t'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[44px] leading-[1.25] font-bold tracking-[-0.01em]',
            kind === 'dont' && 'text-(--cx-muted)',
          )}
        >
          {item}
        </p>
      ))}
    </div>
  )
}
```

### Step (timeline row)

Stack three or four. Pass `last` on the final one so its connector stops.

```tsx
function Step({
  n,
  title,
  children,
  last = false,
  ...slide
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
} & SlideProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[148px_1fr] border-t-[3px] border-(--cx-fg) pt-[24px]',
        !last && 'pb-[56px]',
      )}
    >
      <span className="font-(family-name:--cx-font-display) text-[64px] leading-[0.9] font-extrabold tracking-[-0.04em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[50px] leading-[1.1] font-extrabold tracking-[-0.025em]">{title}</p>
        <p className="text-[40px] leading-[1.35] font-medium" {...slide}>
          {children}
        </p>
      </div>
    </div>
  )
}
```

## Slide recipes

The demo has ten slides: Cover, PhotoCover, Content (list), ImageSplit, IconGrid, QuoteSlide, StatSlide, Compare, Steps, Closer. Cover, Content and Closer are under Example usage. The other seven are below, verbatim. Mix them to vary the rhythm of a carousel: an alternate cover, a photo break every few slides, then a grid, quote, stat, comparison or steps where the content fits. Change the copy and the `page` / `total` numbers, never the structure. Quotes, stats and examples must come from the user's material.

### PhotoCover (alternate cover)

Use as the first slide instead of `Cover` when the topic has a fitting photo.

```tsx
function PhotoCover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[44px]">
        <Photo
          src={coverPhoto}
          alt="Concrete architecture with sharp geometric lines"
          className="h-[580px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Form follows function</Eyebrow>
          <Hero>Structure is freedom.</Hero>
        </div>
      </div>
      <Footer page={2} total={10} />
    </Frame>
  )
}
```

### ImageSplit (photo + idea)

A photo break between text slides. One-line body.

```tsx
function ImageSplit() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <Photo
          src={splitPhoto}
          alt="A spiral staircase seen from above"
          className="h-[540px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Rhythm</Eyebrow>
          <Title>Repeat until it reads</Title>
          <Body>A system of repeated measures makes every page feel related.</Body>
        </div>
      </div>
      <Footer page={4} total={10} />
    </Frame>
  )
}
```

### IconGrid

Four parallel ideas with icons.

```tsx
function IconGrid() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Toolkit</Eyebrow>
          <Title>Four tools, no more</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Grid3x3}>A grid</IconCard>
          <IconCard icon={Type}>One typeface</IconCard>
          <IconCard icon={Ruler}>A scale of sizes</IconCard>
          <IconCard icon={Square}>One signal colour</IconCard>
        </div>
      </div>
      <Footer page={5} total={10} />
    </Frame>
  )
}
```

### QuoteSlide

One real quote, centred vertically.

```tsx
function QuoteSlide() {
  return (
    <Frame className="bg-[radial-gradient(var(--cx-grid)_2px,transparent_2.5px)] bg-[size:36px_36px]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your best line goes here, in the author’s own words.</Quote>
      </div>
      <Footer page={6} total={10} />
    </Frame>
  )
}
```

### StatSlide

One number that carries the slide.

```tsx
function StatSlide() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>Measure</Eyebrow>
        <BigStat value="6" label="columns are enough for almost any slide." />
      </div>
      <Footer page={7} total={10} />
    </Frame>
  )
}
```

### Compare (before / after)

Don't vs do, three items each.

```tsx
function Compare() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Hierarchy</Eyebrow>
          <Title>Size, not decoration</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Five colours', 'Centred everything', 'Drop shadows']}
          />
          <CompareColumn kind="do" items={['One signal colour', 'Flush left', 'Bigger type']} />
        </div>
      </div>
      <Footer page={8} total={10} />
    </Frame>
  )
}
```

### Steps (timeline)

A short process of three or four steps.

```tsx
function Steps() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Process</Eyebrow>
          <Title>Build the page</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Set the grid">
            Choose margins and columns first.
          </Step>
          <Step n="2" title="Place the type">
            Size by importance, align to columns.
          </Step>
          <Step n="3" title="Add the signal" last>
            One colour, only where you point.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

Müller-Brockmann on a phone screen: objective, structured, and confident in white space. Hierarchy comes from size and position alone, and the grid is part of the look. Hold the line: one grotesk, one signal colour, flush-left ragged-right, no centring. Avoid rounded corners, shadows, gradients, icons, emoji, italic, and using the accent on more than one or two elements per slide.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-end gap-[48px] pb-[48px]">
        <Eyebrow>Swiss Grid</Eyebrow>
        <Hero>Less, but better.</Hero>
        <Body>A strict grid, heavy grotesk type and one signal colour. Nothing decorative.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={10} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[56px]">
        <SectionNumber n="01" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Principles</Eyebrow>
          <Title>Order is the message</Title>
        </div>
        <div className="flex flex-col gap-[32px]">
          <Point n="A">Align everything to the grid.</Point>
          <Point n="B">Let size set the hierarchy.</Point>
          <Point n="C">Use colour only to point.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Swiss Grid · <Palette>**.
