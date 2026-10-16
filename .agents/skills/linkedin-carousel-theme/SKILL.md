---
name: linkedin-carousel-theme
description: Use this skill when the user wants to create, draft or extract a reusable visual theme for LinkedIn carousels in this poster-builder repo. Triggers on phrases like "create a carousel theme", "make a theme called X", "extract a theme from the <name> carousel", "build a theme from these screenshots / my brand colours". Produces a theme folder `src/linkedin-carousels/themes/<id>/` with `theme.md` (the recipe agents copy from) and `index.tsx` (a runnable demo shown in the studio). Do NOT use for writing an actual carousel — that's `linkedin-carousel`.
---

# Create a carousel theme

A theme is a **bundle of two files** in `src/linkedin-carousels/themes/<id>/`:

1. `theme.md` — agent-facing recipe: palette, tokens, typography, layout, paste-ready components, aesthetic. The `linkedin-carousel` skill reads this and **copies** from it into each new carousel.
2. `index.tsx` — a runnable 3-slide demo that uses exactly those components. It's registered in the studio as `Theme · <Name>` so the user can preview and export it like a carousel.

Carousels never import a theme; they paste its snippets. So the markdown snippets and the demo code must be **identical** — the demo is the proof the snippets compile and look right.

The worked example is `src/linkedin-carousels/themes/paper-editorial/` — read both files before writing a new theme and mirror their structure. The carousel technical contract (canvas, type scale, budget, styling, fonts, assets) is in `../linkedin-carousel/references/authoring.md`; read it too, so the theme's choices stay inside those rules.

You write only `themes/<id>/theme.md`, `themes/<id>/index.tsx`, one registry entry, and — only if the theme needs a new webfont — the `@import` line in `src/styles.css`. Nothing else.

## Step 1 — Identify the inputs

A theme can come from any mix of:

- **Images** — screenshots of carousels/posts, a mood board, brand assets. Read each with the `Read` tool; note hex colours, type style and weight, layout rhythm, recurring chrome (footer, page numbers, logos).
- **Text** — brand colours, font names, tone words ("editorial", "playful", "brutalist"). Turn vague words into concrete decisions.
- **An existing carousel** — `carousels/<slug>/index.tsx`: lift its `TOKENS`, font stacks, padding and recurring components (`Frame`, `Footer`, eyebrows, list rows).

If the request already makes the source clear, proceed; otherwise ask with `AskUserQuestion`. **Extract, don't invent**: when inputs give a value, use it. When inputs disagree, ask which wins.

## Step 2 — Pick an id

Kebab-case, short, descriptive: `paper-editorial`, `midnight-mono`, `lemon-checklist`. Check `src/linkedin-carousels/themes/` for collisions.

## Step 3 — Decide fonts

Fonts must be globally loaded to show in preview and export. Already available: **Fraunces** (500, 700), **Manrope** (400–800), **Geist Variable** (100–900), plus system stacks (see the Fonts table in `authoring.md`).

Prefer these. If the theme genuinely needs another Google Font (e.g. brand font), add its `family=` segment to the existing Google Fonts `@import url(...)` on line 1 of `src/styles.css` — one combined URL, only the weights you'll use. Record exactly which weights are loaded in `theme.md`.

## Step 4 — Write `themes/<id>/index.tsx` (demo)

Write the code first, so the markdown can quote it verbatim. Contract:

- Starts with `// Theme demo: <id> — keep components in lockstep with theme.md`.
- Imports exactly: `cn` from `'cn'`, `CSSProperties`/`ReactNode` types from `'react'`, `LinkedInCarouselSlide` from `'../../linkedin-carousel-slide'` (the same relative path works from `carousels/<slug>/`).
- Defines `TOKENS` (`--cx-bg`, `--cx-fg`, `--cx-accent`, `--cx-muted`, `--cx-font-display`, `--cx-font-body`, plus any extras), `AUTHOR` (placeholder `'Your Name'` / `'@yourhandle'`), and `Frame`.
- Defines the fixed components: at minimum `Eyebrow`, `Title`, `Body`, `AuthorCard` (closing-slide author block reading `AUTHOR`), `Footer({ page, total })`; usually also `Hero` (cover headline), `SwipeCue`, and one repeated-row component (`Point`, `StatCard`, …). Everything a carousel needs must be a named component — no one-off markup that only lives inside a demo slide.
- Tailwind with explicit pixel values and an explicit `leading-[…]` on **every** text element; colours only via `--cx-*`.
- Three slides: **Cover** (eyebrow + hero + one-line subtitle + swipe cue), **Content** (title + a 3-item list using the row component), **Closer** (CTA + `<AuthorCard />`). Each passes the vertical budget in `authoring.md` (≈ 1050 px with a 64 px footer and 48 px clearance).
- `export const slides = [Cover, Content, Closer]`.
- Self-contained: no asset imports, no imports from other carousels or themes, no animation.

