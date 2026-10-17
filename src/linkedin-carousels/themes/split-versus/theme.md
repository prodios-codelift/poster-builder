---
name: Split Versus
description: Slides split into a dark half and a light band, a round VS badge on the seam, heavy Inter Tight caps on both sides. Made for this-vs-that and mindset posts.
mode: dark
---

# Split Versus

## Palette

Two tones do the work: a dark page for the old way and a light band for the new way. The accent fills the VS badge, number tiles, the swipe pill and the stat, always with `on-accent` text. Accent text is used only on the dark page (eyebrow, quote mark, stat), never on the band.

| Role       | Value                       | Notes                                              |
| ---------- | --------------------------- | -------------------------------------------------- |
| bg         | `#14213D`                   | dark half / page                                   |
| fg         | `#FFFFFF`                   | text on the dark page (≈ 16:1)                     |
| accent     | `#3DDC97`                   | VS badge, tiles, pill, eyebrow, stat (≈ 9:1 on bg) |
| muted      | `#B4BED0`                   | body and footer on the dark page (≈ 8.5:1)         |
| on-accent  | `#0B1A33`                   | text on accent fills                               |
| band       | `#F4F5F7`                   | the light half, icon cards, photo highlights       |
| band-fg    | `#14213D`                   | text on the band (≈ 14:1)                          |
| band-muted | `#4A5568`                   | secondary text on the band (≈ 7:1)                 |
| rule       | `rgba(255, 255, 255, 0.18)` | hairlines and connectors on the dark page          |
| band-rule  | `rgba(20, 33, 61, 0.14)`    | hairlines on the band                              |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Navy & White** unless the user picks another or their brand fits one better.

### Navy & White (default)

Studio demo: `Theme · Split Versus · Navy & White` (`theme-split-versus--navy-white`).

```tsx
  '--cx-bg': '#14213D',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#3DDC97',
  '--cx-muted': '#B4BED0',
  '--cx-on-accent': '#0B1A33',
  '--cx-band': '#F4F5F7',
  '--cx-band-fg': '#14213D',
  '--cx-band-muted': '#4A5568',
  '--cx-rule': 'rgba(255, 255, 255, 0.18)',
  '--cx-band-rule': 'rgba(20, 33, 61, 0.14)',
```

### Black & Lime

Studio demo: `Theme · Split Versus · Black & Lime` (`theme-split-versus--black-lime`).

```tsx
  '--cx-bg': '#111111',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#D4FF3F',
  '--cx-muted': '#ADADAD',
  '--cx-on-accent': '#111111',
  '--cx-band': '#F2F2EE',
  '--cx-band-fg': '#111111',
  '--cx-band-muted': '#555555',
  '--cx-rule': 'rgba(255, 255, 255, 0.18)',
  '--cx-band-rule': 'rgba(17, 17, 17, 0.14)',
```

### Plum & Cream

Studio demo: `Theme · Split Versus · Plum & Cream` (`theme-split-versus--plum-cream`).

```tsx
  '--cx-bg': '#3E1F47',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#FFB86B',
  '--cx-muted': '#CDB8D3',
  '--cx-on-accent': '#3E1F47',
  '--cx-band': '#F7EFE3',
  '--cx-band-fg': '#3E1F47',
  '--cx-band-muted': '#6B5A6F',
  '--cx-rule': 'rgba(255, 255, 255, 0.18)',
  '--cx-band-rule': 'rgba(62, 31, 71, 0.14)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame`, `Band` and `VsBadge` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#14213D',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#3DDC97',
  '--cx-muted': '#B4BED0',
  '--cx-on-accent': '#0B1A33',
  '--cx-band': '#F4F5F7',
  '--cx-band-fg': '#14213D',
  '--cx-band-muted': '#4A5568',
  '--cx-rule': 'rgba(255, 255, 255, 0.18)',
  '--cx-band-rule': 'rgba(20, 33, 61, 0.14)',
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
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}

function Band({ from }: { from: number }) {
  return <div className="absolute inset-x-0 bottom-0 -z-10 bg-(--cx-band)" style={{ top: from }} />
}

