---
name: Bold Duotone
description: Full-bleed solid colour, giant Inter Tight 800 type, one contrasting highlight. Creator-style, punchy, made for hooks.
mode: dark
---

# Bold Duotone

## Palette

Two colours do everything: a saturated ground and contrasting type, plus one highlight. Use the highlight for the eyebrow, list numerals, one `<mark>` word per headline, the swipe pill and the handle. `on-accent` is the text colour on top of highlight fills.

| Role      | Value                       | Notes                                                |
| --------- | --------------------------- | ---------------------------------------------------- |
| bg        | `#1E3AFF`                   | full-bleed ground, every slide                       |
| fg        | `#FFFFFF`                   | headlines and body                                   |
| accent    | `#D4FF3A`                   | eyebrow, numerals, `<mark>` fill, swipe pill, handle |
| on-accent | `#0A0A0A`                   | text on accent fills                                 |
| muted     | `rgba(255, 255, 255, 0.78)` | footer                                               |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Cobalt Lime** unless the user picks another or their brand fits one better.

### Cobalt Lime (default)

Studio demo: `Theme · Bold Duotone · Cobalt Lime` (`theme-bold-duotone--cobalt-lime`).

```tsx
  '--cx-bg': '#1E3AFF',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#D4FF3A',
  '--cx-on-accent': '#0A0A0A',
  '--cx-muted': 'rgba(255, 255, 255, 0.78)',
```

### Tomato Ink

Studio demo: `Theme · Bold Duotone · Tomato Ink` (`theme-bold-duotone--tomato-ink`).

```tsx
  '--cx-bg': '#FF5A36',
  '--cx-fg': '#1A1A1A',
  '--cx-accent': '#FFFFFF',
  '--cx-on-accent': '#1A1A1A',
  '--cx-muted': 'rgba(26, 26, 26, 0.9)',
```

### Grape Peach

Studio demo: `Theme · Bold Duotone · Grape Peach` (`theme-bold-duotone--grape-peach`).

```tsx
  '--cx-bg': '#5B21B6',
  '--cx-fg': '#FFF1E6',
  '--cx-accent': '#FFB38A',
  '--cx-on-accent': '#2E1065',
  '--cx-muted': 'rgba(255, 241, 230, 0.78)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'

const TOKENS = {
  '--cx-bg': '#1E3AFF',
  '--cx-fg': '#FFFFFF',
  '--cx-accent': '#D4FF3A',
  '--cx-on-accent': '#0A0A0A',
  '--cx-muted': 'rgba(255, 255, 255, 0.78)',
  '--cx-font-display': "'Inter Tight', system-ui, sans-serif",
  '--cx-font-body': "'Inter Tight', system-ui, sans-serif",
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

- Display and body: `'Inter Tight', system-ui, sans-serif`, 800 for headlines and numerals, 600–700 for body and list items. Width factor ≈ 0.50 at 800.
- Highlight: wrap one word in `<mark>` inside `Hero`/`Title`.
- Type scale: hero 140 px / 1.04 / -0.04em (≈ 12 chars per line, ≤ 3 lines, ≤ 6 words); title 100 px / 1.06 / -0.035em (≈ 17 chars per line, ≤ 2 lines preferred); body 42 px / 1.4 / 600; list item 44 px / 1.2 / 700 with an 88 px numeral; eyebrow 28 px / 800 uppercase, 0.14em; footer 26 px / 700.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 88 px left/right, 104 px top, 72 px bottom. Content width is 904 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1062 px**.
- Every slide, including content slides, centres vertically: these are minimal-density slides. Keep body to one sentence.
- Lists are `Point` rows with giant numerals, 48 px apart, max three per slide.
- Footer shows only the handle and page number.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. No borders, cards or rules: type and colour only.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer                            | Source                                  |
| ----------- | --------------------------------------- | --------------------------------------- |
| `cover.jpg` | Alexandre Pellaes                       | https://unsplash.com/photos/6vAjp0pscX0 |
| `split.jpg` | Museum of New Zealand Te Papa Tongarewa | https://unsplash.com/photos/jCEGS5orJpA |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Duotone: the image is grayscale, then `accent` replaces the highlights (`mix-blend-multiply`) and `bg` replaces the shadows (`mix-blend-lighten`). Switching palette recolours the photo. Pick photos with clear light and dark areas; flat, dark photos turn into a solid block of colour. The classic two-colour poster look, so photos never add a third colour.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom ~30% fades to solid `bg`, so the eyebrow, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour. Bright, high-contrast photos with a clear subject work best; mostly dark photos disappear into `bg`.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Eye, Heart, type LucideIcon, MessageCircle, Repeat2, X } from 'lucide-react'
```

**Background.** No extra background; the solid colour is the look.

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

