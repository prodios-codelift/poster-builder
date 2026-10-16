---
name: Aurora Glow
description: Dark SaaS-launch look: two soft radial colour glows, Geist bold headlines, glass cards with hairline borders. Modern and premium.
mode: dark
---

# Aurora Glow

## Palette

A near-black canvas lit by two soft glows in opposite corners. The accent is a lighter tint for small solid marks (eyebrow dot, card badges); glows are atmosphere only and never sit behind body text at full strength.

| Role    | Value                       | Notes                                           |
| ------- | --------------------------- | ----------------------------------------------- |
| bg      | `#0B0B14`                   | canvas, every slide                             |
| fg      | `#F4F4FA`                   | headlines, body, swipe pill fill                |
| accent  | `#A78BFA`                   | eyebrow dot, card number badges                 |
| muted   | `#A3A3B8`                   | footer, handle (≥ 7:1 on bg)                    |
| rule    | `rgba(244, 244, 250, 0.14)` | glass borders                                   |
| surface | `rgba(244, 244, 250, 0.06)` | glass fill for pills and cards                  |
| glow-1  | `#7C3AED`                   | top-right glow (55% mix), avatar gradient start |
| glow-2  | `#22D3EE`                   | bottom-left glow (35% mix), avatar gradient end |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Violet Haze** unless the user picks another or their brand fits one better.

### Violet Haze (default)

Studio demo: `Theme · Aurora Glow · Violet Haze` (`theme-aurora-glow--violet-haze`).

```tsx
  '--cx-bg': '#0B0B14',
  '--cx-fg': '#F4F4FA',
  '--cx-accent': '#A78BFA',
  '--cx-muted': '#A3A3B8',
  '--cx-rule': 'rgba(244, 244, 250, 0.14)',
  '--cx-surface': 'rgba(244, 244, 250, 0.06)',
  '--cx-glow-1': '#7C3AED',
  '--cx-glow-2': '#22D3EE',
```

### Ember

Studio demo: `Theme · Aurora Glow · Ember` (`theme-aurora-glow--ember`).

```tsx
  '--cx-bg': '#120A08',
  '--cx-fg': '#FBF3EE',
  '--cx-accent': '#FB923C',
  '--cx-muted': '#B9A49A',
  '--cx-rule': 'rgba(251, 243, 238, 0.14)',
  '--cx-surface': 'rgba(251, 243, 238, 0.06)',
  '--cx-glow-1': '#F43F5E',
  '--cx-glow-2': '#F59E0B',
```

### Emerald Night

Studio demo: `Theme · Aurora Glow · Emerald Night` (`theme-aurora-glow--emerald-night`).

