---
name: Midnight Terminal
description: Near-black screen, JetBrains Mono headlines with a block cursor, Geist body, one phosphor accent. Built for dev, AI and tech posts.
mode: dark
---

# Midnight Terminal

## Palette

Light text on a near-black terminal. The phosphor accent behaves like syntax highlighting: prompts, the cursor, numerals, list borders, the handle. Body copy stays in fg.

| Role    | Value                       | Notes                                                             |
| ------- | --------------------------- | ----------------------------------------------------------------- |
| bg      | `#0A0E0B`                   | terminal ground, every slide                                      |
| fg      | `#E6EDE7`                   | headlines and body                                                |
| accent  | `#39FF88`                   | prompt eyebrow, cursor, list border + numerals, swipe cue, handle |
| muted   | `#859488`                   | footer, `whoami` line (≥ 5:1 on bg)                               |
| rule    | `rgba(230, 237, 231, 0.12)` | footer hairline, author card border                               |
| surface | `rgba(230, 237, 231, 0.05)` | tinted fill for list rows and the author card                     |

## Palette variants

Every variant shares the fonts, components and layout; only colours change. To use one, replace the colour lines at the top of `TOKENS` with the block below and keep the font lines. Use **Phosphor Green** unless the user picks another or their brand fits one better.

### Phosphor Green (default)

Studio demo: `Theme · Midnight Terminal · Phosphor Green` (`theme-midnight-terminal--phosphor-green`).

```tsx
  '--cx-bg': '#0A0E0B',
  '--cx-fg': '#E6EDE7',
  '--cx-accent': '#39FF88',
  '--cx-muted': '#859488',
  '--cx-rule': 'rgba(230, 237, 231, 0.12)',
  '--cx-surface': 'rgba(230, 237, 231, 0.05)',
```

### Amber CRT

Studio demo: `Theme · Midnight Terminal · Amber CRT` (`theme-midnight-terminal--amber-crt`).

```tsx
  '--cx-bg': '#0F0B06',
  '--cx-fg': '#F2E9DC',
  '--cx-accent': '#FFB000',
  '--cx-muted': '#9A8E7E',
  '--cx-rule': 'rgba(242, 233, 220, 0.12)',
  '--cx-surface': 'rgba(242, 233, 220, 0.05)',
```

### Cyan Grid

Studio demo: `Theme · Midnight Terminal · Cyan Grid` (`theme-midnight-terminal--cyan-grid`).

```tsx
  '--cx-bg': '#060B12',
  '--cx-fg': '#E3EEF7',
  '--cx-accent': '#22D3EE',
  '--cx-muted': '#8394A5',
  '--cx-rule': 'rgba(227, 238, 247, 0.12)',
  '--cx-surface': 'rgba(227, 238, 247, 0.05)',
```

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle. Do not copy `PALETTES`: it only exists so the studio can preview the variants.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#0A0E0B',
  '--cx-fg': '#E6EDE7',
  '--cx-accent': '#39FF88',
  '--cx-muted': '#859488',
  '--cx-rule': 'rgba(230, 237, 231, 0.12)',
  '--cx-surface': 'rgba(230, 237, 231, 0.05)',
  '--cx-font-display': "'JetBrains Mono', ui-monospace, monospace",
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
        {children}
      </div>
    </LinkedInCarouselSlide>
  )
}
```

## Typography

- Display: `'JetBrains Mono', ui-monospace, monospace` (weights 400 and 700 loaded). Width factor 0.60, so mono headlines wrap sooner.
- Body: `'Geist Variable', system-ui, sans-serif`, 500 for body and 600 for list items.
- Type scale: hero 100 px / 1.1 / -0.03em mono bold (≈ 15 chars per line, ≤ 3 lines, ≤ 6 words), with the block cursor after the last word; title 72 px / 1.15 mono bold (≈ 20 chars per line, ≤ 3 lines); body 40 px / 1.5; list item 38 px / 1.35 / 600 with a 36 px mono numeral; eyebrow 28 px mono bold, lowercase, prefixed `$ `; footer 26 px mono.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom. Content width is 888 px.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px; keep at least 48 px clear above it, so the content budget is roughly **1054 px**.
- Cover and CTA centre vertically. Content slides are top-aligned.
- Content slides use **one alignment for the whole carousel**: top-aligned for standard density, vertically centred (`justify-center`) for minimal or light density. Never mix the two within a carousel.
- Eyebrows read like shell commands (`$ git log --oneline`, `$ exit 0`); keep them under 24 characters.
- Lists are `Point` rows: tinted surface with a 4 px accent left border and zero-padded numerals.
- New pieces a carousel needs (a quote, a stat, a before/after) are composed from these tokens, the type scale and the components below: no new colours or fonts. No uppercase; code-style casing only.

## Images and icons

**Photos.** The theme ships two Unsplash photos in `assets/` (free under the Unsplash License, listed in `assets/CREDITS.md`):

| File        | Photographer   | Source                                  |
| ----------- | -------------- | --------------------------------------- |
| `cover.jpg` | Bernd Dittrich | https://unsplash.com/photos/-PZhcbjJxdI |
| `split.jpg` | Tyler          | https://unsplash.com/photos/OnI_TNcIv9U |

A carousel never imports from `themes/`. To use a photo, copy the file into `carousels/<slug>/assets/` (or download a better-matched Unsplash photo there), import it at the top of the carousel, and copy its row into the carousel's own `assets/CREDITS.md`:

```tsx
import coverPhoto from './assets/cover.jpg'
import splitPhoto from './assets/split.jpg'
```

Never hotlink remote image URLs; the export can't capture them. Only use photos when they fit the topic, never as fake evidence (screenshots, people presented as customers).

**Tint.** Grayscale with `accent` laid over in `mix-blend-multiply`, like an image on a phosphor monitor: green, amber or cyan per palette.

**Photo cover.** `PhotoCover` puts the photo full-bleed behind the text with `PhotoBackdrop`; the bottom ~30% fades to solid `bg`, so the eyebrow, hero and swipe cue sit bottom-aligned (`justify-end`) over flat colour. Inline photos use `rounded-[16px]` and a `rule` border, like a terminal window.

**Icons.** Import only the icons the carousel uses from `lucide-react`, for example:

```tsx
import { Bug, Check, Cpu, GitBranch, type LucideIcon, Terminal, X } from 'lucide-react'
```

**Background.** `QuoteSlide` passes a faint terminal grid to `Frame`: `className="bg-[linear-gradient(var(--cx-rule)_1px,transparent_1px),linear-gradient(90deg,var(--cx-rule)_1px,transparent_1px)] bg-[size:54px_54px]"`. Use it on one slide at most.

## Fixed components

Paste these verbatim, and only the ones the carousel uses. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

Prints a `$ ` prompt before the label.

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-(family-name:--cx-font-display) text-[28px] leading-[1.2] font-bold text-(--cx-accent) lowercase">
      $ {children}
    </p>
  )
}
```

