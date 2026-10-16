---
name: linkedin-carousel
description: Use this skill when the user wants to create, draft, generate or edit a LinkedIn carousel (a multi-slide LinkedIn document post) in this poster-builder repo. Triggers on phrases like "create a post", "make a LinkedIn post", "new carousel", "make a LinkedIn carousel about X", "carousel post", "turn this post / article / thread into a carousel", "add a slide to the <name> carousel", or any edit under `src/linkedin-carousels/carousels/`. Do NOT use for creating themes (use `linkedin-carousel-theme`) or for changing the studio, export or engine code.
---

# Create a LinkedIn carousel

This skill owns the **workflow** for drafting a carousel. The technical contract — file shape, 1080 × 1350 canvas, mobile type scale, vertical budget, styling and assets — lives in [`references/authoring.md`](references/authoring.md). **Read it before writing any JSX.**

A carousel is one file, `src/linkedin-carousels/carousels/<slug>/index.tsx` (plus optional `assets/`), registered with one entry in `src/linkedin-carousels/registry.ts`. You write nothing else.

## Step 1 — Pick a theme

**Required on create.** When the user asks to create a new post or carousel, stop and settle the theme **before** Step 2's other questions, before the outline, and before any JSX. Do **not** pick a theme yourself.

List the folders under `src/linkedin-carousels/themes/`. Each has a `theme.md` (the recipe) and an `index.tsx` (a demo, visible in the studio Themes tab once per palette as `<Name> · <Palette>`). The frontmatter `name`, `description` and `mode` of each `theme.md` are enough to shortlist.

If any themes exist, call `AskUserQuestion` with the theme ids as options (label each with its frontmatter `name`) plus a final **"No theme — design from scratch"**. With 4+ themes, offer the 3 most relevant to the topic and tone (professional, dark/techy, colourful/playful); the auto-added "Other" covers the rest. Skip the question **only** when the user already named a theme id or folder — then restate that choice. Wait for the answer before continuing.

Each theme lists **palette variants** in its `## Palette variants` section. Use the default unless the user names a palette or brand colours; if they ask for a different look, offer the variants (same question, or a follow-up) rather than inventing colours.

- **Theme picked**: read `themes/<id>/theme.md` end to end. Its palette, tokens, typography, layout and fixed components are authoritative — paste them into the carousel verbatim. Do **not** import from the theme folder; carousels are self-contained copies so later theme edits never change a published carousel. Skip the aesthetic question in Step 2 and restate the theme name so the user can correct course.
- **No theme**: design from scratch in Step 2, following the token pattern in `references/authoring.md`.

## Step 2 — Clarify (before writing anything)

**Topic comes first.** If the request is thin ("make me a carousel"), ask a separate `AskUserQuestion` first for topic, audience and any source material (a post, article, notes). If the topic is clear, restate your reading of it.

Then ask the remaining questions in **one** `AskUserQuestion` call, skipping any that are already answered (and restating the assumption):

1. **Aesthetic direction** *(only when no theme)* — 3 directions tailored to this topic, each a vibe + concrete cue (palette, type, motif), e.g. for "Hiring your first engineer": **calm founder notebook** (paper white, serif headlines, one ink-blue accent) · **bold checklist** (black on lemon, heavy grotesk, big numerals) · **friendly product UI** (soft greys, rounded cards, a single green). Mark one "(Recommended)".
2. **Length** — 5–7 slides (quick tip) · 8–10 (standard) · 11–15 (deep dive).
3. **Density** — minimal (title or one big number) · light (title + up to 3 lines of body) · standard (title + up to 4 rows / ≤ 30 words). Definitions and the matching slide alignment are in `references/authoring.md` → *Density and alignment*.
4. **Goal of the last slide** — follow · comment (ask a question) · save / repost · visit a link.

Also make sure you have the **author name and LinkedIn handle** for the footer and closing slide — ask if not given; never invent a person.

## Step 3 — Pick a slug

Kebab-case, short, descriptive (`first-engineer-hire`, `q3-lessons`). Check `src/linkedin-carousels/carousels/` for collisions. The slug is the folder name and the registry `id`.

## Step 4 — Write the copy first

Before any JSX, draft the full text of every slide as a numbered outline with a role per slide. Hook and CTA are **required**; pick the optional roles that fit the requested length, with points/steps getting priority:

| Role | Required? | Job |
| --- | --- | --- |
| Hook (cover) | Required, first | Promise or tension in ≤ 8 words + swipe cue. Decides whether anyone swipes. |
| Context / problem | Optional | Why this matters to the reader, in their words. |
| Points / steps | Core | One idea per slide. Numbered when order matters. |
| Example / proof | Optional — **only with real material** | A number, before/after, quote or mini case **from the user or their source**. Never invent statistics, quotes or first-person stories; with no source, skip this role. |
| Recap | Optional | Every point as one short row (≤ 4 rows per the content rules — with 5+ points, use the point titles only, or skip). |
| CTA (last) | Required, last | One clear ask matching the goal from Step 2 + author name/handle. |

