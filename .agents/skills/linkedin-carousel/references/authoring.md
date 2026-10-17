# Authoring a carousel — technical reference

Source of truth for writing or editing `src/linkedin-carousels/carousels/<slug>/index.tsx`. The workflow lives in `../SKILL.md`; themes are authored with the `linkedin-carousel-theme` skill.

## Hard rules

- A carousel is **one `index.tsx` + optional `assets/`** in `src/linkedin-carousels/carousels/<slug>/`. No sibling `.tsx`/`.ts` files, no `components/`, no README. Helpers live inside `index.tsx`.
- The only file you may touch outside the folder is `src/linkedin-carousels/registry.ts` (one import + one entry).
- Never edit engine files: `linkedin-carousel-slide.tsx`, `export-carousel.ts`, `dimensions.ts`, `types.ts`, `src/routes/**`, `src/styles.css`, `package.json`.
- No new dependencies. Available: `react`, `cn` (Tailwind class merge), Tailwind v4 utilities, `@solar-icons/react` and `lucide-react` icons, standard web APIs.
- Never import from `themes/` — copy the theme's snippets in. Paste only the components you actually use: the project type-checks with `noUnusedLocals`, so an unused function fails `vp check`.

## Inline-editable text (My posts → click to edit)

In dev, a Vite plugin (`vite-plugin-slide-source.ts`) stamps text elements with `data-slide-file` / `data-slide-position` / `data-slide-element-type` so the studio can click-to-edit and write the text back to this file. For a **host element** (`<p>text</p>`) that just works. For a **component that renders its `children` as text** it only works if the component forwards the stamp to the element it renders:

```tsx
import type { SlideProps } from '../../slide-attrs'

function Title({ children, ...slide }: { children: ReactNode } & SlideProps) {
  return <h2 className="…" {...slide}>{children}</h2>   // spread LAST, on the element that renders {children}
}
```

- Every text component (`Eyebrow`, `Hero`, `Title`, `Body`, the row component, …) takes `...slide` and spreads it on the element that renders `{children}`. When the component renders extra markup around the text (a dot, a cursor), spread on the element that directly contains the text, or on a `<span {...slide}>{children}</span>` around `{children}` when the text sits next to literal characters.
- Put copy where it can be edited: JSX text (`<Title>Hello</Title>`) or a plain string. Copy that arrives through props, arrays or constants (`items={[…]}`, `{AUTHOR.name}`) is **not** click-editable.
- Keep a component's text as the call site's only child — no `{expr}` or nested elements mixed into the copy.
- Components that wrap other elements (`Frame`, `Scrap`, cards) do not need it. The dev server prints a warning (`renders text but does not forward slide props`) for a text component that forgets.

## File contract

```tsx
// Theme: paper-editorial            ← only when built from a theme
import { cn } from 'cn'
import type { CSSProperties, ReactNode } from 'react'

import { LinkedInCarouselSlide } from '../../linkedin-carousel-slide'
import type { SlideProps } from '../../slide-attrs'   // ← only if a component renders text (see below)

const TOKENS = { /* … */ } as CSSProperties
const AUTHOR = { name: 'Ada Lovelace', handle: '@ada' }

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  /* <LinkedInCarouselSlide tokens={TOKENS}> > div … */
}

function Cover() {
  return <Frame>…</Frame>
}
function Lesson() {
  return <Frame>…</Frame>
}

export const slides = [Cover, Lesson]
```

- Each slide is a **zero-prop function component**; `slides` lists them in display order.
- Every slide renders a `<Frame>` at its root (which wraps `<LinkedInCarouselSlide>`, the fixed 1080 × 1350 frame) — directly, or through a **slide template**.
- Name slide functions by role (`Cover`, `WhyItMatters`, `StepOne`, `Recap`, `Cta`), not `SlideOne`.

### Slide templates

When several slides share one layout (five "mistake" slides, six "step" slides), define a template that returns the `Frame`, and keep each slide a thin named function holding only its copy:

```tsx
function MistakeSlide({ n, title, why, fix, page }: { n: number; title: string; why: string; fix: string; page: number }) {
  return (
    <Frame>
      <div className="flex flex-1 flex-col justify-center gap-[48px]">
        <Eyebrow>Mistake {n}</Eyebrow>
        <Title>{title}</Title>
        {/* … */}
      </div>
      <Footer page={page} total={8} />
    </Frame>
  )
}

function HardestTickets() {
  return <MistakeSlide n={1} page={3} title="Keeping the hardest tickets" why="…" fix="…" />
}
```

## Tokens and styling

