---
name: Noir Luxe
description: Black page, Instrument Serif display with metallic italic emphasis, spaced-caps Manrope labels. Elegant personal-brand luxury.
mode: dark
---

# Noir Luxe

## Palette

Warm off-white on black, with one metallic accent used like gilt: the eyebrow and its rule, italic emphasis words (`<em>`), list numerals and the swipe cue. Fine accent-tinted rules separate rows.

| Role   | Value                       | Notes                                             |
| ------ | --------------------------- | ------------------------------------------------- |
| bg     | `#0C0C0C`                   | black stock, every slide                          |
| fg     | `#F3EDE2`                   | headlines and body                                |
| accent | `#CBB389`                   | eyebrow + rule, `<em>` words, numerals, swipe cue |
| muted  | `#968F84`                   | footer, handle (≥ 5:1 on bg)                      |
| rule   | `rgba(203, 179, 137, 0.32)` | accent hairlines under rows and above the author  |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Champagne** unless the user picks another or their brand fits one better.

### Champagne (default)

Studio demo: `Theme · Noir Luxe · Champagne` (`theme-noir-luxe--champagne`).

```tsx
  '--cx-bg': '#0C0C0C',
  '--cx-fg': '#F3EDE2',
  '--cx-accent': '#CBB389',
  '--cx-muted': '#968F84',
  '--cx-rule': 'rgba(203, 179, 137, 0.32)',
```

### Bordeaux

Studio demo: `Theme · Noir Luxe · Bordeaux` (`theme-noir-luxe--bordeaux`).

```tsx
  '--cx-bg': '#170B0F',
  '--cx-fg': '#F5ECE8',
  '--cx-accent': '#D98A98',
  '--cx-muted': '#A08F93',
  '--cx-rule': 'rgba(217, 138, 152, 0.32)',
```

### Emerald Gold

Studio demo: `Theme · Noir Luxe · Emerald Gold` (`theme-noir-luxe--emerald-gold`).

```tsx
  '--cx-bg': '#0A1411',
  '--cx-fg': '#EFEADF',
  '--cx-accent': '#C8A45A',
  '--cx-muted': '#929B95',
  '--cx-rule': 'rgba(200, 164, 90, 0.32)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#0C0C0C',
  '--cx-fg': '#F3EDE2',
  '--cx-accent': '#CBB389',
  '--cx-muted': '#968F84',
  '--cx-rule': 'rgba(203, 179, 137, 0.32)',
  '--cx-font-display': "'Instrument Serif', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) px-[104px] pt-[120px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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

- Display: `'Instrument Serif', Georgia, serif`, a single 400 weight with a true italic (both loaded). Width factor ≈ 0.40, so it sets narrow and elegant. Never bold it.
- Body: `'Manrope', system-ui, sans-serif`, 500 for body, 600 for spaced-caps labels.
- Emphasis: wrap one or two words in `<em>` inside `Hero`/`Title`; they render italic in the accent.
- Type scale: hero 144 px / 0.98 / -0.02em (≈ 15 chars per line, ≤ 3 lines, ≤ 7 words); title 100 px / 1.02 (≈ 22 chars per line); body 38 px / 1.55; list item 38 px / 1.4 with a 56 px italic numeral; eyebrow 26 px / 600 uppercase, 0.32em tracking; footer 26 px uppercase, 0.2em.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 104 px left/right, 120 px top, 72 px bottom. Content width is 872 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1046 px**.
- Cover and CTA centre vertically. Content slides are top-aligned.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Lists are `Point` rows with lowercase roman numerals (`i.`, `ii.`, `iii.`) and a hairline below each row.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Spaced caps only for the eyebrow, handle and footer.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer           | Source                                  |
| ----------- | ---------------------- | --------------------------------------- |
| `cover.jpg` | Tim Kuhn               | https://unsplash.com/photos/GHrKMXCb1gs |
| `split.jpg` | Kier in Sight Archives | https://unsplash.com/photos/HXPUOdHuYoU |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with `accent` at 60% in `mix-blend-color`: a warm metallic tone (champagne, rosé or gold) that keeps deep blacks.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom ~30% fades to solid `bg`, so the eyebrow, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour. Product and texture photos (objects, materials) suit this theme better than people.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Crown, Diamond, Gem, type LucideIcon, Sparkle, X } from 'lucide-react'
```

**Background.** No extra background; black stock is the look.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Spaced caps followed by a hairline.

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-[24px]">
      <p className="text-[26px] leading-[1.2] font-semibold tracking-[0.32em] text-(--cx-accent) uppercase">
        {children}
      </p>
      <span className="h-px w-[96px] bg-(--cx-accent)" />
    </div>
  )
}
```

### Hero (cover only) and Title

Use `<em>` for the accent word.

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[144px] leading-[0.98] font-normal tracking-[-0.02em] [&_em]:text-(--cx-accent)">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[100px] leading-[1.02] font-normal tracking-[-0.015em] [&_em]:text-(--cx-accent)">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[38px] leading-[1.55] font-medium">{children}</p>
}
```

### Point (numbered row)