### Hero (cover only) and Title

`Hero` appends a static block cursor.

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[100px] leading-[1.1] font-bold tracking-[-0.03em]">
      {children}
      <span className="ml-[16px] inline-block h-[0.82em] w-[0.5em] bg-(--cx-accent) align-[-0.08em]" />
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[72px] leading-[1.15] font-bold tracking-[-0.03em]">
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

### Point (list row)

```tsx
function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[32px] border-l-[4px] border-(--cx-accent) bg-(--cx-surface) px-[36px] py-[30px]">
      <span className="shrink-0 font-(family-name:--cx-font-display) text-[36px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[38px] leading-[1.35] font-semibold">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return (
    <p className="font-(family-name:--cx-font-display) text-[30px] leading-[1.3] font-bold text-(--cx-accent)">
      swipe --next →
    </p>
  )
}
```

### AuthorCard (closing slide)

The author block for the closing slide, reading from `AUTHOR`. Styled as a `whoami` output.

```tsx
function AuthorCard() {
  return (
    <div className="flex flex-col gap-[12px] rounded-[16px] border border-(--cx-rule) bg-(--cx-surface) px-[40px] py-[36px] font-(family-name:--cx-font-display)">
      <p className="text-[28px] leading-[1.2] text-(--cx-muted)">$ whoami</p>
      <p className="text-[48px] leading-[1.15] font-bold tracking-[-0.02em]">{AUTHOR.name}</p>
      <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">{AUTHOR.handle}</p>
    </div>
  )
}
```

### Footer

