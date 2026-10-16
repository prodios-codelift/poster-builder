---
name: Condensed Impact
description: Saturated violet page, tall Oswald uppercase headlines, concentric rings in the corner and a yellow tag pill. Loud, confident, poster-like.
mode: dark
---

# Condensed Impact

## Palette

One saturated colour floods every slide, white carries the type, and a single warm accent does the shouting. The accent fills the eyebrow tag and appears on at most one more device per slide (list numerals, the swipe arrow, step badges, the stat). Text on the accent always uses `on-accent`.

| Role      | Value                       | Notes                                                   |
| --------- | --------------------------- | ------------------------------------------------------- |
| bg        | `#3B1FA8`                   | ultraviolet page, every slide                           |
| fg        | `#FFFFFF`                   | headlines and list items (≈ 10:1 on bg)                 |
| accent    | `#FFD23F`                   | tag pill fill, numerals, step badges, stat              |
| muted     | `#D4CCF5`                   | body copy, footer, captions (≈ 7:1 on bg)               |
| on-accent | `#1A0F4D`                   | text on accent fills (≈ 12:1 on accent)                 |
| rule      | `rgba(255, 255, 255, 0.22)` | list hairlines, step connector, outlined compare column |
| surface   | `rgba(255, 255, 255, 0.09)` | icon cards, the "do" compare column                     |
| ring      | `rgba(255, 255, 255, 0.13)` | concentric rings in the top-right corner                |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Ultraviolet** unless the user picks another or their brand fits one better.

### Ultraviolet (default)

Studio demo: `Theme · Condensed Impact · Ultraviolet` (`theme-condensed-impact--ultraviolet`).

```tsx
  '--cx-bg': '#3B1FA8',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFD23F',
  '--cx-muted': '#D4CCF5',
  '--cx-on-accent': '#1A0F4D',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
```

### Royal Blue

Studio demo: `Theme · Condensed Impact · Royal Blue` (`theme-condensed-impact--royal-blue`).

```tsx
  '--cx-bg': '#1E3FD8',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFD23F',
  '--cx-muted': '#C9D3FA',
  '--cx-on-accent': '#0B1A5C',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
```

### Deep Teal

Studio demo: `Theme · Condensed Impact · Deep Teal` (`theme-condensed-impact--deep-teal`).