```tsx
  '--cx-bg': '#06110E',
  '--cx-fg': '#ECFDF5',
  '--cx-accent': '#34D399',
  '--cx-muted': '#94B3A7',
  '--cx-rule': 'rgba(236, 253, 245, 0.14)',
  '--cx-surface': 'rgba(236, 253, 245, 0.06)',
  '--cx-glow-1': '#10B981',
  '--cx-glow-2': '#3B82F6',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#0B0B14',
  '--cx-fg': '#F4F4FA',
  '--cx-accent': '#A78BFA',
  '--cx-muted': '#A3A3B8',
  '--cx-rule': 'rgba(244, 244, 250, 0.14)',
  '--cx-surface': 'rgba(244, 244, 250, 0.06)',
  '--cx-glow-1': '#7C3AED',
  '--cx-glow-2': '#22D3EE',
  '--cx-font-display': "'Geist Variable', system-ui, sans-serif",
  '--cx-font-body': "'Geist Variable', system-ui, sans-serif",
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_6%,color-mix(in_oklab,var(--cx-glow-1)_55%,transparent),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_96%,color-mix(in_oklab,var(--cx-glow-2)_35%,transparent),transparent_45%)]" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display and body: `'Geist Variable', system-ui, sans-serif`. Headlines 700 with tight tracking, body 500, card text 600.
- Type scale: hero 124 px / 1.02 / -0.05em (≈ 14 chars per line, ≤ 3 lines, ≤ 7 words); title 84 px / 1.06 / -0.04em (≈ 20 chars per line); body 40 px / 1.5; card text 38 px / 1.3 / 600; eyebrow 26 px / 1.2 / 600, sentence case; footer 26 px / 500.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- `Frame` paints both glows itself; content sits in a relative layer above them. Don't add more glows per slide.
- Cover and CTA centre vertically. Content slides are top-aligned.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Lists are `FeatureCard`s: 28 px radius glass cards, 24 px apart, each with a 72 px accent number badge.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. No uppercase; pills and cards are the only rounded shapes.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer  | Source                                  |
| ----------- | ------------- | --------------------------------------- |
| `cover.jpg` | Jonny Gios    | https://unsplash.com/photos/2vVhfhbj5-s |
| `split.jpg` | Egor Litvinov | https://unsplash.com/photos/QdbpLNLTP5M |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with a `glow-1` → `glow-2` gradient laid over in `mix-blend-color`, so photos glow in the same two colours as the background.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom ~30% fades to solid `bg`, so the eyebrow, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour. Because this `Frame` wraps content in its own layer, `PhotoBackdrop` uses negative insets to reach the slide edges. Inline photos use `rounded-[32px]` and a `rule` border, like glass cards.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Check, Layers, type LucideIcon, Rocket, Sparkles, X, Zap } from 'lucide-react'
```