Theme values live in CSS variables passed to `LinkedInCarouselSlide` through its `tokens` prop (it sets them on the slide root) and read with Tailwind v4 variable syntax. This keeps every colour and font in one place at the top of the file, and lets the studio swap palettes when previewing theme variants.

```tsx
const TOKENS = {
  '--cx-bg': '#F5F0E6',
  '--cx-fg': '#1B1A17',
  '--cx-accent': '#C2410C',
  '--cx-muted': '#6B655A',
  '--cx-rule': 'rgba(27, 26, 23, 0.16)',
  '--cx-font-display': "'Fraunces', Georgia, serif",
  '--cx-font-body': "'Manrope', system-ui, sans-serif",
} as CSSProperties

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <LinkedInCarouselSlide tokens={TOKENS}>
      <div
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

- Colours: `bg-(--cx-bg)`, `text-(--cx-accent)`, `border-(--cx-rule)`. Fonts: `font-(family-name:--cx-font-display)`.
- Pass `TOKENS` only through `tokens={TOKENS}`; never put `style={TOKENS}` on an inner element (it would block palette previews).
- Minimum token set: `bg`, `fg`, `accent`, `muted`, `font-display`, `font-body`. Add more (`--cx-rule`, `--cx-surface`, …) as needed; never hardcode a hex inside a slide.
- A slide that needs a different background (e.g. an inverted CTA) passes `className="bg-(--cx-fg) text-(--cx-bg)"` to `Frame`.
- Sizes and spacing: **explicit pixels** via arbitrary values — `text-[44px] leading-[1.4]`, `gap-[48px]`, `px-[96px]`. Give **every** text element an explicit `leading-[…]` so the budget math below is exact.
- **New components** (a "fix" row, a stat tile, a quote) are composed only from the existing tokens, the type scale, and the theme's component recipes, and must obey the theme's accent and caps rules. No new colours or fonts.
- Layout with Tailwind flex/grid utilities. `className` only; no `<style>` tags, no CSS files, no global selectors.
- **No motion**: export captures one static frame. No `animate-*`, `transition-*`, hover states or `useEffect` timers.
- No `overflow-auto/scroll`, and don't use `overflow-hidden`, negative margins or transforms to hide content that doesn't fit.

## Fonts

Fonts must already be loaded globally or they won't appear in the preview or the export. Available now (via `src/styles.css`):

| Family | Weights loaded | Stack | Width factor |
| --- | --- | --- | --- |
| Fraunces (serif display) | 500, 700 | `'Fraunces', Georgia, serif` | 0.42 (500, tight tracking) · 0.46 (700) |
| Manrope (sans) | 400–800 | `'Manrope', system-ui, sans-serif` | 0.50 (500–600) · 0.54 (700–800) |
| Geist Variable (sans) | 100–900 | `'Geist Variable', system-ui, sans-serif` | 0.50 (500–600) · 0.54 (700+) |
| Inter Tight (sans) | 500, 700, 800 | `'Inter Tight', system-ui, sans-serif` | 0.48 (800, tight tracking) · 0.50 (500–700) |
| Space Grotesk (sans) | 500, 700 | `'Space Grotesk', system-ui, sans-serif` | 0.55 |
| JetBrains Mono (mono) | 400, 700 | `'JetBrains Mono', ui-monospace, monospace` | 0.60 |
| Instrument Serif (serif display) | 400 + italic | `'Instrument Serif', Georgia, serif` | 0.40 |
| Caveat (handwriting, accents only) | 600 | `'Caveat', 'Comic Sans MS', cursive` | 0.38 — never below 44 px |
| Oswald (condensed display, caps) | 500, 700 | `'Oswald', 'Arial Narrow', sans-serif` | 0.40 (uppercase, 700) |
| System stacks | — | `system-ui, sans-serif` · `Georgia, serif` · `ui-monospace, monospace` | 0.52 · 0.48 · 0.60 |

The width factor is the average character width as a fraction of font size; use it in the line estimate below. Use only weights that are loaded (Fraunces has no 600/800 and Instrument Serif has no bold — the browser would fake-bold them). One display font + one body font per carousel, plus an accent hand font only when the theme defines one. Need a family that isn't listed? Ask the user to add it with a theme (`linkedin-carousel-theme`) — don't edit `styles.css` from this skill.

## Canvas

- Fixed **1080 × 1350 px** (4:5 portrait, the largest feed footprint LinkedIn shows on mobile). It does not scroll; anything past the edge is cropped in the export.
- Side padding **80–112 px**; top **96–120 px**; bottom **≥ 72 px**. No text closer than **72 px** to any edge.
- Reserve a footer zone (~64 px for a one-line footer) plus **≥ 48 px** of clear space between the content and the footer.

## Type scale (phone-first)

A carousel is read on a phone at roughly **0.35×**: 40 px in the file is ~14 px on screen. Size for that.

| Element | Size | Line-height | Notes |
| --- | --- | --- | --- |
| Cover hook | 110–150 px | 1.0–1.1 | ≤ 8 words, ≤ 3 lines |
| Slide title | 72–96 px | 1.05–1.15 | ≤ ~8 words, ≤ 3 lines |
| Big number / stat | 160–260 px | 1.0 | one per slide |
| Body / list item | 36–48 px | 1.35–1.5 | |
| Eyebrow / label | 26–32 px | 1.2 | uppercase + tracking allowed |
| Footer / caption | 26–30 px | 1.3 | |

**Never set text below 26 px.** Weights: 500+ for body, 700+ for headlines unless the display face reads well at 500 (serifs like Fraunces). No light/thin weights.

## Vertical budget — every slide must fit

**Usable height** = `1350 − top padding − bottom padding − footer zone − gap above footer`. With the frame above (112 / 72), a 64 px footer and a 48 px gap: **≈ 1050 px**.

**Text height** = `font-size × line-height × lines`.

**Lines** = characters ÷ characters-per-line, where characters-per-line = `content width ÷ (font-size × width factor)`. Content width with 96 px side padding is **888 px**. Examples: Fraunces 500 at 88 px ≈ 24 chars/line; at 128 px ≈ 16; Manrope 500 at 40 px ≈ 44.

**Leave slack.** If a line's estimate lands within ~10% of the limit, assume it wraps — preview and PDF export can rasterise text slightly differently.

Worked example — content slide, budget 1050 px:

| Element | Height |
| --- | --- |
| Eyebrow 28 px × 1.2 × 1 | 34 |
| gap | 32 |
| Title 88 px × 1.05 × 2 lines | 185 |
| gap | 64 |
| 3 list rows: (32 pt + 40 px × 1.35 × 1) each | 258 |
| 2 gaps × 40 | 80 |
| **Total** | **653 ✅** |

Swap to a 4-line title + 5 two-line items and you're over. If a slide doesn't fit: cut words, then split the slide. **Never** shrink below the type scale, tighten body line-height under 1.3, or cut padding to cram.

## Density and alignment

| Density | Per content slide |
| --- | --- |
| Minimal | Title only, or one big number + one line |
| Light | Title + up to 3 rendered lines of body (e.g. one sentence + one "instead"/takeaway line) |
| Standard | Title + up to 4 list rows, or ≤ 30 words of body |

Light and minimal slides use well under half the budget. Pick **one alignment for every content slide** in the carousel: vertically centred (`justify-center` on the content block) for minimal/light, top-aligned for standard. Follow the theme's Layout section if it says otherwise. Never mix alignments within a carousel — the title shouldn't jump between swipes.

## Content rules

- **One idea per slide.** Body copy ≤ 30 words. List items fit on one line; max 4 per slide.
- **Cover**: hook (≤ 8 words) + optional one-line subtitle + swipe cue (`Swipe →`). Nothing else.
- **Last slide**: one CTA matching the user's goal, plus the author name and handle.
- **Eyebrows** are short section labels (`Mistake 2`, `Step 3`, `The fix`, `Why it matters`). Don't repeat the footer's page count (`2 of 5`) there.
- **Facts**: statistics, quotes, named examples and first-person anecdotes must come from the user or their source material. If you have none, write general advice without fake precision ("most teams…", not "73% of teams…") and never put words in the author's mouth.
- Contrast: body text ≥ 4.5:1 against its background, large headlines ≥ 3:1. Muted grey is for footers/captions only.
- One accent colour, kept scarce: at most two roles per slide (e.g. eyebrow + numerals), never body paragraphs. Follow the theme's accent rule when there is one.
- Consistent footer on every slide (same position, same content); the cover may hide it if the theme says so.
- Write for skimmers: concrete specifics, short words, active voice. No hashtags or "link in comments" on slides.

## Page numbers

There is no page-number hook. Pass literals: `<Footer page={3} total={8} />`. `total` is the length of `slides`. **Whenever slides are added, removed or reordered, renumber every footer** in the same edit.

## Repeated elements

For repeated visual items inside a slide (numbered rows, cards, stat tiles) define a small component (`Point`, `StatCard`) in the same file and write one explicit instance per item. Keep copy at the call site, styling in the component. For repeated whole-slide layouts, use a slide template (above).

## Assets

- Put images in `carousels/<slug>/assets/` and import them: `import portrait from './assets/portrait.jpg'` → `<img src={portrait} … />`. Same-origin imports are inlined by the exporter.
- **Never hotlink remote image URLs** — cross-origin images break or blank the export.
- Give every `<img>` explicit pixel `width`/`height` (or a sized wrapper) and `object-cover` so layout doesn't shift.
- **Stock photos** are allowed when the theme's photo slides (`PhotoCover`, `ImageSplit`) fit the topic. Copy a photo from the theme's `assets/` into the carousel's `assets/`, or download a better-matched photo from Unsplash (free Unsplash License only, never Unsplash+), resized to the size it is shown at (about 1080 × 1350 for a cover, 1200 × 700 for a split; under ~350 KB). Every stock photo gets a row in `carousels/<slug>/assets/CREDITS.md` (file, photographer, Unsplash URL).
- Render photos through the theme's `Photo` component so they are tinted to the palette. Never put body text directly on a photo: use `PhotoBackdrop` (it fades to `bg` under the text) or put the text below the photo.
- Stock photos set a mood; they are never evidence. No stand-in screenshots, fake product shots, or strangers presented as customers or the author. If a slide needs a real screenshot or portrait, ask the user for the file.
- **Choosing and sourcing visuals**: how to pick photos (search terms, metaphors over clichés, selection criteria), how to get them from Unsplash (an Unsplash tool if one is available, then the API, then plain URLs) and which icon fits which idea are covered in [`../../poster/references/imagery.md`](../../poster/references/imagery.md). Read it before adding any photo or icon.
- **Icons**: `@solar-icons/react` (six styles, imported per style: `import { TargetIcon } from '@solar-icons/react/linear'` → `<TargetIcon size={88} color="var(--cx-accent)" />`; duotone styles also take `secondaryColor`) or `lucide-react` (`import { Target, type LucideIcon } from 'lucide-react'`, sized with `className="size-[88px]"`). If the theme's recipes use Lucide, keep Lucide. **One family and one style per carousel.** Never mix Solar and Lucide, or two Solar styles. Size in px, colour with a token, import only the icons you use. When Solar is used, add `Icons: [Solar](https://github.com/480-Design/Solar-Icon-Set) by 480 Design, CC BY 4.0.` to `assets/CREDITS.md`.

## Self-review checklist

- [ ] File is `carousels/<slug>/index.tsx`; `export const slides = [...]` is non-empty and in order.
- [ ] Every slide renders `<Frame>` at its root (directly or via a slide template).
- [ ] All colours/fonts come from `TOKENS`; no stray hex values in slides; only used theme components pasted.
- [ ] Every slide passes the vertical-budget math with slack; no text within 72 px of an edge; ≥ 48 px above the footer.
- [ ] No list item wraps; body ≤ 30 words; cover hook ≤ 8 words.
- [ ] Nothing below 26 px; every text element has explicit `leading-[…]`; only loaded font weights.
- [ ] One alignment for all content slides, matching the density.
- [ ] Every `Footer` has the right `page` and `total = slides.length`.
- [ ] Accent kept to ≤ 2 roles per slide; contrast passes.
- [ ] No invented statistics, quotes or anecdotes.
- [ ] Imported assets exist on disk; no remote image URLs; no animation classes.
- [ ] Every stock photo has a `CREDITS.md` row, is shown through the theme's `Photo`, and no text sits on an untinted photo.
- [ ] Theme carousels start with `// Theme: <id>` and use the theme's components verbatim.
- [ ] `registry.ts` has the import + entry in the `carousels` array (My posts); `id` = slug.
- [ ] `vp check` passes.
- [ ] Every component that renders text as `children` takes `...slide` (`& SlideProps`) and spreads it on its text element; no dev warning about slide props.
- [ ] Nothing else edited.

## Anti-patterns

- ❌ Walls of text or paragraphs over 30 words — split the slide.
- ❌ Text hugging the edges, or anything below 26 px.
- ❌ Half-empty top-aligned slides at light density — centre them.
- ❌ Thin weights, low-contrast grey body copy, text over busy photos.
- ❌ Stock photos used as proof, or photos without a `CREDITS.md` row.
- ❌ More than two font families, or a second accent colour.
- ❌ Made-up numbers, quotes or "when I was…" stories.
- ❌ Hardcoded page totals that went stale after a reorder.
- ❌ Hotlinked images, `animate-*` classes, `<style>` tags, global CSS.
- ❌ Importing a theme's `index.tsx`, or editing engine/studio files.
- ❌ Splitting a carousel into several files.
- ❌ A text component without `...slide` (the text can't be edited inline in My posts).
