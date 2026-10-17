---
name: Torn Paper
description: Near-black page, torn off-white paper scraps with heavy Inter Tight type, a tilted red label stamp. Scrappy, raw, zine-like.
mode: dark
---

# Torn Paper

## Palette

A dark page with off-white paper scraps pasted on top. Ink sits on paper, light text sits on the page, and the accent is a label stamp. Each slide uses the stamp for its eyebrow plus at most one more accent device (list numerals, the stat underline, step stamps). On paper, accent marks use `mark`, which stays readable on the scrap in every palette.

| Role        | Value                       | Notes                                                |
| ----------- | --------------------------- | ---------------------------------------------------- |
| bg          | `#141414`                   | the page behind the scraps                           |
| fg          | `#F4F1EA`                   | text on the page (≈ 16:1)                            |
| accent      | `#CC2A1F`                   | label stamp fill, stat underline, step stamps        |
| muted       | `#A8A49C`                   | body copy and footer on the page (≈ 7:1)             |
| on-accent   | `#FFFFFF`                   | text on the stamp (≈ 5.6:1)                          |
| paper       | `#EDE8DD`                   | scraps, cards, the photo print                       |
| ink         | `#141414`                   | text on paper                                        |
| paper-muted | `#5E5A52`                   | secondary text on paper (≈ 5.6:1)                    |
| mark        | `#CC2A1F`                   | accent marks on paper: numerals, icons, quote mark   |
| rule        | `rgba(244, 241, 234, 0.12)` | dashed outlines, step connector, quote-slide stripes |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Ink & Red** unless the user picks another or their brand fits one better.

### Ink & Red (default)

Studio demo: `Theme · Torn Paper · Ink & Red` (`theme-torn-paper--ink-red`).

```tsx
  '--cx-bg': '#141414',
  '--cx-fg': '#F4F1EA',
  '--cx-accent': '#CC2A1F',
  '--cx-muted': '#A8A49C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-paper': '#EDE8DD',
  '--cx-ink': '#141414',
  '--cx-paper-muted': '#5E5A52',
  '--cx-mark': '#CC2A1F',
  '--cx-rule': 'rgba(244, 241, 234, 0.12)',
```

### Charcoal & Orange

Studio demo: `Theme · Torn Paper · Charcoal & Orange` (`theme-torn-paper--charcoal-orange`).

```tsx
  '--cx-bg': '#1C1B1A',
  '--cx-fg': '#F5F0E8',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#ABA59B',
  '--cx-on-accent': '#FFFFFF',
  '--cx-paper': '#EFE9DC',
  '--cx-ink': '#1C1B1A',
  '--cx-paper-muted': '#5F5A50',
  '--cx-mark': '#C2410C',
  '--cx-rule': 'rgba(245, 240, 232, 0.12)',
```

### Navy & Lime

Studio demo: `Theme · Torn Paper · Navy & Lime` (`theme-torn-paper--navy-lime`).

```tsx
  '--cx-bg': '#0F1A2E',
  '--cx-fg': '#F1F4F8',
  '--cx-accent': '#C6F432',
  '--cx-muted': '#A2ADC0',
  '--cx-on-accent': '#0F1A2E',
  '--cx-paper': '#EEF0E6',
  '--cx-ink': '#0F1A2E',
  '--cx-paper-muted': '#56606E',
  '--cx-mark': '#4D7C0F',
  '--cx-rule': 'rgba(241, 244, 248, 0.12)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR`, `Frame`, `TORN_EDGE` and `Scrap` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#141414',
  '--cx-fg': '#F4F1EA',
  '--cx-accent': '#CC2A1F',
  '--cx-muted': '#A8A49C',
  '--cx-on-accent': '#FFFFFF',
  '--cx-paper': '#EDE8DD',
  '--cx-ink': '#141414',
  '--cx-paper-muted': '#5E5A52',
  '--cx-mark': '#CC2A1F',
  '--cx-rule': 'rgba(244, 241, 234, 0.12)',
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

const TORN_EDGE =
  'polygon(0% 3%, 6% 0.5%, 13% 2.5%, 21% 0%, 30% 2%, 38% 0.5%, 47% 3%, 55% 0.5%, 64% 2.5%, 72% 0%, 81% 2%, 89% 0.5%, 100% 2.5%, 99.5% 30%, 100% 62%, 99% 97%, 92% 100%, 84% 97.5%, 75% 99.5%, 66% 97%, 58% 100%, 49% 97.5%, 40% 99.5%, 31% 97%, 22% 100%, 14% 97.5%, 6% 99.5%, 0% 97%, 0.5% 64%, 0% 33%)'

