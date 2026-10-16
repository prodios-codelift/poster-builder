---
name: Data Brief
description: Analyst-report look: tinted page, white rounded cards, big Geist figures in one accent, pill eyebrows. Clean, credible, data-led.
mode: light
---

# Data Brief

## Palette

Ink on a cool tinted page, with white cards lifting the key facts. The accent marks numbers and labels: eyebrow pill, stat figures, insight bar, swipe cue, avatar.

| Role        | Value                    | Notes                                                     |
| ----------- | ------------------------ | --------------------------------------------------------- |
| bg          | `#F1F5FB`                | tinted page, every slide                                  |
| fg          | `#0F172A`                | headlines and body                                        |
| accent      | `#1D4ED8`                | eyebrow text, stat values, insight bar, swipe cue, avatar |
| accent-soft | `#DCE6FD`                | eyebrow pill fill (accent text on it ≥ 4.5:1)             |
| muted       | `#526077`                | footer, handles (≥ 5:1 on bg)                             |
| card        | `#FFFFFF`                | card fill                                                 |
| rule        | `rgba(15, 23, 42, 0.10)` | card borders and footer hairline                          |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Corporate Blue** unless the user picks another or their brand fits one better.

### Corporate Blue (default)

Studio demo: `Theme · Data Brief · Corporate Blue` (`theme-data-brief--corporate-blue`).

```tsx
  '--cx-bg': '#F1F5FB',
  '--cx-fg': '#0F172A',
  '--cx-accent': '#1D4ED8',
  '--cx-accent-soft': '#DCE6FD',
  '--cx-muted': '#526077',
  '--cx-card': '#FFFFFF',
  '--cx-rule': 'rgba(15, 23, 42, 0.10)',
```

### Emerald

Studio demo: `Theme · Data Brief · Emerald` (`theme-data-brief--emerald`).

```tsx
  '--cx-bg': '#EFF7F3',
  '--cx-fg': '#0B1F17',
  '--cx-accent': '#047857',
  '--cx-accent-soft': '#D1F3E3',
  '--cx-muted': '#4F6159',
  '--cx-card': '#FFFFFF',
  '--cx-rule': 'rgba(11, 31, 23, 0.10)',
```

### Plum

Studio demo: `Theme · Data Brief · Plum` (`theme-data-brief--plum`).

