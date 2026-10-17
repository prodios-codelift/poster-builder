---
name: Paper Editorial
description: Warm paper page, ink type, Fraunces serif headlines over Manrope body, one rust accent. Calm, text-led, thoughtful.
mode: light
---

# Paper Editorial

## Palette

Ink on warm paper carries the page. The accent is the only highlight. Each slide uses it for the eyebrow plus at most one other device (list numerals, the swipe cue, or the CTA rule), and never for a paragraph.

| Role   | Value                    | Notes                                        |
| ------ | ------------------------ | -------------------------------------------- |
| bg     | `#F5F0E6`                | warm paper, every slide                      |
| fg     | `#1B1A17`                | ink: headlines and body copy                 |
| accent | `#C2410C`                | eyebrow, numerals, swipe cue, CTA rule       |
| muted  | `#6B655A`                | footer, handles, captions (≥ 4.5:1 on bg)    |
| rule   | `rgba(27, 26, 23, 0.16)` | hairlines between list rows and above footer |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Rust** unless the user picks another or their brand fits one better.

### Rust (default)

Studio demo: `Theme · Paper Editorial · Rust` (`theme-paper-editorial--rust`).

```tsx
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
```

### Sage

Studio demo: `Theme · Paper Editorial · Sage` (`theme-paper-editorial--sage`).

```tsx
  '--cx-bg': '#EEF0E8',
  '--cx-fg': '#1A1E1A',
  '--cx-accent': '#3F6B4B',
  '--cx-muted': '#5A6158',
  '--cx-rule': 'rgba(26, 30, 26, 0.16)',
```

### Ink Blue

Studio demo: `Theme · Paper Editorial · Ink Blue` (`theme-paper-editorial--ink-blue`).

```tsx
  '--cx-bg': '#F3F1EC',
  '--cx-fg': '#16181D',
  '--cx-accent': '#2547A8',
  '--cx-muted': '#5F6168',
  '--cx-rule': 'rgba(22, 24, 29, 0.16)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
  '--cx-font-display': "'Fraunces', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
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
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Fraunces', Georgia, serif`. Loaded weights are **500 and 700 only**: 500 (`font-medium`) for headlines, 700 (`font-bold`) for numerals and the author name.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. Weights 500 for body, 600–700 for list items, labels and footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 128 px / 1.02 / -0.025em (≈ 16 chars per line, ≤ 3 lines, ≤ 8 words); title 88 px / 1.05 / -0.02em (≈ 24 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500; list item 40 px / 1.35 / 600 with a 56 px Fraunces bold numeral; eyebrow 28 px / 1.2 / 700, uppercase, 0.18em tracking; footer 26 px / 1.3 / 600, muted.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- Left-aligned, single column. The cover and CTA slides centre their content vertically (`justify-center`).
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 64 px from title block to body, 40 px between list rows.
- Lists are rows separated by a `rule` hairline (`border-t`), not bullets.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. No caps outside the eyebrow.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer           | Source                                  |
| ----------- | ---------------------- | --------------------------------------- |
| `cover.jpg` | Alicia Christin Gerald | https://unsplash.com/photos/4WyNUXlftF0 |
| `split.jpg` | David Travis           | https://unsplash.com/photos/5bYxXawHOQg |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: the image is grayscale, then `bg` replaces the highlights (`mix-blend-multiply`) and `fg` replaces the shadows (`mix-blend-lighten`). Switching palette recolours the photo. Pick photos with clear light and dark areas; flat, dark photos turn into a solid block of colour. The result reads like ink printed on the same paper.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (about 560–600 px tall) with the eyebrow and hero below it. Text never sits on the photo. No rounded corners.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { BookOpen, Check, Feather, Lightbulb, type LucideIcon, PenLine, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes `className="bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_60%)]"` to `Frame`: a faint accent wash behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="text-[28px] leading-[1.2] font-bold tracking-[0.18em] text-(--cx-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[128px] leading-[1.02] font-medium tracking-[-0.025em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[88px] leading-[1.05] font-medium tracking-[-0.02em]"
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
    <p className="text-[40px] leading-[1.45] font-medium" {...slide}>
      {children}
    </p>
  )
}
```

### Point (numbered list row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold" {...slide}>
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
    <div className="flex flex-col gap-[8px] border-l-[6px] border-(--cx-accent) pl-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
    </div>
  )
}
```