function Scrap({
  children,
  tilt = 'left',
  className,
}: {
  children: ReactNode
  tilt?: 'left' | 'right' | 'none'
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-(--cx-paper) px-[48px] py-[48px] text-(--cx-ink)',
        tilt === 'left' && '-rotate-[1.2deg]',
        tilt === 'right' && 'rotate-[1deg]',
        className,
      )}
      style={{ clipPath: TORN_EDGE }}
    >
      {children}
    </div>
  )
}
```

## Typography

- Display: `var(--cx-font-display)` → `'Inter Tight', system-ui, sans-serif`. Use 800 (`font-extrabold`) for every headline, numeral and stamp; tight negative tracking.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. 500 for body, 700–800 for list items, labels and the footer.
- Both families are already loaded globally by `src/styles.css`.
- Type scale: hero 128 px / 1.0 / -0.03em, inside a scrap (≈ 13 chars per line at the scrap's 792 px width, ≤ 3 lines, ≤ 8 words); title 88 px / 1.05 / -0.025em (≈ 21 chars per line, ≤ 3 lines); body 40 px / 1.45 / 500, muted; strip item 40 px / 1.3 / 700 with a 56 px numeral; stamp 28 px / 1.2 / 800, 0.12em tracking, uppercase; quote 68 px / 1.12 / 800 on paper; footer 26 px / 1.3 / 700, muted.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer is one line (~34 px); keep 48 px clear above it, so the content budget is roughly **1080 px**.
- Left-aligned, single column. Cover and CTA slides centre their content vertically; `PhotoCover` bottom-aligns it.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred for minimal density. Never mix them.
- Gaps: 48 px between cover elements, 32 px between the stamp and the title, 56 px from the title block to the list, 28 px between strips, 24 px between cards.
- `Scrap` is the theme's only surface: 48 px padding, torn top and bottom edges via `TORN_EDGE`, and a slight tilt (`left`, `right` or `none`). Alternate tilts down a list so the strips feel hand-placed. Never tilt more than about 2°.
- New pieces are built from `Scrap`, these tokens, the type scale and the components below: no new colours or fonts. Caps only for stamps and labels.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer     | Source                                  |
| ----------- | ---------------- | --------------------------------------- |
| `cover.jpg` | Jazmin Quaynor   | https://unsplash.com/photos/CXjp1ycr5Vw |
| `split.jpg` | Eugene Golovesov | https://unsplash.com/photos/IeR5oGeSdFg |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with high contrast, then `paper` multiplied over it: the photo looks photocopied onto the same stock as the scraps. Inline photos sit inside a `Scrap` with 20 px padding, like a print pasted on the page.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop` (`absolute inset-0 -z-10`); the bottom third fades to solid `bg`, so the stamp, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import {
  ArrowRight,
  Check,
  Megaphone,
  PenTool,
  Scissors,
  Share2,
  type LucideIcon,
  X,
} from 'lucide-react'
```

**Background.** `QuoteSlide` passes `className="bg-[repeating-linear-gradient(135deg,transparent_0_22px,var(--cx-rule)_22px_25px)]"` to `Frame`: faint diagonal stripes behind the quote scrap. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow (label stamp)

A tilted accent label. Two or three words.

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="-rotate-[2deg] self-start bg-(--cx-accent) px-[20px] py-[10px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] text-(--cx-on-accent) uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

On the cover the hero sits inside a `Scrap`; titles sit straight on the page.

```tsx
function Hero({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h1
      className="font-(family-name:--cx-font-display) text-[128px] leading-[1.0] font-extrabold tracking-[-0.03em]"
      {...slide}
    >
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[88px] leading-[1.05] font-extrabold tracking-[-0.025em]"
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

### Strip (numbered list row)

A torn paper strip per item. Alternate `tilt` between rows.

```tsx
function Strip({
  n,
  children,
  tilt = 'left',
  ...slide
}: {
  n: string
  children: ReactNode
  tilt?: 'left' | 'right'
} & SlideProps) {
  return (
    <Scrap tilt={tilt} className="flex items-baseline gap-[28px] py-[36px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-extrabold text-(--cx-mark)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </Scrap>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="flex items-center gap-[16px] text-[30px] leading-[1.3] font-extrabold tracking-[0.12em] uppercase">
      Swipe
      <ArrowRight className="size-[40px] text-(--cx-accent)" strokeWidth={3} />
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`, on its own scrap.

```tsx
function AuthorCard() {
  return (
    <Scrap tilt="right" className="flex flex-col gap-[8px] self-start pr-[96px]">
      <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.02em]">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-bold text-(--cx-paper-muted)">{AUTHOR.handle}</p>
    </Scrap>
  )
}
```

### Footer

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between text-[26px] leading-[1.3] font-bold text-(--cx-muted)">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.3]" />
      <div className="absolute inset-0 bg-(--cx-paper) mix-blend-multiply" />
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
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_36%,color-mix(in_oklab,var(--cx-bg)_65%,transparent)_60%,color-mix(in_oklab,var(--cx-bg)_25%,transparent)_100%)]" />
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
    <Scrap tilt="none" className="flex flex-col gap-[32px] px-[40px] py-[44px]">
      <Icon className="size-[72px] text-(--cx-mark)" strokeWidth={2.25} />
      <p className="text-[40px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </Scrap>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker. The whole quote is one scrap.

