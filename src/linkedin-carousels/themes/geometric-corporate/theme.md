---
name: Geometric Corporate
description: White page with solid quarter-circles, half-circles and a triangle in the corners, bold Manrope with one blue keyword, filled label pills. Clean, trustworthy B2B.
mode: light
---

# Geometric Corporate

## Palette

White space and dark ink, framed by flat geometric shapes in two brand colours that sit in the margins. The accent is the corporate blue: the label pill, one highlighted keyword per headline (through `Mark`), and at most one more device (the stat, step badges, the page number).

| Role      | Value                    | Notes                                             |
| --------- | ------------------------ | ------------------------------------------------- |
| bg        | `#FFFFFF`                | white page                                        |
| fg        | `#0F1E3D`                | headlines and list items (≈ 16:1)                 |
| accent    | `#1D4ED8`                | pill, `Mark` keyword, stat, step badges (≈ 6.7:1) |
| muted     | `#556070`                | body, footer, captions (≈ 6.3:1)                  |
| on-accent | `#FFFFFF`                | text on accent fills                              |
| shape-1   | `#0F1E3D`                | dark corner shapes, number circles, photo shadows |
| shape-2   | `#60A5FA`                | light corner shapes (decoration only, never text) |
| tint      | `#EEF3FB`                | list and icon cards, photo highlights             |
| rule      | `rgba(15, 30, 61, 0.12)` | footer line, outlines, connectors, quote dot grid |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Corporate Blue** unless the user picks another or their brand fits one better.

### Corporate Blue (default)

Studio demo: `Theme · Geometric Corporate · Corporate Blue` (`theme-geometric-corporate--corporate-blue`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0F1E3D',
  '--cx-accent': '#1D4ED8',
  '--cx-muted': '#556070',
  '--cx-on-accent': '#FFFFFF',
  '--cx-shape-1': '#0F1E3D',
  '--cx-shape-2': '#60A5FA',
  '--cx-tint': '#EEF3FB',
  '--cx-rule': 'rgba(15, 30, 61, 0.12)',
```

### Peach Coral

Studio demo: `Theme · Geometric Corporate · Peach Coral` (`theme-geometric-corporate--peach-coral`).

```tsx
  '--cx-bg': '#FFFBF8',
  '--cx-fg': '#3A1F1A',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B5550',
  '--cx-on-accent': '#FFFFFF',
  '--cx-shape-1': '#C2412D',
  '--cx-shape-2': '#FDBA9B',
  '--cx-tint': '#FDEEE6',
  '--cx-rule': 'rgba(58, 31, 26, 0.12)',
```

### Emerald

Studio demo: `Theme · Geometric Corporate · Emerald` (`theme-geometric-corporate--emerald`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0B2A22',
  '--cx-accent': '#047857',
  '--cx-muted': '#4F6460',
  '--cx-on-accent': '#FFFFFF',
  '--cx-shape-1': '#0B2A22',
  '--cx-shape-2': '#6EE7B7',
  '--cx-tint': '#E9F7F1',
  '--cx-rule': 'rgba(11, 42, 34, 0.12)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame` and `Shapes` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0F1E3D',
  '--cx-accent': '#1D4ED8',
  '--cx-muted': '#556070',
  '--cx-on-accent': '#FFFFFF',
  '--cx-shape-1': '#0F1E3D',
  '--cx-shape-2': '#60A5FA',
  '--cx-tint': '#EEF3FB',
  '--cx-rule': 'rgba(15, 30, 61, 0.12)',
  '--cx-font-display': "'Manrope', system-ui, sans-serif",
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
        <Shapes />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Shapes() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 right-0 size-[150px] rounded-bl-full bg-(--cx-shape-1)" />
      <div className="pointer-events-none absolute top-[150px] right-0 size-[75px] rounded-l-full bg-(--cx-shape-2)" />
      <div className="pointer-events-none absolute top-0 left-0 size-[96px] bg-(--cx-shape-2) [clip-path:polygon(0_0,100%_0,0_100%)]" />
      <div className="pointer-events-none absolute bottom-[300px] left-0 h-[120px] w-[60px] rounded-r-full bg-(--cx-shape-1)" />
    </>
  )
}
```

## Typography

- Display and body are both `'Manrope', system-ui, sans-serif` (`--cx-font-display` and `--cx-font-body`). Headlines use 800 (`font-extrabold`) with tight negative tracking, sentence case.
- Body 500, list items and labels 700, footer 600.
- Manrope is already loaded globally by `src/styles.css`.
- Type scale: hero 116 px / 1.02 / -0.035em (width ≈ 0.52, so ≈ 15 chars per line, ≤ 3 lines, ≤ 8 words); title 80 px / 1.08 / -0.03em (≈ 21 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; list item 40 px / 1.3 / 700 in a tinted card with a 72 px number circle; eyebrow pill 26 px / 1.2 / 700, 0.1em tracking, uppercase; footer 26 px / 1.3 / 600.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px. `Frame` draws `Shapes` (top-right quarter-circle and half-circle, top-left triangle, a half-circle on the left edge) and wraps children in their own relative layer.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px with its hairline; keep 48 px clear above it, so the content budget is roughly **1054 px**.
- Left-aligned, single column. Cover and CTA slides centre their content vertically.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between pill and title, 56 px from the title block to the list, 24 px between cards.
- Geometry repeats in the components: cards and photos keep one corner rounder or square (`rounded-tr-[80px]`, `rounded-bl-[200px]`, `rounded-tr-none` on badges). Pick one shape per element; never stack shapes on content.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. One `Mark` per headline; caps only for the pill and labels.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer  | Source                                  |
| ----------- | ------------- | --------------------------------------- |
| `cover.jpg` | Clay LeConey  | https://unsplash.com/photos/oW66SyCnoLs |
| `split.jpg` | Vitaly Gariev | https://unsplash.com/photos/yM3blOV977Q |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: grayscale, `tint` multiplied over it (highlights) and `shape-1` lightened over it (shadows), so photos print in the brand's dark colour on its pale tint.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (600 px tall, `rounded-[32px] rounded-bl-[200px]`) with the pill and hero below it. Text never sits on the photo.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import {
  ArrowRight,
  BarChart3,
  Check,
  Handshake,
  type LucideIcon,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
```