**Background.** The two glows in `Frame` are the background; don't add more.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Glass pill with an accent dot.

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-[14px] self-start rounded-full border border-(--cx-rule) bg-(--cx-surface) px-[24px] py-[10px] text-[26px] leading-[1.2] font-semibold tracking-[0.02em]">
      <span className="size-[12px] rounded-full bg-(--cx-accent)" />
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[124px] leading-[1.02] font-bold tracking-[-0.05em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[84px] leading-[1.06] font-bold tracking-[-0.04em]">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.5] font-medium">{children}</p>
}
```

### FeatureCard (list row)

```tsx
function FeatureCard({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[32px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) px-[36px] py-[30px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-(--cx-accent) text-[32px] leading-none font-bold text-(--cx-bg)">
        {n}
      </span>
      <p className="text-[38px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

Solid fg pill: the one high-contrast button on the cover.

```tsx
function SwipeCue() {
  return (
    <p className="self-start rounded-full bg-(--cx-fg) px-[32px] py-[14px] text-[28px] leading-[1.2] font-bold text-(--cx-bg)">
      Swipe →
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. Avatar uses the glow gradient.

```tsx
function AuthorCard() {
  const initials = AUTHOR.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="flex items-center gap-[32px] rounded-[32px] border border-(--cx-rule) bg-(--cx-surface) p-[36px]">
      <div className="flex size-[112px] shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) text-[42px] leading-none font-bold">
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
    <div className="mt-auto flex items-center justify-between pt-[28px] text-[26px] leading-[1.3] font-medium text-(--cx-muted)">
      <span>
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="rounded-full border border-(--cx-rule) px-[18px] py-[6px] tabular-nums">
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
      <img src={src} alt={alt} className="size-full object-cover grayscale contrast-[1.15]" />
      <div className="absolute inset-0 bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) mix-blend-color" />
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
    <div className="flex flex-col gap-[44px] rounded-[28px] border border-(--cx-rule) bg-(--cx-surface) p-[44px]">
      <span className="flex size-[112px] items-center justify-center rounded-[20px] bg-(--cx-accent)">
        <Icon className="size-[60px] text-(--cx-bg)" strokeWidth={2} />
      </span>
      <p className="text-[44px] leading-[1.25] font-semibold">{children}</p>
    </div>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker.

```tsx
function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[36px] rounded-[32px] border border-(--cx-rule) bg-(--cx-surface) p-[56px]">
      <span className="text-[140px] leading-[0.6] font-bold text-(--cx-accent)">“</span>
      <blockquote className="font-(family-name:--cx-font-display) text-[60px] leading-[1.2] font-bold tracking-[-0.035em]">
        {children}
      </blockquote>
      <figcaption className="flex items-center gap-[14px] text-[30px] leading-[1.3] font-medium text-(--cx-muted)">
        <span className="size-[14px] rounded-full bg-(--cx-accent)" />
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
      <p className="font-(family-name:--cx-font-display) text-[260px] leading-[0.9] font-bold tracking-[-0.06em] text-(--cx-accent) tabular-nums">
        {value}
      </p>
      <p className="text-[42px] leading-[1.3] font-semibold">{label}</p>
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
        'flex flex-col gap-[40px] rounded-[28px] border bg-(--cx-surface) p-[40px]',
        kind === 'do' ? 'border-(--cx-accent)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[10px] text-[26px] leading-[1.2] font-semibold',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[30px]" strokeWidth={2.5} />
        {kind === 'do' ? 'Now' : 'Before'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'text-[42px] leading-[1.3] font-semibold',
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
    <div className="flex gap-[32px]">
      <div className="flex flex-col items-center">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[20px] bg-linear-to-br from-(--cx-glow-1) to-(--cx-glow-2) text-[30px] leading-none font-bold">
          {n}
        </span>
        {last ? null : <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[10px]', !last && 'pb-[56px]')}>
        <p className="text-[48px] leading-[1.2] font-bold tracking-[-0.025em]">{title}</p>
        <p className="text-[40px] leading-[1.4] font-medium">{children}</p>
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
        <Eyebrow>Launch week</Eyebrow>
        <Hero>Something new is coming</Hero>
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
          alt="Light trails streaking through the night"
          className="h-[540px] w-full rounded-[32px] border border-(--cx-rule)"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>Under the hood</Eyebrow>
          <Title>Built for speed</Title>
          <Body>Every screen loads before you finish the thought.</Body>
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
          <Eyebrow>Highlights</Eyebrow>
          <Title>What ships today</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Zap}>Instant search</IconCard>
          <IconCard icon={Layers}>Shared workspaces</IconCard>
          <IconCard icon={Sparkles}>Smart suggestions</IconCard>
          <IconCard icon={Rocket}>One-click deploys</IconCard>
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
        <Eyebrow>By design</Eyebrow>
        <BigStat value="1" label="click from idea to shipped." />
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
          <Eyebrow>The upgrade</Eyebrow>
          <Title>What changes for you</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn
            kind="dont"
            items={['Five tools', 'Manual exports', 'Waiting on builds']}
          />
          <CompareColumn kind="do" items={['One workspace', 'Live sync', 'Instant previews']} />
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
          <Eyebrow>Get started</Eyebrow>
          <Title>Live in three steps</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="Sign up">
            Bring your team with one link.
          </Step>
          <Step n="2" title="Connect">
            Import your existing projects.
          </Step>
          <Step n="3" title="Ship" last>
            Publish your first update today.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

The product-launch look from modern dev-tool and AI companies: dark, glossy, softly lit, with glass panels and confident type. It should feel premium and current, not gamer-neon. Avoid hard-edged rainbow gradients, gradient text, heavy drop shadows, more than two glows, low-contrast grey body text, and stock 3D renders.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Aurora Glow</Eyebrow>
        <Hero>Launch it like a product</Hero>
        <Body>
          Dark canvas, soft colour glow and glass cards. Built for launches and tech takes.
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
          <Eyebrow>What’s new</Eyebrow>
          <Title>Three things to show in a launch</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <FeatureCard n="1">The problem, in one sentence.</FeatureCard>
          <FeatureCard n="2">The moment it clicks for users.</FeatureCard>
          <FeatureCard n="3">The one thing to try today.</FeatureCard>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Aurora Glow · <Palette>**.
