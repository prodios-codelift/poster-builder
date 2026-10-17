---
name: Giant Numeral
description: White page, one huge red numeral bleeding off the left edge on the cover, tight Inter Tight headlines and big accent list numbers. Minimal, bold, listicle-ready.
mode: light
---

# Giant Numeral

## Palette

Black on white with a single signal colour. Numbers carry the accent: the giant cover numeral, list and step numbers, the stat and the current page. Beyond numbers, the accent appears only in the eyebrow and one small device (swipe arrow, icon, the "do" rule).

| Role      | Value                    | Notes                                          |
| --------- | ------------------------ | ---------------------------------------------- |
| bg        | `#FFFFFF`                | white page                                     |
| fg        | `#111111`                | headlines and list items (≈ 19:1)              |
| accent    | `#D92D20`                | numerals, eyebrow, stat, page number (≈ 4.9:1) |
| muted     | `#5C5C5C`                | body, footer, captions (≈ 6.7:1)               |
| on-accent | `#FFFFFF`                | initials on the accent avatar                  |
| tint      | `#F6F6F4`                | icon cards and the author chip                 |
| rule      | `rgba(17, 17, 17, 0.12)` | list and step hairlines, the "dont" rule       |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Signal Red** unless the user picks another or their brand fits one better.

### Signal Red (default)

Studio demo: `Theme · Giant Numeral · Signal Red` (`theme-giant-numeral--signal-red`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#D92D20',
  '--cx-muted': '#5C5C5C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-tint': '#F6F6F4',
  '--cx-rule': 'rgba(17, 17, 17, 0.12)',
```

### Cobalt

Studio demo: `Theme · Giant Numeral · Cobalt` (`theme-giant-numeral--cobalt`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0E1430',
  '--cx-accent': '#2340D9',
  '--cx-muted': '#596075',
  '--cx-on-accent': '#FFFFFF',
  '--cx-tint': '#F3F5FB',
  '--cx-rule': 'rgba(14, 20, 48, 0.12)',
```

### Tangerine

Studio demo: `Theme · Giant Numeral · Tangerine` (`theme-giant-numeral--tangerine`).

```tsx
  '--cx-bg': '#FFFCF8',
  '--cx-fg': '#1F1308',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#66594F',
  '--cx-on-accent': '#FFFFFF',
  '--cx-tint': '#FBF3EA',
  '--cx-rule': 'rgba(31, 19, 8, 0.12)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame` and `Numeral` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#111111',
  '--cx-accent': '#D92D20',
  '--cx-muted': '#5C5C5C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-tint': '#F6F6F4',
  '--cx-rule': 'rgba(17, 17, 17, 0.12)',
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

function Numeral({ value, className }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute -left-[150px] font-(family-name:--cx-font-display) text-[720px] leading-[0.8] font-extrabold tracking-[-0.06em] text-(--cx-accent) select-none',
        className,
      )}
    >
      {value}
    </span>
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Inter Tight', system-ui, sans-serif`. 800 (`font-extrabold`), tight negative tracking, sentence case.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700–800 for list items, labels and the footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: cover numeral 720 px / 0.8 (one digit only); hero 112 px / 1.0 / -0.035em in a 588 px column beside the numeral (≈ 11 chars per line, ≤ 4 lines, ≤ 8 words); title 84 px / 1.05 / -0.03em (≈ 22 chars per line, ≤ 3 lines); list and step numerals 112–120 px / 0.85; body 40 px / 1.45 / 500, muted; eyebrow 28 px / 1.2 / 800, 0.14em tracking, uppercase; footer 26 px / 1.3 / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px**.
- **Cover:** place `<Numeral value="…" className="top-[…]" />` first inside `Frame`; it sits at `-left-[150px]`, so about a third of the digit bleeds off the canvas. The content column gets `pl-[300px]` and is vertically centred. The numeral should be the carousel's count (3 tips → "3").
- Other slides are left-aligned, single column. The CTA slide centres its content vertically.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 56 px from the title block to the list, 36 px between list rows, 24 px between cards.
- Use the giant numeral once per carousel (the cover). Elsewhere numbers stay at list size.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. Caps only for the eyebrow and labels.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer | Source                                  |
| ----------- | ------------ | --------------------------------------- |
| `cover.jpg` | Tibor Pinter | https://unsplash.com/photos/pV74-1DVbUI |
| `split.jpg` | Aleš Čerin   | https://unsplash.com/photos/H2DwGkqZCMc |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with extra contrast, then `accent` laid over with `mix-blend-screen`: shadows turn signal-colour and highlights stay white, like a one-colour print. Square corners.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (600 px tall, square corners) with the eyebrow and hero below it. Text never sits on the photo.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import {
  ArrowRight,
  Check,
  Hash,
  type LucideIcon,
  Quote as QuoteIcon,
  Scissors,
  Target,
  X,
} from 'lucide-react'
```

**Background.** `QuoteSlide` passes `className="bg-[radial-gradient(circle_at_0%_50%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_55%)]"` to `Frame`: a faint accent wash from the left edge. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] text-(--cx-accent) uppercase"
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
      className="font-(family-name:--cx-font-display) text-[112px] leading-[1.0] font-extrabold tracking-[-0.035em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[84px] leading-[1.05] font-extrabold tracking-[-0.03em]"
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

### Point (big-number list row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[36px] border-t border-(--cx-rule) pt-[28px]">
      <span className="w-[96px] shrink-0 font-(family-name:--cx-font-display) text-[112px] leading-[0.85] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
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

```tsx
function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] text-[30px] leading-[1.3] font-extrabold">
      Swipe
      <ArrowRight className="size-[40px] text-(--cx-accent)" strokeWidth={3} />
    </p>
  )
}
```

### AuthorCard (closing slide)

The author chip for the closing slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
  return (
    <div className="flex items-center gap-[28px] self-start rounded-full bg-(--cx-tint) py-[20px] pr-[48px] pl-[20px]">
      <span className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
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

The current page number is in the accent.

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
      <span>{AUTHOR.handle}</span>
      <span className="tabular-nums">
        <span className="text-(--cx-accent)">{page}</span>/{total}
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-screen" />
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
    <div className="flex flex-col gap-[32px] rounded-[20px] bg-(--cx-tint) p-[40px]">
      <Icon className="size-[72px] text-(--cx-accent)" strokeWidth={2.25} />
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
      <span className="font-(family-name:--cx-font-display) text-[240px] leading-[0.6] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.12] font-extrabold tracking-[-0.025em]"
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
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}
```

