---
name: Paper Editorial
description: Warm paper page, ink type, Fraunces serif headlines over Manrope body, one rust accent. Calm, text-led, thoughtful.
mode: light
---

# Paper Editorial

## Palette

Ink on warm paper carries the page. Rust is the only highlight. Each slide uses it for the eyebrow plus at most one other device (list numerals, the swipe cue, or the CTA rule), and never for a paragraph.

| Role   | Value                    | Notes                                        |
| ------ | ------------------------ | -------------------------------------------- |
| bg     | `#F5F0E6`                | warm paper, every slide                      |
| fg     | `#1B1A17`                | ink: headlines and body copy                 |
| accent | `#C2410C`                | rust: eyebrow, numerals, swipe cue, CTA rule |
| muted  | `#6B655A`                | footer, handles, captions (5.1:1 on bg)      |
| rule   | `rgba(27, 26, 23, 0.16)` | hairlines between list rows and above footer |

## Tokens

Paste the imports, `TOKENS`, `AUTHOR` and `Frame` at the top of the carousel's `index.tsx`. Every slide's root is `<Frame>`. Fill `AUTHOR` with the user's real name and handle.

```tsx
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'

const TOKENS = {
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
  '--cx-font-display': "'Fraunces', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

const AUTHOR = { name: 'Your Name', handle: '@yourhandle' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide>
      <div
        style={TOKENS}
        className={cn(
          'flex size-full flex-col bg-(--cx-bg) px-[96px] pt-[112px] pb-[72px] font-(family-name:--cx-font-body) text-(--cx-fg)',
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

- Display: `var(--cx-font-display)` → `'Fraunces', Georgia, serif`. Loaded weights are **500 and 700 only**: 500 (`font-medium`) for headlines, 700 (`font-bold`) for numerals and the author name.
- Body: `var(--cx-font-body)` → `'Manrope', system-ui, sans-serif`. Weights 500 for body, 600–700 for list items, labels and footer.
- Both families are already loaded globally by `src/styles.css`, so no font changes are needed.
- Type scale:
  - Hero (cover only): 128 px, line-height 1.02, -0.025em. About 16 characters per line, at most 3 lines, so ≤ 8 words.
  - Slide title: 88 px, line-height 1.05, -0.02em. About 24 characters per line, at most 3 lines.
  - Body: 40 px, line-height 1.45, weight 500.
  - List item: 40 px, line-height 1.35, weight 600; numeral 56 px Fraunces bold, rust.
  - Eyebrow: 28 px, weight 700, uppercase, 0.18em tracking, rust.
  - Footer: 26 px, weight 600, muted.

## Layout

- Canvas 1080 × 1350. `Frame` padding: 96 px left/right, 112 px top, 72 px bottom.
- Vertical stack inside `Frame`: a content block with `flex-1`, then `<Footer>` pinned to the bottom (`mt-auto`). The footer zone is about 64 px tall; keep at least 48 px clear above it, so the content budget is roughly **1050 px**.
- Left-aligned, single column. The cover and CTA slides centre their content vertically (`justify-center`).
- Content slides use **one alignment for the whole carousel**: start at the top for standard density, centre vertically (`justify-center`) for minimal or light density so the slides don't look half-empty. Never mix the two within a carousel; the title should not jump around between swipes.
- New pieces a carousel needs (a "fix" row, a stat, a quote) are composed from these tokens, the type scale and the components below: no new colours, fonts, or caps outside the eyebrow.
- Gaps: 48 px between cover elements, 32 px between eyebrow and title, 64 px from title block to body, 40 px between list rows.
- Lists are rows separated by a `rule` hairline (`border-t`), not bullets.

## Fixed components

Paste these verbatim. `Footer` takes literal `page` / `total` numbers: renumber every footer whenever slides are added, removed or reordered.

### Eyebrow

```tsx
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[28px] leading-[1.2] font-bold tracking-[0.18em] text-(--cx-accent) uppercase">
      {children}
    </p>
  )
}
```

### Hero (cover only) and Title

```tsx
function Hero({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-(family-name:--cx-font-display) text-[128px] leading-[1.02] font-medium tracking-[-0.025em]">
      {children}
    </h1>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-(family-name:--cx-font-display) text-[88px] leading-[1.05] font-medium tracking-[-0.02em]">
      {children}
    </h2>
  )
}
```

### Body

```tsx
function Body({ children }: { children: ReactNode }) {
  return <p className="text-[40px] leading-[1.45] font-medium">{children}</p>
}
```

### Point (numbered list row)

```tsx
function Point({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-[32px] border-t border-(--cx-rule) pt-[32px]">
      <span className="w-[56px] shrink-0 font-(family-name:--cx-font-display) text-[56px] leading-none font-bold text-(--cx-accent)">
        {n}
      </span>
      <p className="text-[40px] leading-[1.35] font-semibold">{children}</p>
    </div>
  )
}
```

### SwipeCue (cover only)

```tsx
function SwipeCue() {
  return <p className="text-[30px] leading-[1.3] font-bold text-(--cx-accent)">Swipe →</p>
}
```

### AuthorCard (closing slide)

The author block for the CTA slide, reading from `AUTHOR`.

```tsx
function AuthorCard() {
  return (
    <div className="flex flex-col gap-[8px] border-l-[6px] border-(--cx-accent) pl-[32px]">
      <p className="font-(family-name:--cx-font-display) text-[52px] leading-[1.1] font-bold">
        {AUTHOR.name}
      </p>
      <p className="text-[32px] leading-[1.3] font-semibold text-(--cx-muted)">{AUTHOR.handle}</p>
    </div>
  )
}
```

### Footer

```tsx
function Footer({ page, total }: { page: number; total: number }) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    <div className="mt-auto flex items-center justify-between border-t border-(--cx-rule) pt-[28px] text-[26px] leading-[1.3] font-semibold text-(--cx-muted)">
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

## Aesthetic

A literary magazine on warm stock: generous margins, a serif headline doing the talking, and quiet sans-serif copy underneath. It should feel considered, not loud, the visual equivalent of a well-edited essay. Hold the discipline: one accent colour, one serif, one sans, left-aligned, flat colour. Avoid gradients, drop shadows, rounded cards, photos with text over them, emoji, centred body copy, all-caps headlines (caps are only for the eyebrow), and rust on anything beyond the eyebrow plus one device per slide.

## Example usage

```tsx
function Cover() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Paper Editorial</Eyebrow>
        <Hero>Ideas worth a slow read</Hero>
        <Body>Warm paper, ink type and one rust accent. Built for thoughtful, text-led posts.</Body>
        <SwipeCue />
      </div>
      <Footer page={1} total={3} />
    </Frame>
  )
}

function Content() {
  return (
    <Frame>
      <div className="flex flex-1 flex-col gap-[64px]">
        <div className="flex flex-col gap-[32px]">
          <Eyebrow>The rules</Eyebrow>
          <Title>Three habits of a readable slide</Title>
        </div>
        <div className="flex flex-col gap-[40px]">
          <Point n="1">One idea per slide, nothing more.</Point>
          <Point n="2">Thirty words of body copy, at most.</Point>
          <Point n="3">One accent colour, used sparingly.</Point>
        </div>
      </div>
      <Footer page={2} total={3} />
    </Frame>
  )
}

export const slides = [Cover, Content]
```

The full runnable demo lives next to this file in `index.tsx` and is registered in the studio as **Theme · Paper Editorial**.
