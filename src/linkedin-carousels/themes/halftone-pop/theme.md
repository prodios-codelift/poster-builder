---
name: Halftone Pop
description: White page with a fading halftone dot patch in the corner, Space Grotesk headlines with one word in a filled highlight box, hard-shadow cards. Punchy, print-inspired how-tos.
mode: light
---

# Halftone Pop

## Palette

Ink on white with one loud colour printed as dots. The bright `accent` is a fill (halftone dots, the highlight box, step tiles, the stat block) and always carries `on-accent` text; for accent-coloured text on white, use the darker `accent-ink`.

| Role       | Value                    | Notes                                                               |
| ---------- | ------------------------ | ------------------------------------------------------------------- |
| bg         | `#FFFFFF`                | white page                                                          |
| fg         | `#141414`                | headlines, list items, card borders (≈ 18:1)                        |
| accent     | `#F26B1D`                | halftone dots, `Mark` box, tiles, stat block, card shadows          |
| accent-ink | `#B4470C`                | accent-coloured text and icons on white (≈ 5.3:1)                   |
| muted      | `#5A5A5A`                | body, footer, captions (≈ 6.9:1)                                    |
| on-accent  | `#141414`                | text on accent fills (≈ 7:1 on orange; white in the other variants) |
| rule       | `rgba(20, 20, 20, 0.12)` | dashed outline of the "dont" column                                 |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Orange** unless the user picks another or their brand fits one better.

### Orange (default)

Studio demo: `Theme · Halftone Pop · Orange` (`theme-halftone-pop--orange`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#141414',
  '--cx-accent': '#F26B1D',
  '--cx-accent-ink': '#B4470C',
  '--cx-muted': '#5A5A5A',
  '--cx-on-accent': '#141414',
  '--cx-rule': 'rgba(20, 20, 20, 0.12)',
```

### Electric Blue

Studio demo: `Theme · Halftone Pop · Electric Blue` (`theme-halftone-pop--electric-blue`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#0D1530',
  '--cx-accent': '#2F6BFF',
  '--cx-accent-ink': '#1F4FD1',
  '--cx-muted': '#565D72',
  '--cx-on-accent': '#FFFFFF',
  '--cx-rule': 'rgba(13, 21, 48, 0.12)',
```

### Magenta

Studio demo: `Theme · Halftone Pop · Magenta` (`theme-halftone-pop--magenta`).

```tsx
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#1D0F18',
  '--cx-accent': '#E0218A',
  '--cx-accent-ink': '#B5136C',
  '--cx-muted': '#65586A',
  '--cx-on-accent': '#FFFFFF',
  '--cx-rule': 'rgba(29, 15, 24, 0.12)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame` and `Halftone` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFFFFF',
  '--cx-fg': '#141414',
  '--cx-accent': '#F26B1D',
  '--cx-accent-ink': '#B4470C',
  '--cx-muted': '#5A5A5A',
  '--cx-on-accent': '#141414',
  '--cx-rule': 'rgba(20, 20, 20, 0.12)',
  '--cx-font-display': "'Space Grotesk', system-ui, sans-serif",
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
        <Halftone className="top-0 right-0 h-[380px] w-[560px] mask-[radial-gradient(ellipse_at_100%_0%,black_0%,transparent_64%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}

function Halftone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute bg-[radial-gradient(var(--cx-accent)_38%,transparent_40%)] bg-size-[26px_26px]',
        className,
      )}
    />
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Space Grotesk', system-ui, sans-serif`. Loaded weights **500 and 700**; use 700 (`font-bold`) for headlines, numerals, labels and the footer. Sentence case, tight tracking.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700 for list items.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 116 px / 1.08 / -0.035em (Space Grotesk width ≈ 0.55, so ≈ 14 chars per line, ≤ 3 lines, ≤ 8 words); title 80 px / 1.1 / -0.03em (≈ 20 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; list item 40 px / 1.35 / 700 with a 56 px numeral; eyebrow 28 px / 1.2 / 700, 0.12em tracking, uppercase, `accent-ink`; footer 26 px / 1.3 / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px. `Frame` prints one `Halftone` patch fading out of the top-right corner and wraps children in their own relative layer.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px**.
- Left-aligned, single column. Cover and CTA slides centre their content vertically.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 64 px from the title block to the list, 40 px between list rows, 32 px between cards (room for the hard shadows).
- Each headline gets at most one `<Mark>` word. Cards are 3 px `fg` outlines with a `10px 10px 0` accent shadow, square corners. List rows sit on 3 px `fg` rules.
- New pieces are built from these tokens, the type scale and the components below: no new colours or fonts. Caps only for the eyebrow and labels.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer  | Source                                  |
| ----------- | ------------- | --------------------------------------- |
| `cover.jpg` | Franck V.     | https://unsplash.com/photos/tiNCpHudGrw |
| `split.jpg` | Vitaly Gariev | https://unsplash.com/photos/AnB0zwEeuYU |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale, `accent` screened over it (shadows turn accent, highlights stay white), then a soft `Halftone` layer multiplied over the bottom of the photo, like a two-colour print. Square corners.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (600 px tall) with the eyebrow and hero below it. Text never sits on the photo.