### Footer

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
      <span>
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="tabular-nums">
        {pad(page)} / {pad(total)}
      </span>
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
    <div className="flex flex-col gap-[44px] border-t border-(--cx-rule) pt-[32px]">
      <Icon className="size-[88px] text-(--cx-accent)" strokeWidth={1.5} />
      <p className="text-[44px] leading-[1.3] font-semibold" {...slide}>
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
      <span className="font-(family-name:--cx-font-display) text-[180px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.12] font-medium tracking-[-0.015em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-semibold text-(--cx-muted)">
        — {by}
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
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-medium tracking-[-0.04em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-semibold">{label}</p>
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
    <div
      className={cn(
        'flex flex-col gap-[40px] border-t-[3px] pt-[28px]',
        kind === 'do' ? 'border-(--cx-fg)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.18em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Try this' : 'Not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.35] font-semibold',
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
      className={cn('flex gap-[32px] border-t border-(--cx-rule) pt-[28px]', !last && 'pb-[56px]')}
    >
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[62px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="font-(family-name:--cx-font-display) text-[54px] leading-[1.1] font-medium">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium" {...slide}>
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
        <Photo src={coverPhoto} alt="An open book on a table" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The long read</Eyebrow>
          <Hero>Slow down, read closer</Hero>
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
          alt="A fountain pen resting on a notebook"
          className="h-[540px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On writing</Eyebrow>
          <Title>Write the draft by hand</Title>
          <Body>Paper slows you down enough to notice what you mean.</Body>
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
          <Eyebrow>A reader’s toolkit</Eyebrow>
          <Title>Four habits worth keeping</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={BookOpen}>Read a little every day</IconCard>
          <IconCard icon={PenLine}>Write in the margins</IconCard>
          <IconCard icon={Lightbulb}>Note one idea per page</IconCard>
          <IconCard icon={Feather}>Revise with fresh eyes</IconCard>
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
    <Frame className="bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_60%)]">
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
        <Eyebrow>Rule of thumb</Eyebrow>
        <BigStat value="20" label="minutes of reading a day is enough to build the habit." />
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
          <Eyebrow>Better notes</Eyebrow>
          <Title>Notes you will reread</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Copying whole passages', 'Highlighting everything', 'One giant document']}
          />
          <CompareColumn
            kind="do"
            items={['One line in your words', 'Mark only surprises', 'A page per idea']}
          />
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
          <Eyebrow>The method</Eyebrow>
          <Title>From book to essay</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Read">
            Mark the lines that surprise you.
          </Step>
          <Step n="2" title="Gather">
            Copy each one onto its own card.
          </Step>
          <Step n="3" title="Write" last>
            Connect three cards into one argument.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A literary magazine on warm stock: generous margins, a serif headline doing the talking, and quiet sans-serif copy underneath. It should feel considered, not loud, the visual equivalent of a well-edited essay. Hold the discipline: one accent colour, one serif, one sans, left-aligned, flat colour. Avoid gradients, drop shadows, rounded cards, photos with text over them, emoji, centred body copy, all-caps headlines (caps are only for the eyebrow), and the accent on anything beyond the eyebrow plus one device per slide.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Paper Editorial</Eyebrow>
        <Hero>Ideas worth a slow read</Hero>
        <Body>Warm paper, ink type and one rust accent. Built for thoughtful, text-led posts.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={10} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The rules</Eyebrow>
          <Title>Three habits of a readable slide</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">One idea per slide, nothing more.</Point>
          <Point n="2">Thirty words of body copy, at most.</Point>
          <Point n="3">One accent colour, used sparingly.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Paper Editorial · <Palette>**.
