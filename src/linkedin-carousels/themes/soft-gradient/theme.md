---
name: Soft Gradient
description: Off-white page with two blurred colour glows, heavy Inter Tight caps, glassy rounded cards and a thin meta bar. Friendly, fresh, explainer-style.
mode: light
---

# Soft Gradient

## Palette

A near-white page warmed by two soft glows in the bottom-right corner. Ink type carries the content. The accent is a deep shade of the glow colour, used for the outlined eyebrow pill and at most one more device per slide (numerals, icons, the stat). The glows are decoration only, never text colours.

| Role    | Value                       | Notes                                                        |
| ------- | --------------------------- | ------------------------------------------------------------ |
| bg      | `#FAFAF7`                   | off-white page                                               |
| fg      | `#16181D`                   | headlines and list items (≈ 17:1)                            |
| accent  | `#3F6212`                   | eyebrow pill, numerals, icons, stat (≈ 6.5:1, also on glows) |
| muted   | `#5B5F66`                   | body, footer, meta bar (≈ 6:1, ≥ 5:1 over the glows)         |
| blob-1  | `#D9F99D`                   | main glow, bottom-right; photo tint start                    |
| blob-2  | `#FDE68A`                   | second glow, bottom edge; photo tint end                     |
| rule    | `rgba(22, 24, 29, 0.12)`    | card borders, meta bar line, step connector                  |
| surface | `rgba(255, 255, 255, 0.72)` | glassy card fill                                             |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Lime Mist** unless the user picks another or their brand fits one better.

### Lime Mist (default)

Studio demo: `Theme · Soft Gradient · Lime Mist` (`theme-soft-gradient--lime-mist`).

```tsx
  '--cx-bg': '#FAFAF7',
  '--cx-fg': '#16181D',
  '--cx-accent': '#3F6212',
  '--cx-muted': '#5B5F66',
  '--cx-blob-1': '#D9F99D',
  '--cx-blob-2': '#FDE68A',
  '--cx-rule': 'rgba(22, 24, 29, 0.12)',
  '--cx-surface': 'rgba(255, 255, 255, 0.72)',
```

### Peach Glow

Studio demo: `Theme · Soft Gradient · Peach Glow` (`theme-soft-gradient--peach-glow`).

```tsx
  '--cx-bg': '#FBF9F7',
  '--cx-fg': '#1C1917',
  '--cx-accent': '#B4410C',
  '--cx-muted': '#5F5853',
  '--cx-blob-1': '#FED7AA',
  '--cx-blob-2': '#FBCFE8',
  '--cx-rule': 'rgba(28, 25, 23, 0.12)',
  '--cx-surface': 'rgba(255, 255, 255, 0.72)',
```

### Lilac Haze

Studio demo: `Theme · Soft Gradient · Lilac Haze` (`theme-soft-gradient--lilac-haze`).