**Icons.** Import only the icons the carousel uses from `lucide-react`, coloured `accent-ink`, for example:

```tsx
import {
  ArrowRight,
  AtSign,
  Check,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  PenLine,
  X,
} from 'lucide-react'
```

**Background.** The corner patch in `Frame` is the background. `QuoteSlide` adds one more `Halftone` patch at `-z-10`, fading out of the bottom-right corner above the footer. Use a second patch on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="font-(family-name:--cx-font-display) text-[28px] leading-[1.2] font-bold tracking-[0.12em] text-(--cx-accent-ink) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Mark (highlight box)

Wrap the one word of a hero or title that carries the promise.

```tsx
function Mark({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <span
      className="bg-(--cx-accent) box-decoration-clone px-[14px] text-(--cx-on-accent)"
      {...slide}
    >
      {children}
    </span>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.08] font-bold tracking-[-0.035em]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.1] font-bold tracking-[-0.03em]"
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

### Point (numbered list row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-baseline gap-[32px] border-t-[3px] border-(--cx-fg) pt-[28px]">
      <span className="w-[64px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-bold text-(--cx-accent-ink)">
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

A long arrow line with the word Swipe.

```tsx
function SwipeCue() {
  return (
    <div className="flex items-center gap-[20px] text-(--cx-fg)">
      <span className="h-[3px] w-[160px] bg-(--cx-fg)" />
      <ArrowRight className="-ml-[34px] size-[44px]" strokeWidth={2.5} />
      <p className="font-(family-name:--cx-font-display) text-[30px] leading-[1.3] font-bold">
        Swipe
      </p>
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
    <div className="flex items-center gap-[32px]">
      <span className="flex size-[120px] shrink-0 items-center justify-center rounded-full bg-(--cx-accent) font-(family-name:--cx-font-display) text-[48px] leading-none font-bold text-(--cx-on-accent)">
        {initials}
      </span>
      <div className="flex flex-col gap-[6px]">
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold tracking-[-0.02em]">
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
    <div className="mt-auto flex items-center justify-between font-(family-name:--cx-font-display) text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-screen" />
      <Halftone className="inset-0 opacity-[0.35] mix-blend-multiply mask-[linear-gradient(to_top,black,transparent_60%)]" />
    </div>
  )
}
```

### IconCard (icon grid cell)

Pass any `lucide-react` icon as `icon`. Use four in a `grid grid-cols-2 gap-[32px]`, with labels of up to about 4 words.

```tsx
function IconCard({
  icon: Icon,
  children,
  ...slide
}: { icon: LucideIcon; children: ReactNode } & SlideProps) {
  return (
    <div className="flex flex-col gap-[32px] border-[3px] border-(--cx-fg) p-[40px] shadow-[10px_10px_0_var(--cx-accent)]">
      <Icon className="size-[72px] text-(--cx-accent-ink)" strokeWidth={2.25} />
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
      <span className="font-(family-name:--cx-font-display) text-[220px] leading-[0.6] font-bold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[72px] leading-[1.15] font-bold tracking-[-0.025em]"
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

One figure (≤ 4 characters) in an accent block plus a one-line label. One per slide. Use only numbers the user supplied, or rules of thumb.

```tsx
function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <p className="self-start bg-(--cx-accent) px-[24px] font-(family-name:--cx-font-display) text-[240px] leading-[1.0] font-bold tracking-[-0.05em] text-(--cx-on-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}
```

### CompareColumn (before / after)

Two side by side in `grid grid-cols-2 gap-[32px]`: `kind="dont"` then `kind="do"`, with three short items each (≤ 20 characters).

```tsx
function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  return (
    <div
      className={cn(
        'flex flex-col gap-[36px] p-[40px]',
        kind === 'do'
          ? 'border-[3px] border-(--cx-fg) shadow-[10px_10px_0_var(--cx-accent)]'
          : 'border-[3px] border-dashed border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[30px] leading-[1.2] font-bold uppercase',
          kind === 'do' ? 'text-(--cx-accent-ink)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Write' : 'Avoid'}
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
        <span className="flex size-[80px] shrink-0 items-center justify-center bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-bold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-[3px] flex-1 bg-(--cx-fg)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold tracking-[-0.02em]">
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
        <Photo src={coverPhoto} alt="A megaphone on a white wall" className="h-[600px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Be heard</Eyebrow>
          <Hero>
            Say it <Mark>louder</Mark>
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
        <Photo src={splitPhoto} alt="Hands typing on a laptop" className="h-[520px] w-full" />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Drafting</Eyebrow>
          <Title>Write fast, edit slow</Title>
          <Body>Get it all down first, then cut it in half.</Body>
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
          <Title>Four hooks that work</Title>
        </div>
        <div className="grid grid-cols-2 gap-[32px]">
          <IconCard icon={MessageCircle}>Ask a question</IconCard>
          <IconCard icon={Megaphone}>Make a bold claim</IconCard>
          <IconCard icon={PenLine}>Start a story</IconCard>
          <IconCard icon={AtSign}>Call out a reader</IconCard>
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
      <Halftone className="-right-[96px] bottom-[80px] -z-10 h-[400px] w-[640px] mask-[radial-gradient(ellipse_at_100%_100%,black_10%,transparent_70%)]" />
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your punchiest line goes here, short enough to repost.</Quote>
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
        <BigStat value="5×" label="more people read the headline than the body." />
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
          <Eyebrow>Word choice</Eyebrow>
          <Title>Swap these words</Title>
        </div>
        <div className="grid grid-cols-2 gap-[32px]">
          <CompareColumn kind="dont" items={['Utilise', 'In order to', 'Very unique']} />
          <CompareColumn kind="do" items={['Use', 'To', 'Unique']} />
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
          <Title>Edit in three passes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Cut">
            Delete anything the reader won't miss.
          </Step>
          <Step n="2" title="Sharpen">
            Swap vague words for exact ones.
          </Step>
          <Step n="3" title="Read aloud" last>
            Fix every spot where you stumble.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A risograph flyer for copywriters: crisp white stock, a single ink colour printed as a halftone fade, a quirky grotesk headline with one word boxed in colour, and outlined cards with hard offset shadows. It should feel energetic and handmade-modern. Hold the discipline: one ink colour, dots only in the corner patch (plus one extra patch at most), one boxed word per headline, square corners. Avoid gradients, soft blurry shadows, rounded cards, dots behind body text, more than one `Mark` per headline, accent-coloured body text, and emoji.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Copywriting tips</Eyebrow>
        <Hero>
          How to write a better <Mark>headline</Mark>
        </Hero>
        <Body>
          Halftone dots, a grotesk headline and one highlighted word. Built for loud how-tos.
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
          <Eyebrow>The basics</Eyebrow>
          <Title>
            Three rules for <Mark>clear</Mark> copy
          </Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">Write to one reader, not a crowd.</Point>
          <Point n="2">Lead with the benefit.</Point>
          <Point n="3">Cut every word you can.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Halftone Pop · <Palette>**.