Footer reads like a code comment.

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] font-(family-name:--cx-font-display) text-[26px] leading-[1.3] text-(--cx-muted)">
      <span>
        {'// '}
        {AUTHOR.name} · {AUTHOR.handle}
      </span>
      <span className="tabular-nums">
        [{pad(page)}/{pad(total)}]
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
    <div className="flex flex-col gap-[44px] rounded-[16px] border border-(--cx-rule) bg-(--cx-surface) p-[44px]">
      <Icon className="size-[88px] text-(--cx-accent)" strokeWidth={1.75} />
      <p className="text-[44px] leading-[1.3] font-semibold">{children}</p>
    </div>
  )
}
```

### Quote

Only real quotes from the user's material, ≤ 20 words. `by` is the speaker.

```tsx
function Quote({ children, by }: { children: ReactNode; by: string }) {
  return (
    <figure className="flex flex-col gap-[36px] border-l-[4px] border-(--cx-accent) pl-[40px]">
      <blockquote className="font-(family-name:--cx-font-display) text-[56px] leading-[1.25] font-bold tracking-[-0.02em]">
        {children}
      </blockquote>
      <figcaption className="font-(family-name:--cx-font-display) text-[28px] leading-[1.3] text-(--cx-muted)">
        -- {by}
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
      <p className="font-(family-name:--cx-font-display) text-[240px] leading-[0.9] font-bold tracking-[-0.04em] text-(--cx-accent) tabular-nums">
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
  const sign = kind === 'do' ? '+' : '-'
  return (
    <div
      className={cn(
        'flex flex-col gap-[40px] rounded-[16px] border p-[40px]',
        kind === 'do' ? 'border-(--cx-accent) bg-(--cx-surface)' : 'border-(--cx-rule)',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[12px] font-(family-name:--cx-font-display) text-[26px] leading-[1.2] font-bold',
          kind === 'do' ? 'text-(--cx-accent)' : 'text-(--cx-muted)',
        )}
      >
        <Icon className="size-[28px]" strokeWidth={2.5} />
        {kind === 'do' ? 'after' : 'before'}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className={cn(
            'flex gap-[14px] text-[42px] leading-[1.3] font-semibold',
            kind === 'dont' && 'text-(--cx-muted)',
          )}
        >
          <span className="font-(family-name:--cx-font-display)">{sign}</span>
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
        <span className="flex h-[64px] w-[88px] shrink-0 items-center justify-center border border-(--cx-accent) font-(family-name:--cx-font-display) text-[28px] leading-none font-bold text-(--cx-accent)">
          {n.padStart(2, '0')}
        </span>
        {last ? null : <span className="w-[2px] flex-1 bg-(--cx-rule)" />}
      </div>
      <div className={cn('flex flex-col gap-[8px] pt-[8px]', !last && 'pb-[56px]')}>
        <p className="font-(family-name:--cx-font-display) text-[42px] leading-[1.2] font-bold">
          {title}
        </p>
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
        <Eyebrow>tail -f ideas.log</Eyebrow>
        <Hero>Read the code twice</Hero>
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
          alt="A rack of servers glowing in a dark room"
          className="h-[540px] w-full rounded-[16px] border border-(--cx-rule)"
        />
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>ls /infra</Eyebrow>
          <Title>Boring infra wins</Title>
          <Body>Pick the tool your team can debug at 3am.</Body>
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
          <Eyebrow>man good-pr</Eyebrow>
          <Title>Four checks before merge</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <IconCard icon={Bug}>Tests cover the bug</IconCard>
          <IconCard icon={GitBranch}>Small, focused diff</IconCard>
          <IconCard icon={Terminal}>Runs locally first</IconCard>
          <IconCard icon={Cpu}>No surprise costs</IconCard>
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
    <Frame className="bg-[linear-gradient(var(--cx-rule)_1px,transparent_1px),linear-gradient(90deg,var(--cx-rule)_1px,transparent_1px)] bg-[size:54px_54px]">
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
        <Eyebrow>echo $RULE</Eyebrow>
        <BigStat value="200" label="lines is a good upper limit for a reviewable PR." />
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
          <Eyebrow>git diff</Eyebrow>
          <Title>Commit messages</Title>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <CompareColumn kind="dont" items={['fix stuff', 'wip', 'final final v2']} />
          <CompareColumn
            kind="do"
            items={['Fix login timeout', 'Add retry to sync', 'Remove dead flags']}
          />
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
          <Eyebrow>make release</Eyebrow>
          <Title>Ship it safely</Title>
        </div>
        <div className="flex flex-col">
          <Step n="1" title="branch">
            One change per branch.
          </Step>
          <Step n="2" title="review">
            Ask one person who knows the area.
          </Step>
          <Step n="3" title="deploy" last>
            Behind a flag, then widen it.
          </Step>
        </div>
      </div>
      <Footer page={9} total={10} />
    </Frame>
  )
}
```

## Aesthetic

A good-looking terminal: dark, quiet, and precise, with one glowing colour like an old phosphor monitor. It signals "written by someone who builds things". Keep it flat and static. Avoid fake code that does not compile, neon overload (one accent only), glitch effects, gradients, scanline textures, emoji, and mono body copy (it hurts readability; body stays in Geist).

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>cat midnight-terminal</Eyebrow>
        <Hero>Ship the boring version first</Hero>
        <Body>
          Monospace headlines, a dark screen and one glowing accent. Built for dev and AI posts.
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
          <Eyebrow>git log --oneline</Eyebrow>
          <Title>Three commits that save a sprint</Title>
        </div>
        <div className="flex flex-col gap-[24px]">
          <Point n="01">Write the test before the fix.</Point>
          <Point n="02">Delete the code nobody calls.</Point>
          <Point n="03">Log the error, not the noise.</Point>
        </div>
      </div>
      <Footer page={3} total={10} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio once per palette as **Theme · Midnight Terminal · <Palette>**.
