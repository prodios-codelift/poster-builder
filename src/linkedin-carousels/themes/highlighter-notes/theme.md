---
name: Highlighter Notes
description: Ruled notebook page, Manrope extra-bold headlines with marker highlights, Caveat handwritten asides and checkboxes. Personal, warm, study-notes feel.
mode: light
---

# Highlighter Notes

## Palette

Ink on lined notebook paper. Two "tools": a highlighter swipe behind one key phrase per headline (`<Mark>`), and a pen colour for handwritten asides, checkboxes and the swipe cue.

| Role      | Value                    | Notes                                                                     |
| --------- | ------------------------ | ------------------------------------------------------------------------- |
| bg        | `#FFFBEA`                | paper, every slide                                                        |
| fg        | `#1C1917`                | headlines and body                                                        |
| highlight | `#FDE047`                | marker swipe behind `<Mark>` text                                         |
| pen       | `#C81E1E`                | handwritten eyebrow, notes, checkboxes, swipe cue, handle (≥ 4.5:1 on bg) |
| muted     | `#615A50`                | footer (≥ 5.5:1 on bg)                                                    |
| rule      | `rgba(28, 25, 23, 0.07)` | notebook lines every 64 px                                                |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Classic Yellow** unless the user picks another or their brand fits one better.

### Classic Yellow (default)

Studio demo: `Theme · Highlighter Notes · Classic Yellow` (`theme-highlighter-notes--classic-yellow`).

```tsx
  '--cx-bg': '#FFFBEA',
  '--cx-fg': '#1C1917',
  '--cx-highlight': '#FDE047',
  '--cx-pen': '#C81E1E',
  '--cx-muted': '#615A50',
  '--cx-rule': 'rgba(28, 25, 23, 0.07)',
```

### Pink Marker

Studio demo: `Theme · Highlighter Notes · Pink Marker` (`theme-highlighter-notes--pink-marker`).

```tsx
  '--cx-bg': '#FFF5F8',
  '--cx-fg': '#1C1719',
  '--cx-highlight': '#F9A8D4',
  '--cx-pen': '#1D4ED8',
  '--cx-muted': '#635860',
  '--cx-rule': 'rgba(28, 23, 25, 0.07)',
```

### Green Marker

Studio demo: `Theme · Highlighter Notes · Green Marker` (`theme-highlighter-notes--green-marker`).

```tsx
  '--cx-bg': '#F7FEF0',
  '--cx-fg': '#18201A',
  '--cx-highlight': '#BEF264',
  '--cx-pen': '#9A3412',
  '--cx-muted': '#56604F',
  '--cx-rule': 'rgba(24, 32, 26, 0.07)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFFBEA',
  '--cx-fg': '#1C1917',
  '--cx-highlight': '#FDE047',
  '--cx-pen': '#C81E1E',
  '--cx-muted': '#615A50',
  '--cx-rule': 'rgba(28, 25, 23, 0.07)',
  '--cx-font-display': "'Manrope', system-ui, sans-serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
  '--cx-font-hand': "'Caveat', 'Comic Sans MS', cursive",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
        className={cn(
          'relative isolate flex size-full flex-col bg-(--cx-bg) bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_62px,var(--cx-rule)_62px,var(--cx-rule)_64px)] px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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

- Display and body: `'Manrope', system-ui, sans-serif`, 800 for headlines, 500 body, 600 checklist items.
- Hand: `var(--cx-font-hand)` → `'Caveat', 'Comic Sans MS', cursive` (600 loaded). Width factor ≈ 0.38; it reads small, so never set it below 44 px.
- Type scale: hero 112 px / 1.08 / -0.035em (≈ 16 chars per line, ≤ 3 lines, ≤ 7 words); title 80 px / 1.12 / -0.03em (≈ 22 chars per line); body 40 px / 1.5; checklist item 40 px / 1.35 / 600; handwritten eyebrow 48 px, note 46 px, swipe cue 54 px; footer 26 px / 600.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- `Frame` draws the ruled lines; no other background decoration.
- Cover and CTA centre vertically. Content slides are top-aligned.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Lists are `CheckItem` rows, 40 px apart. A `Note` may follow the list as a handwritten aside (≤ 6 words, starts with an arrow).
- Handwriting is slightly rotated (-1.5° to -2°) for a human touch; keep everything else straight.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Use `Mark` for at most one phrase per headline.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer    | Source                                  |
| ----------- | --------------- | --------------------------------------- |
| `cover.jpg` | Diana Polekhina | https://unsplash.com/photos/1ixT36dfuSQ |
| `split.jpg` | Vitaly Gariev   | https://unsplash.com/photos/UtIr_UaiDmg |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with `highlight` laid over in `mix-blend-multiply`, like a photo printed in marker colour. `Photo` also draws a 3 px ink border and a strip of highlighter "tape", and is slightly rotated.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (about 560–600 px tall) with the eyebrow and hero below it. Text never sits on the photo. Keep a 12 px side margin (`mx-[12px]`) so the rotated photo stays clear of the edges.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Brain, Check, Clock, type LucideIcon, NotebookPen, Target, X } from 'lucide-react'
```