```tsx
function Quote({ children, by, ...slide }: { children: ReactNode; by: string } & SlideProps) {
  return (
    <Scrap className="flex flex-col gap-[36px] px-[64px] py-[80px]">
      <span className="font-(family-name:--cx-font-display) text-[180px] leading-[0.6] font-extrabold text-(--cx-mark)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[68px] leading-[1.12] font-extrabold tracking-[-0.02em]"
        {...slide}
      >
        {children}
      </blockquote>
      <p className="text-[30px] leading-[1.3] font-bold text-(--cx-paper-muted)">— {by}</p>
    </Scrap>
  )
}
```

### BigStat

One figure (≤ 4 characters) plus a one-line label. One per slide. Use only numbers the user supplied, or rules of thumb.

```tsx
function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[32px]">
      <p className="self-start border-b-[16px] border-(--cx-accent) font-(family-name:--cx-font-display) text-[240px] leading-[0.95] font-extrabold tracking-[-0.04em] tabular-nums">
        {value}
      </p>
      <p className="text-[44px] leading-[1.3] font-bold">{label}</p>
    </div>
  )
}
```

### CompareColumn (before / after)

Two side by side in `grid grid-cols-2 gap-[24px]`: `kind="dont"` (dashed outline on the page) then `kind="do"` (a paper scrap), with three short items each (≤ 20 characters).

```tsx
function CompareColumn({ kind, items }: { kind: 'dont' | 'do'; items: string[] }) {
  const Icon = kind === 'do' ? Check : X
  const content = (
    <>
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.12em] uppercase',
          kind === 'do' ? 'text-(--cx-mark)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Do this' : 'Skip this'}
      </p>
      {items.map((item) => (
        <p key={item} className="text-[38px] leading-[1.35] font-bold">
          {item}
        </p>
      ))}
    </>
  )
  return kind === 'do' ? (
    <Scrap tilt="right" className="flex flex-col gap-[36px] px-[40px]">
      {content}
    </Scrap>
  ) : (
    <div className="flex flex-col gap-[36px] border-[3px] border-dashed border-(--cx-rule) p-[40px] text-(--cx-muted)">
      {content}
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
        <span className="flex size-[80px] shrink-0 -rotate-[3deg] items-center justify-center bg-(--cx-accent) font-(family-name:--cx-font-display) text-[44px] leading-none font-extrabold text-(--cx-on-accent)">
          {n}
        </span>
        {!last && <span className="w-0 flex-1 border-l-[3px] border-dashed border-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[56px] leading-[1.1] font-extrabold tracking-[-0.02em]">
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
      <PhotoBackdrop src={coverPhoto} />
      <div className="flex flex-1 flex-col justify-end gap-[40px] pb-[48px]">
        <Eyebrow>Street smarts</Eyebrow>
        <Hero>Make noise on no budget</Hero>
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
        <Scrap className="p-[20px]">
          <Photo src={splitPhoto} alt="A sheet of crumpled paper" className="h-[500px] w-full" />
        </Scrap>
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>First drafts</Eyebrow>
          <Title>Ship it rough</Title>
          <Body>A rough post today beats a perfect one never.</Body>
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
          <Title>Four free tools you already have</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={PenTool}>Your own words</IconCard>
          <IconCard icon={Scissors}>Cut the fluff</IconCard>
          <IconCard icon={Megaphone}>Your network</IconCard>
          <IconCard icon={Share2}>Reposts</IconCard>
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
    <Frame className="bg-[repeating-linear-gradient(135deg,transparent_0_22px,var(--cx-rule)_22px_25px)]">
      <div className="flex flex-1 flex-col justify-center">
        <Quote by={AUTHOR.name}>Your sharpest line goes here, ripped straight from the post.</Quote>
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
        <BigStat value="$0" label="is a fine budget for your first hundred followers." />
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
          <Eyebrow>Spend time, not money</Eyebrow>
          <Title>Where the effort goes</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['Paid boosts', 'Fancy tools', 'Daily logos']} />
          <CompareColumn kind="do" items={['Real replies', 'Plain stories', 'One clear offer']} />
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
          <Title>A post in thirty minutes</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Collect">
            Note one question a client asked.
          </Step>
          <Step n="2" title="Answer">
            Write the reply you gave them.
          </Step>
          <Step n="3" title="Post" last>
            Publish it before you edit it twice.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A photocopied zine taped to a dark wall: ripped paper scraps, fat black grotesk, and one rubber-stamp label in red. It should feel scrappy and practical, like advice from someone who did it on no budget. Hold the discipline: one page colour, one paper, one stamp colour, tilts under 2°, and every scrap carrying exactly one idea. Avoid rounded corners, soft shadows, gradients (beyond the quote-slide stripes), more than one tilted stamp per slide, emoji, script fonts, and paper scraps without content.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Scrap>
          <Hero>Five tips that cost nothing</Hero>
        </Scrap>
        <Eyebrow>Zero budget</Eyebrow>
        <Body>Torn paper, heavy type and one red stamp. Built for scrappy, practical posts.</Body>
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
          <Title>Three free ways to get seen</Title>
        </div>
        <div className="flex flex-col gap-[28px]">
          <Strip n="1">Reply to ten posts a day.</Strip>
          <Strip n="2" tilt="right">
            Turn one win into a short story.
          </Strip>
          <Strip n="3">Ask happy clients to tag you.</Strip>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Torn Paper · <Palette>**.