### CompareColumn (before / after)

Two side by side in `grid grid-cols-2 gap-[40px]`: `kind="dont"` (struck through) then `kind="do"`, with three short items each (≤ 20 characters).

```tsx
function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[36px] border-t-[6px] pt-[28px]',
        kind === 'do' ? 'border-(--cx-accent)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[32px]" strokeWidth={3} />
        {kind === 'do' ? 'Write' : 'Skip'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[40px] leading-[1.3] font-bold',
            kind === 'dont' && 'text-(--cx-muted) line-through',
          )}
        >
          {item}
        </p>
      ))}
    </div>
  )
}
```

### Step (big-number row)

Stack three or four. Pass `last` on the final one to drop its bottom padding.

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
      className={cn('flex gap-[36px] border-t border-(--cx-rule) pt-[24px]', !last && 'pb-[40px]')}
    >
      <span className="w-[96px] shrink-0 font-(family-name:--cx-font-display) text-[120px] leading-[0.85] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px]">
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-extrabold tracking-[-0.02em]">
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

The demo has ten slides: Cover, PhotoCover, Content (list), ImageSplit, IconGrid, QuoteSlide, StatSlide, Compare, Steps, Closer. Cover, Content and Closer are under Example usage. The other seven are below, verbatim. Mix them to vary the rhythm of a carousel: an alternate cover, a photo break every few slides, then a grid, quote, stat, comparison or steps where the content fits. Change the copy and the `page` / `total` numbers, never the structure. Quotes, stats and examples must come from the user's material.

### PhotoCover (alternate cover)

Use as the first slide instead of `Cover` when the topic has a fitting photo.

```tsx
function PhotoCover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[44px]">
        <Photo src={coverPhoto} alt="Keys of an old typewriter" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The craft</Eyebrow>
          <Hero>Write fewer, better words</Hero>
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
          alt="A hand drawing a line with a pencil"
          className="h-[520px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Drafting</Eyebrow>
          <Title>Write ten, keep one</Title>
          <Body>The best headline is rarely the first.</Body>
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
          <Eyebrow>The toolkit</Eyebrow>
          <Title>Four headline formulas</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Hash}>Lead with a number</IconCard>
          <IconCard icon={Target}>Name the reader</IconCard>
          <IconCard icon={QuoteIcon}>Quote a pain</IconCard>
          <IconCard icon={Scissors}>Cut every adverb</IconCard>
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
    <Frame className="bg-[radial-gradient(circle_at_0%_50%,color-mix(in_oklab,var(--cx-accent)_10%,transparent),transparent_55%)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest line goes here, in your own words.</Quote>
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
        <BigStat value="8" label="words or fewer is a good length for a hook." />
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
          <Eyebrow>Edit</Eyebrow>
          <Title>Clear beats clever</Title>
        </div>
        <div className="grid grid-cols-2 gap-[40px]">
          <CompareColumn kind="dont" items={['Puns', 'Vague teasers', 'Long intros']} />
          <CompareColumn kind="do" items={['Plain promises', 'Exact numbers', 'The point first']} />
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
          <Title>Headline in three passes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Dump">
            Write ten versions without judging.
          </Step>
          <Step n="2" title="Pick">
            Circle the one you would click.
          </Step>
          <Step n="3" title="Trim" last>
            Cut it until every word works.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A minimalist listicle poster: an enormous red digit cropped by the edge of the page, a compact black headline beside it, and nothing else competing. Inside, numbers stay the loudest thing on every slide. Hold the discipline: white page, black type, one signal colour reserved for numbers and tiny cues, square photos. Avoid more than one giant numeral, coloured backgrounds, rounded photos, gradients beyond the quote wash, multiple accents, emoji, and numbers used as decoration when there is no real count.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <Numeral value="3" className="top-[230px]" />
      <div className="flex flex-1 flex-col justify-center gap-[48px] pl-[300px]">
        <Eyebrow>Writing tips</Eyebrow>
        <Hero>Secrets of a sharper headline</Hero>
        <Body>One huge number does the hook.</Body>
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
          <Eyebrow>The rules</Eyebrow>
          <Title>Three tests for any headline</Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Point n="1">Would you click it yourself?</Point>
          <Point n="2">Does it promise one thing?</Point>
          <Point n="3">Can you cut two more words?</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Giant Numeral · <Palette>**.