Example fits: 8 slides with 5 points → Hook + Context + 5 points + CTA. 7 slides with 4 points → Hook + 4 points + Recap + CTA.

**Pick a slide type per role.** Every theme's `theme.md` has a **Slide recipes** section: `PhotoCover` (alternate cover), `ImageSplit` (photo + idea), `IconGrid` (four parallel ideas), `QuoteSlide`, `StatSlide`, `Compare` (don't/do), `Steps` (timeline), plus the basic list `Content` slide. Note the type next to each outline row. Vary the rhythm so no more than two slides in a row share a layout. For example, a photo break after every three or four text slides, a `Compare` for a mistake → fix point, `Steps` for a process, `IconGrid` for four parallel tips. `QuoteSlide` and `StatSlide` are only for real quotes and numbers from the user (the same rule as Example / proof). Photos are optional: use them when one fits the topic, following *Assets* in `references/authoring.md`.

Check the budgets now, while it is cheap: hook ≤ 8 words, slide title ≤ ~8 words, body within the density limit, list items fit one line (use the line estimate in `references/authoring.md`). If a slide holds two ideas, split it. Show the outline to the user only if they asked to review it or the brief was ambiguous; otherwise proceed, and list your content choices in the hand-off.

## Step 5 — Write `carousels/<slug>/index.tsx`

Follow `references/authoring.md`. With a theme:

1. Start the file with `// Theme: <id>` (or `// Theme: <id> · <palette-key>` for a non-default palette).
2. Paste the theme's imports, `TOKENS`, `AUTHOR` and `Frame`, then **only the fixed components you use** (unused ones fail `vp check`). Fill in `AUTHOR`. For a non-default palette, replace the colour lines in `TOKENS` with that variant's block from `## Palette variants`, keeping the font lines. Never copy `PALETTES`.
3. The theme's `theme.md` is the only source to copy from; its demo `index.tsx` contains the same code, so never import it.
4. For each slide type in the outline, start from that theme's slide recipe and change only the copy and footer numbers. When you use photos or icons, follow the theme's **Images and icons** section: copy the photo into the carousel's `assets/` with a `CREDITS.md` row, and import only the icons you use.
5. If the carousel needs a piece the theme doesn't define, compose it from the theme's tokens, type scale and components, inside the theme's accent and caps rules.
6. When several slides share a layout, use a slide template (see *Slide templates* in `references/authoring.md`).
7. Write one named function per slide and end with `export const slides = [...]` in order.

Do the vertical-budget math for every slide before writing it, and apply the density alignment rule consistently.

## Step 6 — Register it

In `src/linkedin-carousels/registry.ts`, add an import (after the existing carousel imports) and an entry at the end of the `carousels` array (My posts). Do **not** add it to `themes`.

```ts
import { slides as firstEngineerHireSlides } from './carousels/first-engineer-hire'

export const carousels: LinkedInCarousel[] = [
  // …
  {
    id: 'first-engineer-hire',
    name: 'Hiring your first engineer',
    slides: firstEngineerHireSlides,
  },
]
```

`name` is a plain, descriptive title for the whole carousel (not necessarily the cover hook). It is shown under My posts in the studio sidebar, becomes the exported PDF/PNG filename, and is what you suggest as the LinkedIn document title in Step 8.

## Step 7 — Self-review

Run the checklist at the end of `references/authoring.md`, then run `vp check` from the repo root and fix every error.

If the dev server is running (`vp run dev`, port 3000) and you have a browser tool, open `http://localhost:3000/linkedin-carousel`, open the **My posts** tab, click the carousel in the sidebar and step through every slide with the arrows; fix anything clipped, wrapped badly, low-contrast or half-empty. Don't start the dev server unless the user asked.

No browser tool? Rely on the budget math with its 10% slack rule, and tell the user in the hand-off that you haven't checked it visually.

## Step 8 — Hand off

Tell the user:

- The file path and slide count.
- To open `/linkedin-carousel` (run `vp run dev` if it isn't running), select the carousel, then **Export → Export as PDF**.
- On LinkedIn: start a post → **Add a document** → upload the PDF → give the document a title (shown on the carousel header) — suggest the registry `name`.
- Any assumptions you made (content choices, author handle, CTA, theme), and whether you checked it visually.

## Editing an existing carousel

Read the carousel's `index.tsx` (and its `// Theme:` line → that theme's `theme.md` for the rules). Keep the existing tokens and components; don't restyle unless asked. Do **not** re-ask for a theme when adding, removing or reordering slides — keep the carousel's existing `// Theme:` line. When adding, removing or reordering slides, update the `slides` array **and renumber every `Footer page / total`**.
