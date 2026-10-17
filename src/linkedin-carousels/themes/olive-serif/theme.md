---
name: Olive Serif
description: Deep olive page, cream Instrument Serif headlines with a sand italic word, arch photos and outlined pill cues. Calm, warm, wellness-coach elegant.
mode: dark
---

# Olive Serif

## Palette

An earthy dark page with cream type. The accent is a soft sand used for the one italic word in a headline, the eyebrow and thin outlines. Each slide uses it for the eyebrow, the italic emphasis and at most one more device (numerals, icons, step rings, the stat).

| Role    | Value                       | Notes                                                  |
| ------- | --------------------------- | ------------------------------------------------------ |
| bg      | `#3A4029`                   | olive page, every slide                                |
| fg      | `#F2EDE1`                   | headlines and list items (≈ 9:1 on bg)                 |
| accent  | `#D9C9A3`                   | italic emphasis, eyebrow, numerals, outlines (≈ 6.5:1) |
| muted   | `#C2BDA8`                   | body copy, footer, captions (≈ 5.7:1)                  |
| rule    | `rgba(242, 237, 225, 0.28)` | hairlines, pill and card outlines, quote ring          |
| surface | `rgba(242, 237, 225, 0.07)` | the "do" compare column                                |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Olive** unless the user picks another or their brand fits one better.

### Olive (default)

Studio demo: `Theme · Olive Serif · Olive` (`theme-olive-serif--olive`).

```tsx
  '--cx-bg': '#3A4029',
  '--cx-fg': '#F2EDE1',
  '--cx-accent': '#D9C9A3',
  '--cx-muted': '#C2BDA8',
  '--cx-rule': 'rgba(242, 237, 225, 0.28)',
  '--cx-surface': 'rgba(242, 237, 225, 0.07)',
```

### Forest

Studio demo: `Theme · Olive Serif · Forest` (`theme-olive-serif--forest`).

```tsx
  '--cx-bg': '#1F3A2E',
  '--cx-fg': '#F0EEE4',
  '--cx-accent': '#E3C68C',
  '--cx-muted': '#B9C4B6',
  '--cx-rule': 'rgba(240, 238, 228, 0.28)',
  '--cx-surface': 'rgba(240, 238, 228, 0.07)',
```

### Espresso

Studio demo: `Theme · Olive Serif · Espresso` (`theme-olive-serif--espresso`).

```tsx
  '--cx-bg': '#3B2A22',
  '--cx-fg': '#F4ECE2',
  '--cx-accent': '#E0B48A',
  '--cx-muted': '#C9B8A8',
  '--cx-rule': 'rgba(244, 236, 226, 0.28)',
  '--cx-surface': 'rgba(244, 236, 226, 0.07)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#3A4029',
  '--cx-fg': '#F2EDE1',
  '--cx-accent': '#D9C9A3',
  '--cx-muted': '#C2BDA8',
  '--cx-rule': 'rgba(242, 237, 225, 0.28)',
  '--cx-surface': 'rgba(242, 237, 225, 0.07)',
  '--cx-font-display': "'Instrument Serif', Georgia, serif",
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

- Display: `var(--cx-font-display)` → `'Instrument Serif', Georgia, serif`. Loaded as **400 and 400 italic only**, never bold. Upright for headlines, italic (through `Em`) for one emphasised word or phrase, quotes and numerals.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 600 for list items, labels and the footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 140 px / 1.0 / -0.02em (Instrument Serif width ≈ 0.40, so ≈ 16 chars per line, ≤ 3 lines, ≤ 8 words); title 92 px / 1.05 / -0.015em (≈ 24 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; list item 40 px / 1.35 / 600 with a 60 px italic numeral; eyebrow 26 px / 1.2 / 600, uppercase, 0.26em tracking; quote 80 px / 1.1 italic; footer 26 px / 1.3 / 600, muted.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px with its hairline; keep 48 px clear above it, so the content budget is roughly **1054 px**.
- Left-aligned, single column. Cover and CTA slides centre their content vertically; `PhotoCover` bottom-aligns it.
- Content slides use **one alignment for the whole carousel**: vertically centred for minimal density (the theme's natural mood), top-aligned for standard density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 64 px from the title block to a list, 40 px between list rows, 24 px between cards.
- Every title gets at most one `<Em>` phrase. Cards are outlined (`rule`), not filled, with `rounded-[28px]`. Photos use an arch (`rounded-t-[444px]` at full width) or a circle.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. Caps only for the eyebrow, pill and labels.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer      | Source                                  |
| ----------- | ----------------- | --------------------------------------- |
| `cover.jpg` | Kristián Pospiš   | https://unsplash.com/photos/A6tRBuEzblw |
| `split.jpg` | Monika Grabkowska | https://unsplash.com/photos/pege1BFGPPc |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: grayscale, then `fg` multiplied over it (highlights turn cream) and `bg` lightened over it (shadows turn olive). The photo reads as a soft print in the page colours and follows the palette.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop` (`absolute inset-0 -z-10`); the bottom third fades to solid `bg`, so the eyebrow, hero and pill sit bottom-aligned (`justify-end`) over flat colour. `ImageSplit` uses the arch crop.

**Icons.** Import only the icons the carousel uses from `lucide-react`, thin strokes (1.5), for example:

```tsx
import { ArrowRight, Check, Droplets, Leaf, type LucideIcon, Moon, Sun, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes `className="bg-[radial-gradient(circle_at_50%_46%,transparent_0_400px,var(--cx-rule)_400px_402px,transparent_402px)]"` to `Frame`: one thin ring behind the quote. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="text-[26px] leading-[1.2] font-semibold tracking-[0.26em] text-(--cx-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Em (italic emphasis)

Wrap one word or short phrase of a hero or title.

```tsx
function Em({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <em className="text-(--cx-accent) italic" {...slide}>
      {children}
    </em>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[140px] leading-[1.0] font-normal tracking-[-0.02em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[92px] leading-[1.05] font-normal tracking-[-0.015em]">
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

### Point (numbered list row)

Use roman numerals (`i.`, `ii.`, `iii.`) or plain digits, one style per carousel.

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[60px] leading-none text-(--cx-accent) italic">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### SwipeCue (outlined pill)

The outlined pill with a long arrow line. Cover slides only.

```tsx
function SwipeCue() {
  return (
    <div className="flex items-center gap-[24px] self-start rounded-full border-[2px] border-(--cx-rule) py-[16px] pr-[28px] pl-[36px]">
      <p className="text-[28px] leading-[1.2] font-semibold tracking-[0.2em] uppercase">Swipe</p>
      <span className="h-[2px] w-[140px] bg-(--cx-fg)" />
      <ArrowRight className="-ml-[30px] size-[36px]" strokeWidth={1.75} />
    </div>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. The ring shows the initials.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[128px] shrink-0 items-center justify-center rounded-full border-[2px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[60px] leading-none text-(--cx-accent) italic">
        {initials}
      </span>
      <div className="flex flex-col gap-[4px]">
        <p className="font-(family-name:--cx-font-display) text-[64px] leading-[1.05]">
          {AUTHOR.name}
        </p>
        <p className="text-[30px] leading-[1.3] font-semibold tracking-[0.04em] text-(--cx-muted)">
          {AUTHOR.handle}
        </p>
      </div>
    </div>
  )
}
```

### Footer

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] text-[26px] leading-[1.3] font-semibold tracking-[0.08em] text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="tabular-nums">
        {page} of {total}
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
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-multiply" />
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
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_34%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_62%,transparent_90%)]" />
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
    <div className="flex flex-col gap-[36px] rounded-[28px] border-[2px] border-(--cx-rule) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={1.5} />
      <p className="text-[40px] leading-[1.3] font-semibold" {...slide}>
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
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.6] text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[80px] leading-[1.1] tracking-[-0.01em] italic"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[26px] leading-[1.2] font-semibold tracking-[0.26em] text-(--cx-muted) uppercase">
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
    <div className="flex flex-col gap-[24px]">
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] tracking-[-0.03em] text-(--cx-accent) tabular-nums">
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
        'flex flex-col gap-[36px] rounded-[28px] p-[40px]',
        kind === 'do' ? 'bg-(--cx-surface)' : 'border-[2px] border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-semibold tracking-[0.22em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2} />
        {kind === 'do' ? 'Gently' : 'Not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[38px] leading-[1.35] font-semibold',
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
        <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full border-[2px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none text-(--cx-accent) italic">
          {n}
        </span>
        {!last && <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[52px]')}>
        <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.05]">{title}</p>
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
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>At home</Eyebrow>
        <Hero>
          Make room to <Em>breathe</Em>
        </Hero>
        <SwipeCue />
      </div>
      <Footer page={2} total={10} />
    </Frame>
  )
}
```

### ImageSplit (arch photo + idea)

A photo break between text slides, cropped as an arch. One-line body.

```tsx
function ImageSplit() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[48px]">
        <Photo
          src={splitPhoto}
          alt="A bowl of oats on a wooden table"
          className="h-[540px] w-full rounded-t-[444px]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Mornings</Eyebrow>
          <Title>
            Start <Em>unhurried</Em>
          </Title>
          <Body>Breakfast at the table, not at the desk.</Body>
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
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Four things to <Em>protect</Em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Sun}>Morning light</IconCard>
          <IconCard icon={Droplets}>Water first</IconCard>
          <IconCard icon={Leaf}>Time outdoors</IconCard>
          <IconCard icon={Moon}>A set bedtime</IconCard>
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
    <Frame className="bg-[radial-gradient(circle_at_50%_46%,transparent_0_400px,var(--cx-rule)_400px_402px,transparent_402px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your gentlest line goes here, in your own words.</Quote>
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
        <BigStat value="10" label="quiet minutes a day is enough to start." />
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
          <Eyebrow>Evenings</Eyebrow>
          <Title>
            Wind down, <Em>kindly</Em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Scroll in bed', 'Late emails', 'Bright lights']} />
          <CompareColumn kind="do" items={['A paper book', 'Phone outside', 'Warm lamps']} />
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
          <Eyebrow>Begin here</Eyebrow>
          <Title>
            A <Em>gentle</Em> reset
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Notice">
            Write down when you feel rushed.
          </Step>
          <Step n="2" title="Remove">
            Drop one thing from that hour.
          </Step>
          <Step n="3" title="Replace" last>
            Fill the gap with something slow.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A boutique wellness studio's printed menu: deep olive stock, a gentle high-contrast serif with one word turned italic, thin outlines and plenty of air. It should feel calm, warm and personal, never clinical. Hold the discipline: one earthy page colour, one sand accent, a single italic phrase per headline, thin strokes everywhere. Avoid bold serif (it isn't loaded), filled accent blocks, bright or saturated colours, heavy icons, drop shadows, emoji, and stacking more than one italic phrase in a title.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Wellness notes</Eyebrow>
        <Hero>
          Four ways to <Em>slow down</Em>
        </Hero>
        <Body>Deep olive, a soft serif and quiet cream type. Built for calm, personal posts.</Body>
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
          <Eyebrow>The practice</Eyebrow>
          <Title>
            Three small <Em>daily</Em> rituals
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="i.">Ten minutes outside before your phone.</Point>
          <Point n="ii.">One slow meal without a screen.</Point>
          <Point n="iii.">Lights low an hour before bed.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Olive Serif · <Palette>**.