```tsx
  '--cx-bg': '#F6F2FA',
  '--cx-fg': '#1E1424',
  '--cx-accent': '#6D28D9',
  '--cx-accent-soft': '#EADFFB',
  '--cx-muted': '#625868',
  '--cx-card': '#FFFFFF',
  '--cx-rule': 'rgba(30, 20, 36, 0.10)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#F1F5FB',
  '--cx-fg': '#0F172A',
  '--cx-accent': '#1D4ED8',
  '--cx-accent-soft': '#DCE6FD',
  '--cx-muted': '#526077',
  '--cx-card': '#FFFFFF',
  '--cx-rule': 'rgba(15, 23, 42, 0.10)',
  '--cx-font-display': "'Geist Variable', system-ui, sans-serif",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[88px] pt-[104px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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

- Display and body: `'Geist Variable', system-ui, sans-serif` (100–900 loaded globally). Width factor ≈ 0.50 at 500–600, 0.54 at 700.
- Type scale: hero 120 px / 1.04 / -0.04em (≈ 14 chars per line, ≤ 3 lines, ≤ 7 words); title 84 px / 1.08 / -0.035em (≈ 20 chars per line); stat value 136 px / 1.0, tabular; stat label 34 px / 1.3 / 600; body 40 px / 1.45; insight 38 px / 1.4; eyebrow 26 px / 1.2 / 700, uppercase, 0.1em; footer 26 px.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 88 px left/right, 104 px top, 72 px bottom. Content width is 904 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1062 px**.
- Cover and CTA centre vertically. Content slides are top-aligned with a 56 px gap between blocks.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Stats sit in a two-column grid (`grid grid-cols-2 gap-[24px]`) of `StatCard`s; a stat card is about 330 px tall with a two-line label. Max four cards per slide.
- `Insight` is the full-width takeaway card under the stats.
- Every number must come from the user's material. Without real data, use rules of thumb (`1 idea per slide`) rather than invented percentages.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Caps only in the eyebrow pill.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer      | Source                                  |
| ----------- | ----------------- | --------------------------------------- |
| `cover.jpg` | 安 崔士 (treesan) | https://unsplash.com/photos/Q3s_HYFEXS4 |
| `split.jpg` | Luke Chesser      | https://unsplash.com/photos/JKUTrJ4vK00 |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: the image is grayscale, then `accent-soft` replaces the highlights (`mix-blend-multiply`) and `fg` replaces the shadows (`mix-blend-lighten`). Switching palette recolours the photo. Pick photos with clear light and dark areas; flat, dark photos turn into a solid block of colour. The photo becomes a soft accent-tinted print that matches the cards.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (about 560–600 px tall) with the eyebrow and hero below it. Text never sits on the photo. Photos use the card radius (`rounded-[28px]`).

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { BarChart3, Check, Database, type LucideIcon, Search, Target, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes a dot grid to `Frame`: `className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2.5px)] bg-[size:36px_36px]"`, like graph paper. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Soft accent pill.

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="self-start rounded-full bg-(--cx-accent-soft) px-[22px] py-[10px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-accent) uppercase">
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[120px] leading-[1.04] font-bold tracking-[-0.04em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[84px] leading-[1.08] font-bold tracking-[-0.035em]">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium">{children}</p>
}
```

### StatCard

Short value (≤ 4 characters fits two-up) plus a label of ≤ 2 lines.

```tsx
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[20px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[40px]">
      <p className="font-(family-name:--cx-font-display) text-[136px] leading-none font-bold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[34px] leading-[1.3] font-semibold">{label}</p>
    </div>
  )
}
```

### Insight (takeaway card)

```tsx
function Insight({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-[28px] rounded-[28px] bg-(--cx-card) p-[40px]">
      <span className="w-[8px] shrink-0 rounded-full bg-(--cx-accent)" />
      <p className="text-[38px] leading-[1.4] font-medium">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">
      Swipe for the numbers →
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="flex items-center gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[36px]">
      <div className="flex size-[104px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) text-[40px] leading-none font-bold text-(--cx-card)">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[44px] leading-[1.1] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
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
    <div className={cn('relative isolate overflow-hidden', className)}>
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.2]" />
      <div className="absolute inset-0 bg-(--cx-accent-soft) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Pass any `lucide-react` icon as `icon`. Use four in a `grid grid-cols-2 gap-[24px]`, with labels of up to about 4 words.

```tsx
function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[44px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[44px]">
      <span className="flex size-[120px] items-center justify-center rounded-[20px] bg-(--cx-accent-soft)">
        <Icon className="size-[64px] text-(--cx-accent)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-semibold">{children}</p>
    </div>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker.

```tsx
function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[36px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[56px]">
      <span className="text-[140px] leading-[0.6] font-bold text-(--cx-accent)">“</span>
      <blockquote className="font-(family-name:--cx-font-display) text-[60px] leading-[1.2] font-bold tracking-[-0.03em]">
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
    <div className="flex flex-col gap-[28px] rounded-[28px] border border-(--cx-rule) bg-(--cx-card) p-[56px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[42px] leading-[1.3] font-semibold">{label}</p>
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
        'flex flex-col gap-[40px] rounded-[28px] border p-[40px]',
        kind === 'do' ? 'border-(--cx-accent) bg-(--cx-card)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[10px] self-start rounded-full px-[20px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.08em] uppercase',
          kind === 'do' ? 'bg-(--cx-accent-soft) text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Do' : 'Skip'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.3] font-semibold',
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
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div className="flex gap-[32px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) text-[30px] leading-none font-bold text-(--cx-card) tabular-nums">
          {n}
        </span>
        {last ? null : <span className="w-[3px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.2] font-bold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium">{children}</p>
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
          alt="An aerial view of a city grid"
          className="h-[560px] w-full rounded-[28px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Quarterly brief</Eyebrow>
          <Hero>Read the city like data</Hero>
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
          alt="Performance charts on a laptop screen"
          className="h-[540px] w-full rounded-[28px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Dashboards</Eyebrow>
          <Title>One chart, one question</Title>
          <Body>If a chart answers two questions, split it into two.</Body>
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
          <Eyebrow>Before you publish</Eyebrow>
          <Title>Check these four things</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>The question it answers</IconCard>
          <IconCard icon={Database}>Where the data came from</IconCard>
          <IconCard icon={Search}>What you left out</IconCard>
          <IconCard icon={BarChart3}>The simplest chart that works</IconCard>
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
    <Frame className="bg-[radial-gradient(var(--cx-rule)_2px,transparent_2.5px)] bg-[size:36px_36px]">
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
        <BigStat value="5" label="seconds for a reader to find the main number." />
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
          <Eyebrow>Charts</Eyebrow>
          <Title>Make the point obvious</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['3D pie charts', 'Twelve colours', 'A legend to decode']}
          />
          <CompareColumn
            kind="do"
            items={['Sorted bars', 'One highlight colour', 'Labels on the data']}
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
          <Eyebrow>Workflow</Eyebrow>
          <Title>From raw data to insight</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Ask">
            Write the question in one sentence.
          </Step>
          <Step n="2" title="Cut">
            Keep only the data that answers it.
          </Step>
          <Step n="3" title="Show" last>
            Lead with the number, then the chart.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A modern research brief or investor update: calm tinted background, white cards, and figures large enough to read at thumbnail size. It earns trust through restraint. Keep shadows off (borders only), one accent, one family. Avoid fake precision, chart junk, gradients, emoji, more than four cards per slide, and colour-coding that needs a legend.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Data Brief</Eyebrow>
        <Hero>Let the number lead</Hero>
        <Body>White cards, big figures and one clear accent. Built for reports and analysis.</Body>
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
          <Eyebrow>The rule of thumb</Eyebrow>
          <Title>Keep every slide this lean</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <StatCard value="1" label="idea per slide" />
          <StatCard value="30" label="words of body, at most" />
        </div>
        <Insight>Put the figure first and the explanation second.</Insight>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Data Brief · <Palette>**.
