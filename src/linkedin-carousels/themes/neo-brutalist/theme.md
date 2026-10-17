---
name: Neo-Brutalist
description: Cream page, Space Grotesk bold, thick black borders, hard offset shadows and saturated colour blocks. Loud, playful, scroll-stopping.
mode: light
---

# Neo-Brutalist

## Palette

Black ink and borders on a pale ground, with two saturated fills. `accent` fills highlights, number boxes and the swipe button; `accent-2` fills the eyebrow chip and avatar. Text is always black on these fills.

| Role     | Value     | Notes                                          |
| -------- | --------- | ---------------------------------------------- |
| bg       | `#FFF8E7` | pale page, every slide                         |
| fg       | `#111111` | all type, borders, hard shadows                |
| accent   | `#FFD23F` | `<mark>` highlight, number boxes, swipe button |
| accent-2 | `#FF6B9D` | eyebrow chip, avatar                           |
| surface  | `#FFFFFF` | card fill                                      |
| muted    | `#4A4740` | author handle (≥ 7:1 on bg)                    |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Lemon Pop** unless the user picks another or their brand fits one better.

### Lemon Pop (default)

Studio demo: `Theme · Neo-Brutalist · Lemon Pop` (`theme-neo-brutalist--lemon-pop`).

```tsx
  '--cx-bg': '#FFF8E7',
  '--cx-fg': '#111111',
  '--cx-accent': '#FFD23F',
  '--cx-accent-2': '#FF6B9D',
  '--cx-surface': '#FFFFFF',
  '--cx-muted': '#4A4740',
```

### Bubblegum

Studio demo: `Theme · Neo-Brutalist · Bubblegum` (`theme-neo-brutalist--bubblegum`).

```tsx
  '--cx-bg': '#FDF2F8',
  '--cx-fg': '#111111',
  '--cx-accent': '#FF7AB8',
  '--cx-accent-2': '#7DD3FC',
  '--cx-surface': '#FFFFFF',
  '--cx-muted': '#4B4448',
```

### Mint Riot

Studio demo: `Theme · Neo-Brutalist · Mint Riot` (`theme-neo-brutalist--mint-riot`).