```tsx
function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[40px] border-b border-(--cx-rule) pb-[32px]">
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none text-(--cx-accent) italic">
        {n}
      </span>
      <p className="text-[38px] leading-[1.4] font-medium">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-display) text-[44px] leading-[1.2] text-(--cx-accent) italic">
      Swipe →
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  return (
    <div className="flex flex-col gap-[14px] border-t border-(--cx-rule) pt-[36px]">
      <p className="font-(family-name:--cx-font-display) text-[68px] leading-[1.05]">
        {AUTHOR.name}
      </p>
      <p className="text-[26px] leading-[1.3] font-semibold tracking-[0.24em] text-(--cx-muted) uppercase">
        {AUTHOR.handle}
      </p>
    </div>
  )
}
```

### Footer

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-semibold tracking-[0.2em] text-(--cx-muted) uppercase">
      <span>{AUTHOR.name}</span>
      <span className="tabular-nums">
        {pad(page)} — {pad(total)}
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
      <div className="absolute inset-0 bg-(--cx-accent) opacity-60 mix-blend-color" />
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
function IconCard({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[44px] border-t border-(--cx-rule) pt-[32px]">
      <Icon className="size-[80px] text-(--cx-accent)" strokeWidth={1.25} />
      <p className="font-(family-name:--cx-font-display) text-[60px] leading-[1.1]">{children}</p>
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
      <span className="font-(family-name:--cx-font-display) text-[200px] leading-[0.55] text-(--cx-accent)">
        “
      </span>
      <blockquote className="font-(family-name:--cx-font-display) text-[80px] leading-[1.08] italic">
        {children}
      </blockquote>
      <figcaption className="text-[26px] leading-[1.3] font-semibold tracking-[0.24em] text-(--cx-muted) uppercase">
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
      <p className="font-(family-name:--cx-font-display) text-[300px] leading-[0.85] text-(--cx-accent)">
        {value}
      </p>
      <p className="text-[40px] leading-[1.45] font-medium">{label}</p>
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
    <div className="flex flex-col gap-[40px] border-t border-(--cx-rule) pt-[32px]">
      <p
        className={cn(
          'flex items-center gap-[12px] text-[26px] leading-[1.2] font-semibold tracking-[0.28em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={1.5} />
        {kind === 'do' ? 'Refined' : 'Ordinary'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'font-(family-name:--cx-font-display) text-[52px] leading-[1.15]',
            kind === 'dont' && 'text-(--cx-muted)',
            kind === 'do' && 'italic',
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
  const numerals = ['i.', 'ii.', 'iii.', 'iv.', 'v.']
  return (
    <div
      className={cn(
        'flex items-baseline gap-[40px] border-b border-(--cx-rule) pt-[28px] pb-[56px]',
        last && 'border-b-0',
      )}
    >
      <span className="w-[72px] shrink-0 font-(family-name:--cx-font-display) text-[62px] leading-none text-(--cx-accent) italic">
        {numerals[Number(n) - 1] ?? n}
      </span>
      <div className="flex flex-col gap-[10px]">
        <p className="font-(family-name:--cx-font-display) text-[62px] leading-[1.05]">{title}</p>
        <p className="text-[40px] leading-[1.45] font-medium">{children}</p>
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
        <Eyebrow>The edit</Eyebrow>
        <Hero>
          Time, <em>well</em> spent
        </Hero>
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
        <Photo src={splitPhoto} alt="Black marble with white veins" className="h-[520px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Materials</Eyebrow>
          <Title>
            Choose <em>fewer</em>, better things
          </Title>
          <Body>Quality is what remains when everything else is removed.</Body>
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
          <Eyebrow>The pillars</Eyebrow>
          <Title>
            What makes it <em>lasting</em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Gem}>Material</IconCard>
          <IconCard icon={Crown}>Restraint</IconCard>
          <IconCard icon={Diamond}>Precision</IconCard>
          <IconCard icon={Sparkle}>Patience</IconCard>
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
        <Eyebrow>A standard</Eyebrow>
        <BigStat value="100" label="years is the horizon a classic is designed for." />
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
          <Eyebrow>The difference</Eyebrow>
          <Title>
            Loud versus <em>lasting</em>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Logos everywhere', 'Every trend', 'More options']} />
          <CompareColumn kind="do" items={['Quiet details', 'Timeless form', 'One choice']} />
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
          <Eyebrow>The practice</Eyebrow>
          <Title>
            How a brand <em>endures</em>
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Edit">
            Remove until it feels inevitable.
          </Step>
          <Step n="2" title="Refine">
            Return to it after a week away.
          </Step>
          <Step n="3" title="Repeat" last>
            Hold the standard every time.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A fashion-house lookbook or a private-bank letter: black, hushed, and expensive. The serif does the talking and the accent glints rather than shouts. Use generous spacing and few words. Avoid bold serif weights, more than two italic words per headline, bright colours, gradients, icons, emoji, rounded cards, and busy layouts.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Noir Luxe</Eyebrow>
        <Hero>
          Quiet work, <em>loud</em> results
        </Hero>
        <Body>
          Black stock, an elegant serif and a single metallic accent. Built for personal brands.
        </Body>
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
          <Eyebrow>The standard</Eyebrow>
          <Title>
            Three signs of <em>real</em> craft
          </Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Point n="i.">It looks simple from the outside.</Point>
          <Point n="ii.">Every detail has a reason.</Point>
          <Point n="iii.">Nothing is there to impress.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Noir Luxe · <Palette>**.
