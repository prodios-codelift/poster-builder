---
name: Boardroom Navy
description: Deep navy page, Inter Tight bold headlines with a short gold rule, tinted list panels. Confident, consulting-deck professional.
mode: dark
---

# Boardroom Navy

## Palette

Light type on a deep, desaturated ground. The accent is metallic and scarce: the eyebrow bar, the rule under each title, list numerals and the avatar. Never use it for body copy.

| Role    | Value                       | Notes                                                  |
| ------- | --------------------------- | ------------------------------------------------------ |
| bg      | `#0B1F3A`                   | deep ground, every slide                               |
| fg      | `#F5F7FA`                   | headlines and body copy (≥ 12:1 on bg)                 |
| accent  | `#D4A84B`                   | eyebrow + bar, title rule, numerals, swipe cue, avatar |
| muted   | `#9AA8BC`                   | footer and handle (≥ 6:1 on bg)                        |
| rule    | `rgba(245, 247, 250, 0.14)` | footer hairline                                        |
| surface | `rgba(245, 247, 250, 0.06)` | tinted panel behind list rows                          |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Navy & Gold** unless the user picks another or their brand fits one better.

### Navy & Gold (default)

Studio demo: `Theme · Boardroom Navy · Navy & Gold` (`theme-boardroom-navy--navy-gold`).

```tsx
  '--cx-bg': '#0B1F3A',
  '--cx-fg': '#F5F7FA',
  '--cx-accent': '#D4A84B',
  '--cx-muted': '#9AA8BC',
  '--cx-rule': 'rgba(245, 247, 250, 0.14)',
  '--cx-surface': 'rgba(245, 247, 250, 0.06)',
```

### Charcoal & Teal

Studio demo: `Theme · Boardroom Navy · Charcoal & Teal` (`theme-boardroom-navy--charcoal-teal`).

```tsx
  '--cx-bg': '#1C1F24',
  '--cx-fg': '#F2F4F5',
  '--cx-accent': '#2EC4B6',
  '--cx-muted': '#9BA3AB',
  '--cx-rule': 'rgba(242, 244, 245, 0.14)',
  '--cx-surface': 'rgba(242, 244, 245, 0.06)',
```

### Forest & Brass

Studio demo: `Theme · Boardroom Navy · Forest & Brass` (`theme-boardroom-navy--forest-brass`).

```tsx
  '--cx-bg': '#10291F',
  '--cx-fg': '#F3F1EA',
  '--cx-accent': '#C9A15A',
  '--cx-muted': '#A3B3A9',
  '--cx-rule': 'rgba(243, 241, 234, 0.14)',
  '--cx-surface': 'rgba(243, 241, 234, 0.06)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#0B1F3A',
  '--cx-fg': '#F5F7FA',
  '--cx-accent': '#D4A84B',
  '--cx-muted': '#9AA8BC',
  '--cx-rule': 'rgba(245, 247, 250, 0.14)',
  '--cx-surface': 'rgba(245, 247, 250, 0.06)',
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
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display and body: `'Inter Tight', system-ui, sans-serif` (loaded weights 500, 700, 800 in `src/styles.css`). Width factor ≈ 0.50 at 700.
- Headlines 700 (`font-bold`), body 500, list items and labels 600–700.
- Type scale: hero 120 px / 1.04 / -0.03em (≈ 15 chars per line, ≤ 3 lines, ≤ 7 words); title 84 px / 1.08 / -0.025em (≈ 21 chars per line, ≤ 3 lines); body 40 px / 1.45; list item 38 px / 1.3 / 600 with a 44 px bold numeral; eyebrow 26 px / 1.2 / 700, uppercase, 0.2em tracking; footer 26 px / 1.3 / 600.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- Left-aligned, single column. Cover and CTA centre vertically.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- `Title` includes its own 96 px gold rule (36 px below the text), so budget about 42 px extra per title.
- Gaps: 48 px between cover elements, 32 px eyebrow → title, 64 px title block → rows, 24 px between list panels.
- Lists are `Point` panels: tinted surface, 6 px accent left border, zero-padded numerals (`01`, `02`).
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Caps only in the eyebrow.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer   | Source                                  |
| ----------- | -------------- | --------------------------------------- |
| `cover.jpg` | Clay LeConey   | https://unsplash.com/photos/oW66SyCnoLs |
| `split.jpg` | Benjamin Child | https://unsplash.com/photos/0sT9YhNgSEs |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with `bg` laid over in `mix-blend-color`, so the photo takes the palette's ground colour (navy, charcoal or forest) and keeps its tonal detail.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom ~30% fades to solid `bg`, so the eyebrow, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Compass, Handshake, type LucideIcon, Target, TrendingUp, X } from 'lucide-react'
```

**Background.** No extra background; the flat ground is the look.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