```tsx
  '--cx-bg': '#FAFAFC',
  '--cx-fg': '#17171F',
  '--cx-accent': '#6D28D9',
  '--cx-muted': '#5D5D6B',
  '--cx-blob-1': '#DDD6FE',
  '--cx-blob-2': '#BAE6FD',
  '--cx-rule': 'rgba(23, 23, 31, 0.12)',
  '--cx-surface': 'rgba(255, 255, 255, 0.72)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#FAFAF7',
  '--cx-fg': '#16181D',
  '--cx-accent': '#3F6212',
  '--cx-muted': '#5B5F66',
  '--cx-blob-1': '#D9F99D',
  '--cx-blob-2': '#FDE68A',
  '--cx-rule': 'rgba(22, 24, 29, 0.12)',
  '--cx-surface': 'rgba(255, 255, 255, 0.72)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,var(--cx-blob-1),transparent_46%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,var(--cx-blob-2),transparent_38%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Inter Tight', system-ui, sans-serif`. 800 (`font-extrabold`), uppercase for hero, titles, quotes and step titles.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700 for list items, labels, the meta bar and the footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 120 px / 1.0 / -0.02em uppercase (caps width ≈ 0.60, so ≈ 12 chars per line, ≤ 3 lines, ≤ 8 words); title 80 px / 1.05 uppercase (≈ 18 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; list item 40 px / 1.3 / 700 in a glass card with a 52 px numeral; eyebrow 26 px / 1.2 / 700, 0.12em tracking, outlined pill; meta bar 26 px / 1.2 / 700 caps; footer 26 px / 1.3 / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px. `Frame` paints the two glows and wraps children in their own relative layer.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px** (about 1010 px when a `MetaBar` sits on top).
- `MetaBar` (series name left, part or status right) opens the cover and the closing slide only.
- Left-aligned, single column. Cover and CTA slides centre their content vertically.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 56 px from the title block to the list, 24 px between list cards and grid cards.
- Cards are glass: `surface` fill, 1 px `rule` border, `rounded-[24px]`–`rounded-[28px]`. Photos use `rounded-[32px]`.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. Display text is caps; body copy stays sentence case.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer  | Source                                  |
| ----------- | ------------- | --------------------------------------- |
| `cover.jpg` | Dhony Koswara | https://unsplash.com/photos/btVTuAIhvk8 |
| `split.jpg` | Ella Deane    | https://unsplash.com/photos/60-_Ta1Fcyk |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale, then a `blob-1` → `blob-2` gradient multiplied over it, so the photo glows in the same colours as the page. Bright, airy photos work best.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (600 px tall, `rounded-[32px]`) with the eyebrow and hero below it. Text never sits on the photo.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { ArrowRight, Check, Eye, Heart, type LucideIcon, Palette, Type, X } from 'lucide-react'
```

**Background.** The two glows in `Frame` are the background. `QuoteSlide` passes `className="bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--cx-blob-2)_70%,transparent),transparent_45%)]"` to `Frame`: one extra glow top-left behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### MetaBar (cover and closer)

A thin top bar: series name on the left, part or status on the right. Two or three words each.

```tsx
function MetaBar({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between border-b border-(--cx-rule) pb-[24px] text-[26px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-muted) uppercase">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  )
}
```

### Eyebrow (outlined pill)

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="self-start rounded-full border-[2px] border-(--cx-accent) px-[22px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] text-(--cx-accent) uppercase">
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[120px] leading-[1.0] font-extrabold tracking-[-0.02em] uppercase">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[80px] leading-[1.05] font-extrabold tracking-[-0.015em] uppercase">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium text-(--cx-muted)">{children}</p>
}
```

### Point (numbered glass card)

```tsx
function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[28px] rounded-[24px] border border-(--cx-rule) bg-(--cx-surface) px-[36px] py-[32px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[52px] leading-none font-extrabold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-bold">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <div className="flex items-center gap-[20px]">
      <p className="text-[28px] leading-[1.2] font-bold tracking-[0.12em] uppercase">
        Swipe for more
      </p>
      <span className="flex size-[60px] items-center justify-center rounded-full bg-(--cx-fg) text-(--cx-bg)">
        <ArrowRight className="size-[30px]" strokeWidth={2.5} />
      </span>
    </div>
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
  return (
    <div className="flex items-center gap-[28px] self-start rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) py-[28px] pr-[56px] pl-[28px]">
      <span className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-fg) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-bg)">
        {initials}
      </span>
      <div className="flex flex-col gap-[4px]">
        <p className="font-(family-name:--cx-font-display) text-[48px] leading-[1.1] font-extrabold">
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
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.1]" />
      <div className="absolute inset-0 bg-linear-to-br from-(--cx-blob-1) to-(--cx-blob-2) mix-blend-multiply" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Pass any `lucide-react` icon as `icon`. Use four in a `grid grid-cols-2 gap-[24px]`, with labels of up to about 4 words.

```tsx
function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={2} />
      <p className="text-[40px] leading-[1.3] font-bold">{children}</p>
    </div>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker.

```tsx
function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[40px]">
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[72px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase">
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.2] font-bold tracking-[0.1em] text-(--cx-muted) uppercase">
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
    <div className="flex flex-col gap-[28px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-extrabold tracking-[-0.04em] text-(--cx-accent) tabular-nums">
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
        'flex flex-col gap-[36px] rounded-[28px] p-[40px]',
        kind === 'do'
          ? 'border border-(--cx-rule) bg-(--cx-surface)'
          : 'border-[2px] border-dashed border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-bold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.75} />
        {kind === 'do' ? 'Keep' : 'Drop'}
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
}: {
  n: string
  title: string
  children: ReactNode
  last?: boolean
}) {
  return (
    <div className="flex gap-[36px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-full bg-(--cx-fg) font-(family-name:--cx-font-display) text-[40px] leading-none font-extrabold text-(--cx-bg)">
          {n}
        </span>
        {!last && <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold uppercase">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)">{children}</p>
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
          alt="A minimal desk with a laptop"
          className="h-[600px] w-full rounded-[32px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Workspace</Eyebrow>
          <Hero>Design with less</Hero>
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
          alt="An open notebook and a pen next to a plant"
          className="h-[520px] w-full rounded-[32px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On paper</Eyebrow>
          <Title>Sketch it first</Title>
          <Body>Ten rough sketches beat one polished guess.</Body>
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
          <Eyebrow>The kit</Eyebrow>
          <Title>Four pieces to define</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Palette}>Two core colours</IconCard>
          <IconCard icon={Type}>One typeface</IconCard>
          <IconCard icon={Eye}>A simple mark</IconCard>
          <IconCard icon={Heart}>Three values</IconCard>
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
    <Frame className="bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--cx-blob-2)_70%,transparent),transparent_45%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your brightest line goes here, short and sure.</Quote>
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
        <BigStat value="2" label="core colours are enough for most personal brands." />
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
          <Eyebrow>Edit ruthlessly</Eyebrow>
          <Title>Keep it simple</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Five fonts', 'A new look weekly', 'Trendy jargon']} />
          <CompareColumn kind="do" items={['One typeface', 'One look, always', 'Plain words']} />
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
          <Title>Brand in an afternoon</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Promise">
            Finish the sentence “I help…”.
          </Step>
          <Step n="2" title="Look">
            Pick two colours and one typeface.
          </Step>
          <Step n="3" title="Voice" last>
            Write three words for how you sound.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A fresh brand-studio explainer: bright paper, a soft wash of colour glowing up from one corner, heavy caps doing the talking and frosted cards holding the details. It should feel optimistic and approachable, never corporate. Hold the discipline: two glows in fixed positions, one deep accent, caps for display only, glass cards for every grouped item. Avoid saturated full-bleed colour, glows behind the headline, text in glow colours, hard shadows, more than two glows per slide, emoji, and dark photos (they turn muddy under the tint).

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <MetaBar left="Brand basics" right="Part 1" />
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Brand dictionary</Eyebrow>
        <Hero>Three parts of a lasting brand</Hero>
        <Body>Soft colour glows, heavy caps and glassy cards. Built for friendly explainers.</Body>
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
          <Title>What every brand needs</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="1">A promise you can say in one line.</Point>
          <Point n="2">A look people spot from afar.</Point>
          <Point n="3">A voice that sounds like you.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Soft Gradient · <Palette>**.