**Background.** The ruled lines in `Frame` are the background; don't add more.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Mark (highlighter)

Wrap a phrase: `<Mark>hit post</Mark>`.

```tsx
function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <mark
      className="bg-transparent bg-[linear-gradient(transparent_52%,var(--cx-highlight)_52%,var(--cx-highlight)_92%,transparent_92%)] px-[6px] text-inherit [box-decoration-break:clone]"
      {...slide}
    >
      {children}
    </mark>
  )
}
```

### Eyebrow

Handwritten, lowercase.

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="-rotate-2 self-start font-(family-name:--cx-font-hand) text-[48px] leading-[1.1] font-semibold text-(--cx-pen)"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[112px] leading-[1.08] font-extrabold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[80px] leading-[1.12] font-extrabold tracking-[-0.03em]">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p className="text-[40px] leading-[1.5] font-medium" {...slide}>
      {children}
    </p>
  )
}
```

### CheckItem (list row)

```tsx
function CheckItem({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[28px]">
      <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[10px] border-[4px] border-(--cx-pen) font-(family-name:--cx-font-hand) text-[56px] leading-none font-semibold text-(--cx-pen)">
        ✓
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### Note (handwritten aside)

```tsx
function Note({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="rotate-[-1.5deg] self-start font-(family-name:--cx-font-hand) text-[46px] leading-[1.15] font-semibold text-(--cx-pen)"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-hand) text-[54px] leading-[1.1] font-semibold text-(--cx-pen)">
      swipe →
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  return (
    <div className="flex flex-col gap-[4px]">
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.02em]">
        <Mark>{AUTHOR.name}</Mark>
      </p>
      <p className="font-(family-name:--cx-font-hand) text-[46px] leading-[1.15] font-semibold text-(--cx-pen)">
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
    <div className="mt-auto flex items-center justify-between pt-[28px] text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
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
    <div className={cn('relative', className)}>
      <div className="relative isolate size-full overflow-hidden border-[3px] border-(--cx-fg)">
        <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
        <div className="absolute inset-0 bg-(--cx-highlight) mix-blend-multiply" />
      </div>
      <span className="absolute -top-[22px] left-1/2 h-[44px] w-[180px] -translate-x-1/2 rotate-[-3deg] bg-(--cx-highlight) opacity-80" />
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
    <div className="flex items-center gap-[44px] py-[16px]">
      <span className="flex size-[136px] shrink-0 -rotate-3 items-center justify-center rounded-full border-[4px] border-(--cx-pen)">
        <Icon className="size-[80px] text-(--cx-pen)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-bold" {...slide}>
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
    <figure className="flex flex-col gap-[32px]">
      <span className="font-(family-name:--cx-font-hand) text-[200px] leading-[0.5] font-semibold text-(--cx-pen)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[64px] leading-[1.18] font-extrabold tracking-[-0.03em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="-rotate-1 self-start font-(family-name:--cx-font-hand) text-[50px] leading-[1.1] font-semibold text-(--cx-pen)">
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
      <p className="self-start font-(family-name:--cx-font-display) text-[260px] leading-[1.0] font-extrabold tracking-[-0.05em]">
        <Mark>{value}</Mark>
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
    <div className="flex flex-col gap-[40px]">
      <p className="flex items-center gap-[10px] font-(family-name:--cx-font-hand) text-[52px] leading-[1.1] font-semibold text-(--cx-pen)">
        <Icon className="size-[40px]" strokeWidth={3} />
        {kind === 'do' ? 'do this' : 'not this'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.35] font-semibold',
            kind === 'dont' &&
              'text-(--cx-muted) line-through decoration-(--cx-pen) decoration-[4px]',
          )}
        >
          {kind === 'do' ? <Mark>{item}</Mark> : item}
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
    <div className={cn('flex items-start gap-[32px]', !last && 'pb-[56px]')}>
      <span className="flex size-[80px] shrink-0 -rotate-6 items-center justify-center rounded-full border-[4px] border-(--cx-pen) font-(family-name:--cx-font-hand) text-[52px] leading-none font-semibold text-(--cx-pen)">
        {n}
      </span>
      <div className="flex flex-col gap-[6px] pt-[6px]">
        <p className="text-[48px] leading-[1.2] font-extrabold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.45] font-medium" {...slide}>
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
          alt="A notebook and pen on a grey desk"
          className="mx-[12px] h-[560px] rotate-[-1.5deg]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>study notes</Eyebrow>
          <Hero>
            Learn it <Mark>once</Mark>
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
          alt="A team brainstorming with sticky notes on a glass wall"
          className="mx-[12px] h-[520px] rotate-[1deg]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>team notes</Eyebrow>
          <Title>
            Think out <Mark>loud</Mark>
          </Title>
          <Body>Ideas get better the moment someone else can see them.</Body>
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
          <Eyebrow>my toolkit</Eyebrow>
          <Title>
            What actually <Mark>helps</Mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={NotebookPen}>Write it by hand</IconCard>
          <IconCard icon={Clock}>25-minute blocks</IconCard>
          <IconCard icon={Brain}>Explain it simply</IconCard>
          <IconCard icon={Target}>One goal a day</IconCard>
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
        <Eyebrow>remember this</Eyebrow>
        <BigStat value="3" label="reviews spaced over a week beat one long cram." />
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
          <Eyebrow>old me vs new me</Eyebrow>
          <Title>
            How I <Mark>study</Mark> now
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Rereading notes', 'Highlighting pages', 'All-nighters']}
          />
          <CompareColumn kind="do" items={['Quiz yourself', 'Teach a friend', 'Sleep on it']} />
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
          <Eyebrow>the method</Eyebrow>
          <Title>
            Remember <Mark>anything</Mark>
          </Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Learn">
            Read it once, slowly.
          </Step>
          <Step n="2" title="Recall">
            Close the book and write it down.
          </Step>
          <Step n="3" title="Review" last>
            Check again in two days.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

Someone's best study notes: lined paper, a confident marker swipe, and a few handwritten asides. It feels personal and generous, like advice from a friend. Avoid handwriting for body copy, more than one highlight per headline, doodles or clip-art, multiple pen colours, and messy rotation on anything but the handwriting.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>notes to self</Eyebrow>
        <Hero>
          The stuff I <Mark>wish</Mark> I knew
        </Hero>
        <Body>
          Notebook lines, marker highlights and handwritten asides. Built for lessons and tips.
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
        <div className="flex flex-col gap-[24px]">
          <Eyebrow>the checklist</Eyebrow>
          <Title>
            Before you <Mark>hit post</Mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <CheckItem>The hook fits in one line.</CheckItem>
          <CheckItem>Every slide makes one point.</CheckItem>
          <CheckItem>The last slide asks for one thing.</CheckItem>
        </div>
        <Note>↑ the hook matters most</Note>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Highlighter Notes · <Palette>**.