```tsx
  '--cx-bg': '#ECFDF3',
  '--cx-fg': '#111111',
  '--cx-accent': '#3DDC97',
  '--cx-accent-2': '#A897FF',
  '--cx-surface': '#FFFFFF',
  '--cx-muted': '#414A45',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#FFF8E7',
  '--cx-fg': '#111111',
  '--cx-accent': '#FFD23F',
  '--cx-accent-2': '#FF6B9D',
  '--cx-surface': '#FFFFFF',
  '--cx-muted': '#4A4740',
  '--cx-font-display': "'Space Grotesk', system-ui, sans-serif",
  '--cx-font-body': "'Space Grotesk', system-ui, sans-serif",
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

- Display and body: `'Space Grotesk', system-ui, sans-serif` (500 and 700 loaded). Width factor ≈ 0.55 at 700, so headlines wrap early.
- Highlight: wrap one word in `<mark>` inside `Hero`/`Title` to fill it with `accent`.
- Type scale: hero 116 px / 1.02 / -0.045em (≈ 14 chars per line, ≤ 3 lines, ≤ 6 words); title 80 px / 1.06 / -0.035em (≈ 20 chars per line); body 38 px / 1.45 / 500; card text 36 px / 1.3 / 700; eyebrow 26 px / 700 uppercase, 0.08em; footer 26 px / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 88 px left/right, 104 px top, 72 px bottom. Content width is 904 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1062 px**.
- Cover and CTA centre vertically. Content slides are top-aligned.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Lists are `Card`s: 4 px border, 10 px hard shadow, 36 px apart so the shadows breathe. Shadows always go down-right.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. Every new box gets the same 3–4 px black border; only the two accent fills are allowed.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer  | Source                                  |
| ----------- | ------------- | --------------------------------------- |
| `cover.jpg` | Rodrigo Araya | https://unsplash.com/photos/FIcuwrn8D8c |
| `split.jpg` | Nik           | https://unsplash.com/photos/6nqbKX5UI9I |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: the image is grayscale, then `accent` replaces the highlights (`mix-blend-multiply`) and `fg` replaces the shadows (`mix-blend-lighten`). Switching palette recolours the photo. Pick photos with clear light and dark areas; flat, dark photos turn into a solid block of colour. A pop-art print in the theme's own fill colour.

**Photo cover.** `PhotoCover` frames the photo in the top of the slide (about 560–600 px tall) with the eyebrow and hero below it. Text never sits on the photo. Photos get the same 4 px border and hard 10 px shadow as cards.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Flame, type LucideIcon, Megaphone, Rocket, Smile, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes diagonal stripes to `Frame`: `className="bg-[repeating-linear-gradient(45deg,transparent_0,transparent_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_34px)]"`. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Bordered chip on `accent-2`.

```tsx
function Eyebrow({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <p
      className="self-start border-[3px] border-(--cx-fg) bg-(--cx-accent-2) px-[18px] py-[8px] text-[26px] leading-[1.2] font-bold tracking-[0.08em] uppercase"
      {...slide}
    >
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

One `<mark>` word per headline.

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[116px] leading-[1.02] font-bold tracking-[-0.045em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[10px] [&_mark]:text-(--cx-fg)">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[80px] leading-[1.06] font-bold tracking-[-0.035em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[8px] [&_mark]:text-(--cx-fg)"
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
    <p className="text-[38px] leading-[1.45] font-medium" {...slide}>
      {children}
    </p>
  )
}
```

### Card (list row)

```tsx
function Card({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-center gap-[28px] border-[4px] border-(--cx-fg) bg-(--cx-surface) px-[28px] py-[24px] shadow-[10px_10px_0_0_var(--cx-fg)]">
      <span className="flex size-[68px] shrink-0 items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent) text-[34px] leading-none font-bold">
        {n}
      </span>
      <p className="text-[36px] leading-[1.3] font-bold" {...slide}>
        {children}
      </p>
    </div>
  )
}
```

### SwipeCue (cover only)

A button-shaped cue with its own shadow.

```tsx
function SwipeCue() {
  return (
    <p className="self-start border-[4px] border-(--cx-fg) bg-(--cx-accent) px-[28px] py-[12px] text-[30px] leading-[1.2] font-bold shadow-[8px_8px_0_0_var(--cx-fg)]">
      Swipe →
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
    <div className="flex items-center gap-[28px] self-start border-[4px] border-(--cx-fg) bg-(--cx-surface) p-[28px] pr-[48px] shadow-[10px_10px_0_0_var(--cx-fg)]">
      <div className="flex size-[104px] shrink-0 items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent-2) text-[40px] leading-none font-bold">
        {initials}
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[46px] leading-[1.1] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
        <p className="text-[30px] leading-[1.3] font-medium text-(--cx-muted)">{AUTHOR.handle}</p>
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
    <div className="mt-auto flex items-center justify-between border-t-[4px] border-(--cx-fg) pt-[24px] text-[26px] leading-[1.3] font-bold">
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
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-multiply" />
      <div className="absolute inset-0 bg-(--cx-fg) mix-blend-lighten" />
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
    <div className="flex flex-col gap-[44px] border-[4px] border-(--cx-fg) bg-(--cx-surface) p-[44px] shadow-[8px_8px_0_0_var(--cx-fg)]">
      <span className="flex size-[112px] items-center justify-center border-[3px] border-(--cx-fg) bg-(--cx-accent-2)">
        <Icon className="size-[60px]" strokeWidth={2.5} />
      </span>
      <p className="text-[44px] leading-[1.2] font-bold" {...slide}>
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
    <figure className="flex flex-col gap-[32px] border-[4px] border-(--cx-fg) bg-(--cx-accent) p-[52px] shadow-[12px_12px_0_0_var(--cx-fg)]">
      <span className="text-[140px] leading-[0.6] font-bold">“</span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[58px] leading-[1.12] font-bold tracking-[-0.03em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[28px] leading-[1.3] font-bold">— {by}</figcaption>
    </figure>
  )
}
```

### BigStat

One figure (≤ 4 characters) plus a one-line label. One per slide. Use only numbers the user supplied, or rules of thumb.

```tsx
function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-[36px]">
      <p className="self-start border-[4px] border-(--cx-fg) bg-(--cx-accent) px-[40px] font-(family-name:--cx-font-display) text-[260px] leading-[1.0] font-bold tracking-[-0.06em] shadow-[12px_12px_0_0_var(--cx-fg)]">
        {value}
      </p>
      <p className="text-[44px] leading-[1.2] font-bold">{label}</p>
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
        'flex flex-col gap-[40px] border-[4px] border-(--cx-fg) p-[40px] shadow-[10px_10px_0_0_var(--cx-fg)]',
        kind === 'do' ? 'bg-(--cx-accent)' : 'bg-(--cx-surface)',
      )}
    >
      <p className="flex items-center gap-[10px] self-start border-[3px] border-(--cx-fg) bg-(--cx-surface) px-[14px] py-[6px] text-[26px] leading-[1.2] font-bold uppercase">
        <Icon className="size-[28px]" strokeWidth={3} />
        {kind === 'do' ? 'Yes' : 'Nope'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn('text-[42px] leading-[1.25] font-bold', kind === 'dont' && 'line-through')}
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
    <div className="flex gap-[28px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center border-[4px] border-(--cx-fg) bg-(--cx-accent) text-[34px] leading-none font-bold">
          {n}
        </span>
        {last ? null : <span className="w-[4px] flex-1 bg-(--cx-fg)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.15] font-bold tracking-[-0.02em]">{title}</p>
        <p className="text-[40px] leading-[1.35] font-medium" {...slide}>
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
          alt="Bold blocks of red and blue paint on a wall"
          className="h-[560px] w-full border-[4px] border-(--cx-fg) shadow-[10px_10px_0_0_var(--cx-fg)]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Unpopular opinion</Eyebrow>
          <Hero>
            Be <mark>loud</mark> on purpose
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
          alt="A stack of retro cassette tapes"
          className="h-[520px] w-full border-[4px] border-(--cx-fg) shadow-[10px_10px_0_0_var(--cx-fg)]"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Throwback</Eyebrow>
          <Title>
            Old ideas, <mark>new</mark> tricks
          </Title>
          <Body>The best formats are remixes of things that already worked.</Body>
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
          <Eyebrow>Cheat sheet</Eyebrow>
          <Title>
            Posts that get <mark>saved</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Flame}>A spicy opinion</IconCard>
          <IconCard icon={Smile}>A real story</IconCard>
          <IconCard icon={Megaphone}>One clear ask</IconCard>
          <IconCard icon={Rocket}>A result people want</IconCard>
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
    <Frame className="bg-[repeating-linear-gradient(45deg,transparent_0,transparent_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_28px,color-mix(in_oklab,var(--cx-fg)_6%,transparent)_34px)]">
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
        <Eyebrow>Fact of life</Eyebrow>
        <BigStat value="3s" label="is all the time your hook gets." />
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
          <Eyebrow>Glow up</Eyebrow>
          <Title>
            Hooks that <mark>work</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['“Some thoughts”', 'Long intros', 'Vague promises']} />
          <CompareColumn kind="do" items={['A bold claim', 'Straight to it', 'A clear payoff']} />
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
          <Eyebrow>Recipe</Eyebrow>
          <Title>Cook up a post</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Hook">
            Say the surprising thing first.
          </Step>
          <Step n="2" title="Proof">
            Back it with one real example.
          </Step>
          <Step n="3" title="Ask" last>
            Tell people exactly what to do.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

Gumroad-style neo-brutalism: raw borders, hard shadows and candy colours that feel handmade and confident. It's fun but still a grid. Avoid soft or blurred shadows, gradients, rounded corners, thin lines, more than two fill colours, and more than one highlighted word per headline.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Neo-Brutalist</Eyebrow>
        <Hero>
          Loud ideas, <mark>zero</mark> fluff
        </Hero>
        <Body>
          Thick borders, hard shadows and bright blocks of colour. Built to stop the scroll.
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
          <Eyebrow>Hot take</Eyebrow>
          <Title>
            Your slides need <mark>less</mark>
          </Title>
        </div>
        <div className="flex flex-col gap-[36px]">
          <Card n="1">Cut every word you can.</Card>
          <Card n="2">Make one thing the hero.</Card>
          <Card n="3">Say it the way you talk.</Card>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Neo-Brutalist · <Palette>**.