**Background.** `Shapes` is part of every `Frame`; don't move or add shapes. `QuoteSlide` passes `className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2px)] bg-size-[36px_36px]"` to `Frame`: a faint dot grid behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow (label pill)

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start rounded-full bg-(--cx-accent) px-[22px] py-[10px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-on-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Mark (keyword)

Wrap the one keyword of a hero or title.

```tsx
function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <span className="text-(--cx-accent)" {...slide}>
      {children}
    </span>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.02] font-extrabold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.08] font-extrabold tracking-[-0.03em]"
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
    <p className="text-[40px] leading-[1.45] font-medium text-(--cx-muted)" {...slide}>
      {children}
    </p>
  )
}
```

### Point (numbered card row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[28px] rounded-[20px] bg-(--cx-tint) px-[32px] py-[28px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-(--cx-shape-1) text-[36px] leading-none font-extrabold text-(--cx-bg)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] self-start rounded-full border-[3px] border-(--cx-accent) px-[30px] py-[12px] text-[28px] leading-[1.2] font-bold text-(--cx-accent)">
      Swipe to learn more
      <ArrowRight className="size-[32px]" strokeWidth={2.75} />
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. The badge shows the initials.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full rounded-tr-none bg-(--cx-accent) text-[48px] leading-none font-extrabold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">{AUTHOR.name}</p>
        <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
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
      <span className="font-bold text-(--cx-accent) tabular-nums">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-(--cx-tint) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-shape-1) mix-blend-lighten" />
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
    <div className="flex flex-col gap-[32px] rounded-[24px] rounded-tr-[80px] bg-(--cx-tint) p-[40px]">
      <span className="flex size-[96px] items-center justify-center rounded-full bg-(--cx-shape-1) text-(--cx-bg)">
        <Icon className="size-[48px]" strokeWidth={2} />
      </span>
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
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
      <span className="text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">“</span>
      <blockquote
        className="text-[72px] leading-[1.15] font-extrabold tracking-[-0.025em]"
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
      <p className="text-[260px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
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
        'flex flex-col gap-[36px] rounded-[24px] p-[40px]',
        kind === 'do' ? 'rounded-tr-[80px] bg-(--cx-tint)' : 'border-[2px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.75} />
        {kind === 'do' ? 'Do' : 'Avoid'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[38px] leading-[1.35] font-bold',
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
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-full rounded-tr-none bg-(--cx-accent) text-[38px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)" {...slide}>
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
          alt="Looking up at a glass office building"
          className="h-[600px] w-full rounded-[32px] rounded-bl-[200px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Growth</Eyebrow>
          <Hero>
            Build to <Mark>last</Mark>
          </Hero>
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
          alt="Colleagues working together around a table"
          className="h-[520px] w-full rounded-[32px] rounded-tr-[200px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Teams</Eyebrow>
          <Title>Hire for the gaps</Title>
          <Body>Add the skills you lack, not more of yours.</Body>
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
          <Eyebrow>Foundations</Eyebrow>
          <Title>Four pillars of a firm</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Users}>The right team</IconCard>
          <IconCard icon={BarChart3}>Clear numbers</IconCard>
          <IconCard icon={Handshake}>Repeat clients</IconCard>
          <IconCard icon={ShieldCheck}>Simple contracts</IconCard>
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
    <Frame className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2px)] bg-size-[36px_36px]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your clearest line goes here, in plain business words.</Quote>
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
        <BigStat value="80%" label="of revenue usually comes from your best fifth of clients." />
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
          <Eyebrow>Proposals</Eyebrow>
          <Title>Win the next pitch</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Forty slides', 'Every service', 'Hourly rates']} />
          <CompareColumn kind="do" items={['One clear plan', 'Their problem', 'A fixed price']} />
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
          <Title>From founder to firm</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Document">
            Write down how you deliver today.
          </Step>
          <Step n="2" title="Delegate">
            Hand one step to someone else.
          </Step>
          <Step n="3" title="Repeat" last>
            Pick the next step every month.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A consultancy's slide deck at its tidiest: lots of white, confident sans-serif headlines with one blue keyword, and flat circles and triangles parked in the corners like a brand system. It should feel trustworthy and organised. Hold the discipline: shapes only in the margins, one keyword per headline, tinted cards for grouped content, two brand colours plus ink. Avoid gradients, drop shadows, shapes behind text, more than one `Mark` per headline, stock-photo clichés like handshakes, emoji, and all-caps headlines.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Consulting notes</Eyebrow>
        <Hero>
          Five ways to <Mark>scale</Mark> your firm
        </Hero>
        <Body>Clean white space, bold geometry and one corporate blue. Built for B2B advice.</Body>
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
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Three mistakes to <Mark>avoid</Mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="1">Hiring before the process is clear.</Point>
          <Point n="2">Saying yes to every client.</Point>
          <Point n="3">Pricing by the hour forever.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Geometric Corporate · <Palette>**.