A short accent bar followed by the uppercase label.

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[20px]">
      <span className="h-[4px] w-[56px] bg-(--cx-accent)" />
      <p
        className="text-[26px] leading-[1.2] font-bold tracking-[0.2em] text-(--cx-accent) uppercase"
        {...slide}
      >
        {children}
      </p>
    </div>
  )
}
```

### Hero (cover only) and Title

`Title` renders the accent rule under the heading.

```tsx
function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[120px] leading-[1.04] font-bold tracking-[-0.03em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[36px]">
      <h2
        className="font-(family-name:--cx-font-display) text-[84px] leading-[1.08] font-bold tracking-[-0.025em]"
        {...slide}
      >
        {children}
      </h2>
      <span className="h-[6px] w-[96px] bg-(--cx-accent)" />
    </div>
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

### Point (list panel)

Pass zero-padded numbers: `n="01"`.

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[36px] border-l-[6px] border-(--cx-accent) bg-(--cx-surface) px-[40px] py-[32px]">
      <span className="shrink-0 font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-accent) tabular-nums">
        {n}
      </span>
      <p className="text-[38px] leading-[1.3] font-semibold" {...slide}>
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

The author block for the closing slide, reading from `AUTHOR`. Shows initials in an accent circle.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="flex items-center gap-[32px]">
      <div className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-bg)">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[48px] leading-[1.1] font-bold">
          {AUTHOR.name}
        </p>
        <p className="text-[30px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
      </div>
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
    <div className={cn('relative overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-color" />
    </div>
  )
}
```

### PhotoBackdrop (full-bleed cover photo)

Place it first inside `<Frame>`. It sits behind the content at `-z-10` (Frame is `isolate`) and fades into `bg` so text stays readable. Keep text in the bottom half.

```tsx
function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_30%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_58%,transparent_85%)]" />
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
    <div className="flex flex-col gap-[44px] border-t-[4px] border-(--cx-accent) bg-(--cx-surface) p-[44px]">
      <Icon className="size-[96px] text-(--cx-accent)" strokeWidth={1.75} />
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
      <span className="font-(family-name:--cx-font-display) text-[160px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[68px] leading-[1.15] font-bold tracking-[-0.02em]"
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
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-bold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.25] font-semibold">{label}</p>
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
        'flex flex-col gap-[40px] p-[40px]',
        kind === 'do'
          ? 'border-t-[4px] border-(--cx-accent) bg-(--cx-surface)'
          : 'border-t-[4px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[14px] text-[26px] leading-[1.2] font-bold tracking-[0.16em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[32px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Instead' : 'Avoid'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[34px] leading-[1.3] font-semibold',
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
    <div className="flex gap-[36px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[3px] border-(--cx-accent) text-[30px] leading-none font-bold text-(--cx-accent) tabular-nums">
          {n}
        </span>
        {last ? null : <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[12px]', !last && 'pb-[56px]')}>
        <p className="text-[46px] leading-[1.2] font-bold">{title}</p>
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
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>Leadership notes</Eyebrow>
        <Hero>Decide faster, explain better</Hero>
        <SwipeCue />
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
        <Photo src={splitPhoto} alt="An empty boardroom table" className="h-[540px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>In the room</Eyebrow>
          <Title>Bring one page, not a deck</Title>
          <Body>A single page forces the real decision to the top.</Body>
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
          <Eyebrow>What good looks like</Eyebrow>
          <Title>Four signs of a clear plan</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>One measurable goal</IconCard>
          <IconCard icon={Compass}>A stated direction</IconCard>
          <IconCard icon={Handshake}>A named owner</IconCard>
          <IconCard icon={TrendingUp}>A way to track it</IconCard>
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
    <Frame>
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your best quote goes here, in the author’s own words.</Quote>
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
        <BigStat value="1" label="decision per meeting, written down before anyone leaves." />
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
          <Eyebrow>Before and after</Eyebrow>
          <Title>Status updates that land</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Every task listed', 'Ten slides of context', 'Asks buried at the end']}
          />
          <CompareColumn
            kind="do"
            items={['The three that matter', 'One page of context', 'The ask up front']}
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
          <Eyebrow>The process</Eyebrow>
          <Title>From idea to approval</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Frame the problem">
            One sentence a new hire would understand.
          </Step>
          <Step n="2" title="Show two options">
            Each with its cost and its risk.
          </Step>
          <Step n="3" title="Recommend one" last>
            And say what would change your mind.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

The polished leadership deck: think strategy-consultancy slides and annual-report covers. Dark, calm and authoritative, with gold used like a foil stamp. Keep it disciplined: one sans family, flat colour, left-aligned, generous spacing. Avoid gradients, glows, emoji, playful shapes, rounded pill buttons, centred body copy, and more than one accent device per element.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Boardroom Navy</Eyebrow>
        <Hero>Strategy, stated plainly</Hero>
        <Body>Deep navy, crisp type and one gold accent. Built for leadership and B2B posts.</Body>
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
          <Eyebrow>The framework</Eyebrow>
          <Title>Three moves before any decision</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="01">Define the outcome you need.</Point>
          <Point n="02">Name the trade-off out loud.</Point>
          <Point n="03">Set the date you will review it.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Boardroom Navy · <Palette>**.