## Step 5 — Write `themes/<id>/theme.md`

Keep this exact section order; bodies adapt to the theme. Every code block is copied **verbatim** from `index.tsx`.

````markdown
---
name: <Human title>
description: <one-line pitch: palette + type + feel>
mode: <light | dark — matches bg>
---

# <Name>

## Palette
One sentence on how colour is used (what the accent is for, how often).
| Role | Value | Notes |   ← bg, fg, accent, muted (+ extras), hex/rgba, with contrast notes

## Tokens
How to paste (imports + TOKENS + AUTHOR + Frame at the top; every slide's root is <Frame>; fill AUTHOR).
```tsx  imports, TOKENS, AUTHOR, Frame  ```

## Typography
- Display: var → stack, loaded weights, when to use which.
- Body: var → stack, weights.
- Where the fonts are loaded (already global / added to styles.css).
- Type scale: hero, title, body, list item, eyebrow, footer — px, line-height, tracking, max lines.

## Layout
Frame padding, footer zone and resulting content budget, gaps, list/card treatment.
Alignment: cover/CTA, and content slides by density (centred for minimal/light, top for standard — or the theme's own rule, one per carousel).
How to compose new pieces from the tokens and components, plus the accent/caps limits.

## Fixed components
Note that Footer takes literal page/total and must be renumbered, and that carousels paste only what they use.
### Eyebrow / ### Hero and Title / ### Body / ### <Row component> / ### SwipeCue / ### AuthorCard / ### Footer
```tsx  each component, verbatim  ```

## Aesthetic
One paragraph: the feel, the references, the discipline, and an explicit avoid-list.

## Example usage
```tsx  Cover + Content from the demo, then export const slides = [...]  ```
````

## Step 6 — Register the demo

In `src/linkedin-carousels/registry.ts`, add an import and an entry inside the `// Theme demos` block (below all real carousels):

```ts
import { slides as midnightMonoThemeSlides } from './themes/midnight-mono'

  {
    id: 'theme-midnight-mono',
    name: 'Theme · Midnight Mono',
    slides: midnightMonoThemeSlides,
  },
```

## Step 7 — Self-review

- [ ] Both files exist: `themes/<id>/theme.md` and `themes/<id>/index.tsx`.
- [ ] Frontmatter has `name`, `description`, `mode`; `mode` matches the background.
- [ ] Palette covers bg / fg / accent / muted as concrete values; body text ≥ 4.5:1 on bg, muted ≥ 4.5:1 where used for text.
- [ ] Every font family and weight used is globally loaded (and listed in Typography).
- [ ] Type scale stays within `authoring.md` bounds (nothing below 26 px); every text element has explicit `leading-[…]`; hero max words agree with `authoring.md` (≤ 8).
- [ ] Layout states the density → alignment rule and how to compose new pieces.
- [ ] Every component the CTA slide uses (`AuthorCard`, …) is documented in Fixed components.
- [ ] Every code block in `theme.md` matches `index.tsx` character for character.
- [ ] Demo slides pass the vertical budget; `Footer` numbers are right (1/3, 2/3, 3/3).
- [ ] Aesthetic commits to one direction and lists what to avoid.
- [ ] Registry entry `theme-<id>` added under `// Theme demos`.
- [ ] `vp check` passes.

If the dev server is running and you have a browser tool, open `/linkedin-carousel`, select `Theme · <Name>` and check all three slides.

## Step 8 — Hand off

Tell the user the theme id and both paths, a one-line summary of the look, that it's previewable in the studio as `Theme · <Name>`, and that `linkedin-carousel` will offer it on the next carousel request. Mention any font you added to `styles.css`.

## Anti-patterns

- ❌ Writing only `theme.md` or only `index.tsx` — a theme is always both.
- ❌ Snippets in `theme.md` drifting from the demo code.
- ❌ Inventing colours/fonts when the user gave images, brand values or a carousel to extract from.
- ❌ Fonts or weights that aren't loaded (the export silently falls back).
- ❌ Editing carousels, engine files, routes, or `package.json`. The only allowed edit outside the theme folder is the registry entry (and the font `@import` when needed).
- ❌ Skipping the Fixed components section — `Frame` and `Footer` are what every carousel reuses.