function VsBadge({ at, label = 'VS' }: { at: number; label?: string }) {
  return (
    <span
      className="absolute left-1/2 flex size-[136px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[10px] border-(--cx-bg) bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)"
      style={{ top: at }}
    >
      {label}
    </span>
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Inter Tight', system-ui, sans-serif`. 800 (`font-extrabold`), always uppercase, slight negative tracking.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700–800 for list items, labels and the footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 120 px / 1.0 / -0.02em uppercase (caps width ≈ 0.60, so ≈ 12 chars per line, ≤ 2 lines per half, ≤ 4 words per half); title 84 px / 1.05 uppercase (≈ 17 chars per line, ≤ 3 lines); compare item 52 px / 1.1 uppercase; body 40 px / 1.45 / 500; list item 40 px / 1.35 / 700 with a 72 px accent tile; eyebrow 28 px / 1.2 / 800, 0.16em tracking; footer 26 px / 1.3 / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px**.
- **Split slides** (Cover, Compare, Closer): `<Band from={y} />` paints the light half from `y` px down to the slide bottom; `<VsBadge at={y} />` sits centred on the seam. Put the seam between 675 and 720. The top half is a fixed-height block (`h-[…]`, ending about 48 px above the seam) with its content bottom-aligned; the bottom half starts with at least 96 px of top padding so nothing touches the badge. Text in the bottom half uses `text-(--cx-band-fg)`, `Body tone="band"` and `Footer tone="band"`.
- **Plain slides** (everything else) are the dark page only. They use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density.
- Gaps: 32 px between eyebrow and title, 64 px from the title block to a list, 40 px between list rows, 24 px between cards.
- The old / wrong side is always on top (dark), the new / right side always below (band). Never flip them within a carousel.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. All display text is caps; body copy stays sentence case.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer      | Source                                  |
| ----------- | ----------------- | --------------------------------------- |
| `cover.jpg` | servet photograph | https://unsplash.com/photos/NAWantq3820 |
| `split.jpg` | Cabbie Kqwi       | https://unsplash.com/photos/Jh14Mk3U_ws |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone in the two halves' colours: grayscale, `band` multiplied over it (highlights), then `bg` lightened over it (shadows).

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop` (`absolute inset-0 -z-10`); the bottom third fades to solid `bg`, so the eyebrow, hero and pill sit bottom-aligned (`justify-end`) over flat colour. Inline photos use `rounded-[24px]`.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ListChecks,
  type LucideIcon,
  Repeat,
  Target,
  X,
} from 'lucide-react'
```

**Background.** `QuoteSlide` passes `className="bg-[repeating-linear-gradient(90deg,transparent_0_134px,var(--cx-rule)_134px_136px)]"` to `Frame`: faint vertical columns behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="text-[28px] leading-[1.2] font-extrabold tracking-[0.16em] text-(--cx-accent) uppercase"
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
      className="font-(family-name:--cx-font-display) text-[120px] leading-[1.0] font-extrabold tracking-[-0.02em] uppercase"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[84px] leading-[1.05] font-extrabold tracking-[-0.015em] uppercase"
      {...slide}
    >
      {children}
    </h2>
  )
}
```

### Body

`tone="band"` when it sits on the light half.

```tsx
function Body({
  children,
  tone = 'dark',
  ...slide
}: { children: ReactNode; tone?: 'dark' | 'band' } & SlideProps) {
  return (
    <p
      className={cn(
        'text-[40px] leading-[1.45] font-medium',
        tone === 'dark' ? 'text-(--cx-muted)' : 'text-(--cx-band-muted)',
      )}
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Point (numbered list row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[16px] bg-(--cx-accent) font-(family-name:--cx-font-display) text-[40px] leading-none font-extrabold text-(--cx-on-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### SwipeCue (cover only)

An accent pill; readable on either half.

```tsx
function SwipeCue() {
  return (
    <p className="flex items-center gap-[14px] self-start rounded-full bg-(--cx-accent) px-[32px] py-[14px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] text-(--cx-on-accent) uppercase">
      Swipe
      <ArrowRight className="size-[32px]" strokeWidth={3} />
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. It is styled for the light band, so place it in the bottom half.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px] text-(--cx-band-fg)">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-band-fg) font-(family-name:--cx-font-display) text-[48px] leading-none font-extrabold text-(--cx-band)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase">
          {AUTHOR.name}
        </p>
        <p className="text-[32px] leading-[1.3] font-bold text-(--cx-band-muted)">
          {AUTHOR.handle}
        </p>
      </div>
    </div>
  )
}
```

### Footer

`tone="band"` on split slides, where the footer sits on the light half.

```tsx
function Footer({
  page,
  total,
  tone = 'dark',
}: {
  page: number
  total: number
  tone?: 'dark' | 'band'
}) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div
      className={cn(
        'mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold',
        tone === 'dark' ? 'text-(--cx-muted)' : 'text-(--cx-band-muted)',
      )}
    >
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
      <div className="absolute inset-0 bg-(--cx-band) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-bg) mix-blend-lighten" />
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
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_36%,color-mix(in_oklab,var(--cx-bg)_60%,transparent)_62%,transparent_90%)]" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Light band cards on the dark page. Use four in a `grid grid-cols-2 gap-[24px]`, with labels of up to about 4 words.

```tsx
function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] rounded-[24px] bg-(--cx-band) p-[40px] text-(--cx-band-fg)">
      <Icon className="size-[72px]" strokeWidth={2.25} />
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
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[76px] leading-[1.1] font-extrabold tracking-[-0.015em] uppercase"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[30px] leading-[1.3] font-bold text-(--cx-muted)">
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
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-extrabold tracking-[-0.04em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}
```

### CompareColumn (old way / new way)

On a split slide: `kind="dont"` in the top half, `kind="do"` in the bottom half, three items each (≤ 20 characters, set as caps).

```tsx
function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div className={cn('flex flex-col gap-[24px]', kind === 'do' && 'text-(--cx-band-fg)')}>
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.16em] uppercase',
          kind === 'do' ? 'text-(--cx-band-muted)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Instead' : 'Stop'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold tracking-[-0.01em] uppercase"
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
        <span className="flex size-[80px] shrink-0 items-center justify-center rounded-[18px] bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[4px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.05] font-extrabold uppercase">
          {title}
        </p>
        <p className="text-[40px] leading-[1.4] font-medium text-(--cx-muted)" {...slide}>
          {children}
        </p>
      </div>
    </div>
  )
}
```

## Slide recipes

The demo has ten slides: Cover, PhotoCover, Content (list), ImageSplit, IconGrid, QuoteSlide, StatSlide, Compare, Steps, Closer. Cover, Content and Closer are under Example usage. The other seven are below, verbatim. Mix them to vary the rhythm of a carousel: an alternate cover, a photo break every few slides, then a grid, quote, stat, comparison or steps where the content fits. Use a split slide at most every third slide so the seam keeps its punch. Change the copy and the `page` / `total` numbers, never the structure. Quotes, stats and examples must come from the user's material.

### PhotoCover (alternate cover)

Use as the first slide instead of `Cover` when the topic has a fitting photo.

```tsx
function PhotoCover() {
  return (
    <Frame>
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>Strategy</Eyebrow>
        <Hero>Play the long game</Hero>
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
          alt="A dirt road splitting into two paths"
          className="h-[520px] w-full rounded-[24px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Choices</Eyebrow>
          <Title>Pick a lane</Title>
          <Body>Every yes to one path is a no to another.</Body>
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
          <Eyebrow>The system</Eyebrow>
          <Title>Four parts of a routine</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Target}>One clear goal</IconCard>
          <IconCard icon={CalendarCheck}>A fixed time</IconCard>
          <IconCard icon={ListChecks}>A short checklist</IconCard>
          <IconCard icon={Repeat}>A weekly review</IconCard>
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
    <Frame className="bg-[repeating-linear-gradient(90deg,transparent_0_134px,var(--cx-rule)_134px_136px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest contrast goes here, in one line.</Quote>
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
        <BigStat value="2" label="minutes is the right size for a new habit's first step." />
      </div>
      <Footer page={7} total={10} />
    </Frame>
  )
}
```

### Compare (split slide)

The old way above the seam, the new way below, with the VS badge between.

```tsx
function Compare() {
  return (
    <Frame>
      <Band from={720} />
      <VsBadge at={720} />
      <div className="flex flex-1 flex-col">
        <div className="flex h-[560px] flex-col gap-[40px]">
          <div className="flex flex-col gap-[24px]">
            <Eyebrow>Monday morning</Eyebrow>
            <Title>Old way</Title>
          </div>
          <CompareColumn
            kind="dont"
            items={['Wait to feel ready', 'Plan the whole year', 'Start from zero']}
          />
        </div>
        <div className="pt-[96px]">
          <CompareColumn
            kind="do"
            items={['Start before ready', 'Plan one week', 'Reuse last week']}
          />
        </div>
      </div>
      <Footer page={8} total={10} tone="band" />
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
          <Title>Build it in a week</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Choose">
            Pick one habit you can do daily.
          </Step>
          <Step n="2" title="Anchor">
            Attach it to something you already do.
          </Step>
          <Step n="3" title="Review" last>
            Check the streak every Sunday.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A boxing-poster face-off for ideas: two flat tones meeting at a hard horizontal seam, a round badge where they collide, and heavy caps on both sides. It should feel decisive, as if the answer is obvious once you see both sides. Hold the discipline: two tones plus one accent, the dark side always on top, caps for display only, one seam per split slide. Avoid diagonal or wavy seams, gradients, more than one badge, accent text on the light band, emoji, and centred body copy.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <Band from={675} />
      <VsBadge at={675} />
      <div className="flex flex-1 flex-col">
        <div className="flex h-[515px] flex-col justify-end gap-[32px] pb-[72px]">
          <Eyebrow>Mindset</Eyebrow>
          <Hero>Wait for motivation</Hero>
        </div>
        <div className="flex flex-col gap-[32px] pt-[120px] text-(--cx-band-fg)">
          <Hero>Build a system</Hero>
          <Body tone="band">Two tones, one big contrast.</Body>
          <SwipeCue />
        </div>
      </div>
      <Footer page={1} total={10} tone="band" />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The shift</Eyebrow>
          <Title>Three habits that beat willpower</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Decide the night before.</Point>
          <Point n="2">Make the first step tiny.</Point>
          <Point n="3">Track streaks, not results.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Split Versus · <Palette>**.