```tsx
  '--cx-bg': '#0E5E5A',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFC857',
  '--cx-muted': '#BFE3DF',
  '--cx-on-accent': '#0B2E2C',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame` and `Rings` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#3B1FA8',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFD23F',
  '--cx-muted': '#D4CCF5',
  '--cx-on-accent': '#1A0F4D',
  '--cx-rule': 'rgba(255, 255, 255, 0.22)',
  '--cx-surface': 'rgba(255, 255, 255, 0.09)',
  '--cx-ring': 'rgba(255, 255, 255, 0.13)',
  '--cx-font-display': "'Oswald', 'Arial Narrow', sans-serif",
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
        <Rings />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Rings() {
  return (
    <div className="pointer-events-none absolute -top-[300px] -right-[300px] size-[760px] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_44px,var(--cx-ring)_44px_50px)]" />
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Oswald', 'Arial Narrow', sans-serif`. Loaded weights are **500 and 700**: 700 (`font-bold`) for hero, titles, numerals and the stat; 500 (`font-medium`) for quotes. Display text is always uppercase.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700–800 for list items, labels, the tag and the footer.
- Manrope is loaded globally; Oswald (500, 700) was added to the Google Fonts `@import` on line 1 of `src/styles.css` with this theme.
- Type scale: hero 150 px / 1.0 / uppercase (Oswald width ≈ 0.40, so ≈ 15 chars per line, ≤ 3 lines, ≤ 8 words); title 96 px / 1.05 / uppercase (≈ 23 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; list item 42 px / 1.35 / 700 with a 64 px Oswald numeral; eyebrow tag 26 px / 1.2 / 800, 0.14em tracking, uppercase, on an accent pill; quote 84 px / 1.12 / Oswald 500 uppercase; footer 26 px / 1.3 / 700, muted.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px. `Frame` draws `Rings` behind the content and wraps children in their own relative layer.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px**.
- Left-aligned, single column. Cover and CTA slides centre their content vertically; `PhotoCover` bottom-aligns it.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between the tag and the title, 64 px from the title block to a list, 40 px between list rows, 24 px between cards.
- Lists are rows on `rule` hairlines with big accent numerals. Cards are `surface` panels with `rounded-[24px]`.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. Caps are for display type, the tag and labels; body copy stays sentence case.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer    | Source                                  |
| ----------- | --------------- | --------------------------------------- |
| `cover.jpg` | Cord Allman     | https://unsplash.com/photos/sURVyRQllFQ |
| `split.jpg` | Amonwat Dumkrut | https://unsplash.com/photos/u6RJY5F3yM8 |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with extra contrast, then `bg` laid over with `mix-blend-screen`: shadows become the page colour and highlights stay white, so the photo reads as a two-tone print in the active palette.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom third fades to solid `bg`, so the tag, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour. Because `Frame` wraps content in its own layer, `PhotoBackdrop` uses negative insets to reach the slide edges. Inline photos use `rounded-[24px]`.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { ArrowRight, Check, Ear, Hand, type LucideIcon, Mic, Timer, X } from 'lucide-react'
```

**Background.** `Rings` is part of every `Frame`; don't move or add more. `QuoteSlide` passes `className="bg-[linear-gradient(160deg,var(--cx-bg)_40%,color-mix(in_oklab,var(--cx-bg)_70%,black)_100%)]"` to `Frame`: a deeper diagonal shade behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow (tag pill)

The accent pill above every title. Two or three words.

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="self-start rounded-[8px] bg-(--cx-accent) px-[20px] py-[10px] text-[26px] leading-[1.2] font-extrabold tracking-[0.14em] text-(--cx-on-accent) uppercase">
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[150px] leading-[1.0] font-bold tracking-[-0.005em] uppercase">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[96px] leading-[1.05] font-bold uppercase">
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

### Point (numbered list row)

```tsx
function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[64px] shrink-0 font-(family-name:--cx-font-display) text-[64px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[42px] leading-[1.35] font-bold">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <div className="flex items-center gap-[20px]">
      <p className="text-[30px] leading-[1.3] font-bold tracking-[0.14em] uppercase">Swipe</p>
      <span className="flex size-[64px] items-center justify-center rounded-full border-[3px] border-(--cx-accent) text-(--cx-accent)">
        <ArrowRight className="size-[32px]" strokeWidth={2.5} />
      </span>
    </div>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. The circle shows the initials.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[52px] leading-none font-bold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-bold uppercase">
          {AUTHOR.name}
        </p>
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
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="font-(family-name:--cx-font-display) tracking-[0.08em] tabular-nums">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.25]" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-screen" />
    </div>
  )
}
```

### PhotoBackdrop (full-bleed cover photo)

Place it first inside `<Frame>`. It sits behind the content at `-z-10` (Frame is `isolate`) and fades into `bg` so text stays readable. Keep text in the bottom half.

```tsx
function PhotoBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute -inset-x-[96px] -top-[112px] -bottom-[72px] -z-10">
      <Photo src={src} alt="" className="size-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_34%,color-mix(in_oklab,var(--cx-bg)_60%,transparent)_60%,transparent_88%)]" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Pass any `lucide-react` icon as `icon`. Use four in a `grid grid-cols-2 gap-[24px]`, with labels of up to about 4 words.

```tsx
function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[24px] bg-(--cx-surface) p-[40px]">
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
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[84px] leading-[1.12] font-medium uppercase">
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-bold tracking-[0.14em] text-(--cx-muted) uppercase">
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
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold text-(--cx-accent) tabular-nums">
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
        kind === 'do' ? 'bg-(--cx-surface)' : 'border-[3px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[40px] leading-[1.1] font-bold uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[40px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : "Don't"}
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
        <span className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none font-bold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[4px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.05] font-bold uppercase">
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
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>On stage</Eyebrow>
        <Hero>Bring the energy</Hero>
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
        <Photo
          src={splitPhoto}
          alt="A speaker talking into a microphone on stage"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Rehearsal</Eyebrow>
          <Title>Practise standing up</Title>
          <Body>Your voice changes the moment you stand.</Body>
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
          <Eyebrow>Your toolkit</Eyebrow>
          <Title>Four habits of calm speakers</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Mic}>Test the mic early</IconCard>
          <IconCard icon={Timer}>Cut it to time</IconCard>
          <IconCard icon={Ear}>Pause after questions</IconCard>
          <IconCard icon={Hand}>Use open hands</IconCard>
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
    <Frame className="bg-[linear-gradient(160deg,var(--cx-bg)_40%,color-mix(in_oklab,var(--cx-bg)_70%,black)_100%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your boldest line goes here, short and loud.</Quote>
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
        <BigStat value="3" label="rehearsals out loud before any talk that matters." />
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
          <Eyebrow>Openers</Eyebrow>
          <Title>The first thirty seconds</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Thank the hosts', 'Read the agenda', 'Apologise first']}
          />
          <CompareColumn kind="do" items={['Ask a question', 'Tell a story', 'State the point']} />
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
          <Title>Build a talk in a day</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Outline">
            Write the one sentence you want remembered.
          </Step>
          <Step n="2" title="Draft">
            Add three stories that prove it.
          </Step>
          <Step n="3" title="Rehearse" last>
            Run it out loud, then cut a third.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A gig poster for business advice: one saturated colour wall to wall, tall condensed capitals stacked like a headline on a flyer, and a single yellow tag that tells you what you're reading. It should feel energetic and certain. Hold the discipline: one flood colour, one accent, Oswald for display only, Manrope for everything you actually read. Avoid lowercase display type, more than one accent, gradients beyond the one quote-slide shade, drop shadows, emoji, centred body copy, extra ring clusters, and body text in white at full weight (keep it muted).

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Speaking tips</Eyebrow>
        <Hero>Own the room in five minutes</Hero>
        <Body>Tall type, loud colour and one yellow tag. Built for bold, punchy advice.</Body>
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
          <Eyebrow>The basics</Eyebrow>
          <Title>Three rules for any talk</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Open with the point, not the agenda.</Point>
          <Point n="2">One idea per slide behind you.</Point>
          <Point n="3">End on what they should do next.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Condensed Impact · <Palette>**.