One `<mark>` word per headline.

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[140px] leading-[1.04] font-extrabold tracking-[-0.04em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[14px] [&_mark]:text-(--cx-on-accent) [&_mark]:[box-decoration-break:clone]">
      {children}
    </h1>
  )
}

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return (
    <h2
      className="font-(family-name:--cx-font-display) text-[100px] leading-[1.06] font-extrabold tracking-[-0.035em] [&_mark]:bg-(--cx-accent) [&_mark]:px-[12px] [&_mark]:text-(--cx-on-accent) [&_mark]:[box-decoration-break:clone]"
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
    <p className="text-[42px] leading-[1.4] font-semibold" {...slide}>
      {children}
    </p>
  )
}
```

### Point (numbered row)

```tsx
function Point({ n, children, ...slide }: { n: string; children: ReactNode } & SlideProps) {
  return (
    <div className="flex items-start gap-[36px]">
      <span className="w-[100px] shrink-0 font-(family-name:--cx-font-display) text-[88px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <p className="pt-[8px] text-[44px] leading-[1.2] font-bold tracking-[-0.02em]" {...slide}>
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
    <p className="self-start rounded-full bg-(--cx-accent) px-[36px] py-[16px] text-[30px] leading-[1.2] font-extrabold text-(--cx-on-accent)">
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
    <div className="flex flex-col gap-[8px]">
      <p className="font-(family-name:--cx-font-display) text-[64px] leading-[1.0] font-extrabold tracking-[-0.04em]">
        {AUTHOR.name}
      </p>
      <p className="text-[34px] leading-[1.3] font-bold text-(--cx-accent)">{AUTHOR.handle}</p>
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.2]" />
      <div className="absolute inset-0 bg-(--cx-accent) mix-blend-multiply" />
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
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--cx-bg)_30%,color-mix(in_oklab,var(--cx-bg)_55%,transparent)_58%,transparent_85%)]" />
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
    <div className="flex flex-col gap-[44px]">
      <Icon className="size-[128px] text-(--cx-accent)" strokeWidth={2.25} />
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.02em]" {...slide}>
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
      <span className="font-(family-name:--cx-font-display) text-[240px] leading-[0.55] font-extrabold text-(--cx-accent)">
        “
      </span>
      <blockquote
        className="font-(family-name:--cx-font-display) text-[76px] leading-[1.06] font-extrabold tracking-[-0.035em]"
        {...slide}
      >
        {children}
      </blockquote>
      <figcaption className="text-[32px] leading-[1.3] font-bold text-(--cx-accent)">
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
    <div className="flex flex-col gap-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[360px] leading-[0.85] font-extrabold tracking-[-0.06em] text-(--cx-accent)">
        {value}
      </p>
      <p className="text-[52px] leading-[1.15] font-extrabold tracking-[-0.03em]">{label}</p>
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
      <p
        className={cn(
          'flex items-center gap-[12px] text-[28px] leading-[1.2] font-extrabold tracking-[0.14em] uppercase',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[34px]" strokeWidth={3} />
        {kind === 'do' ? 'Do' : 'Don’t'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[48px] leading-[1.15] font-extrabold tracking-[-0.02em]',
            kind === 'dont' ? 'text-(--cx-muted) line-through' : 'text-(--cx-accent)',
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
    <div className={cn('flex items-start gap-[36px]', !last && 'pb-[56px]')}>
      <span className="w-[100px] shrink-0 font-(family-name:--cx-font-display) text-[96px] leading-[0.9] font-extrabold tracking-[-0.05em] text-(--cx-accent)">
        {n}
      </span>
      <div className="flex flex-col gap-[8px] pt-[6px]">
        <p className="text-[54px] leading-[1.1] font-extrabold tracking-[-0.03em]">{title}</p>
        <p className="text-[42px] leading-[1.3] font-semibold" {...slide}>
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
        <Eyebrow>Real talk</Eyebrow>
        <Hero>
          Own the <mark>stage</mark>
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
        <Photo
          src={splitPhoto}
          alt="A black and white studio portrait"
          className="h-[520px] w-full"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>On stage</Eyebrow>
          <Title>
            Talk like a <mark>human</mark>
          </Title>
          <Body>Write the post the way you would say it out loud.</Body>
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
          <Eyebrow>What counts</Eyebrow>
          <Title>
            Four <mark>signals</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Eye}>Dwell time</IconCard>
          <IconCard icon={MessageCircle}>Comments</IconCard>
          <IconCard icon={Repeat2}>Reposts</IconCard>
          <IconCard icon={Heart}>Saves</IconCard>
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
        <Quote by={AUTHOR.name}>Your best line goes here, in your own words.</Quote>
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
        <Eyebrow>Remember</Eyebrow>
        <BigStat value="1" label="idea. One post. Every time." />
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
          <Eyebrow>Write it like this</Eyebrow>
          <Title>
            Cut the <mark>fluff</mark>
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['In today’s world', 'I’m humbled', 'Thoughts?']} />
          <CompareColumn kind="do" items={['Here’s the fix', 'I learned this', 'Try it today']} />
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
          <Eyebrow>Playbook</Eyebrow>
          <Title>Post in 3 moves</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Hook">
            One bold line.
          </Step>
          <Step n="2" title="Value">
            One useful idea.
          </Step>
          <Step n="3" title="Ask" last>
            One clear action.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

The top-creator carousel: one loud colour, huge words, and nothing else competing for attention. It works because it is blunt. Keep slides sparse. Avoid more than two words highlighted per slide, small text, cards, borders, gradients, photos, icons, and anything that dilutes the two-colour contrast.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[56px]">
        <Eyebrow>Bold Duotone</Eyebrow>
        <Hero>
          Say it big. Say it <mark>once.</mark>
        </Hero>
        <Body>One loud colour, giant type and a single highlight.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={10} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[72px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The formula</Eyebrow>
          <Title>
            Hook, <mark>proof,</mark> ask
          </Title>
        </div>
        <div className="flex flex-col gap-[48px]">
          <Point n="1">Open with the bold claim.</Point>
          <Point n="2">Back it with one example.</Point>
          <Point n="3">End with a single ask.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Bold Duotone · <Palette>**.
