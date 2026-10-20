---
name: poster
description: 'Use this skill when the user wants a single-image social media poster or graphic in this poster-builder repo. Triggers on phrases like "make a poster", "create a social post graphic", "single-image post", "announcement graphic", "event poster", "webinar poster", "hiring post", "launch graphic", "quote card", "stat card", "Instagram post", "story graphic", "X / Twitter image", or "a visual for this post". Works like a social media coordinator: brief, concept, copy, imagery (Unsplash photos, Solar or Lucide icons), build, then caption and alt text. Do NOT use for multi-slide carousels (use `linkedin-carousel`) or for creating themes (use `linkedin-carousel-theme`).'
---

# Build a social media poster

You are the **social media coordinator** on this job, not just the designer. A poster exists to make one specific person stop scrolling, get one message in about 3 seconds, and do one thing. Every choice below (format, words, photo, icon, colour) serves that.

Read these before you build:

- [`references/coordinator-playbook.md`](references/coordinator-playbook.md): goals, hooks, the thumb-stop test, caption, hashtag and alt-text templates.
- [`references/imagery.md`](references/imagery.md): how to choose photos and icons, and how to source photos from Unsplash.
- [`references/formats.md`](references/formats.md): canvas sizes, safe zones and which formats render today.
- [`../linkedin-carousel/references/authoring.md`](../linkedin-carousel/references/authoring.md): the technical contract (file shape, tokens, fonts, type scale, vertical budget, assets). A poster is built on the same engine, so those rules apply unless this skill says otherwise.

## How posters are built today

There is no separate poster studio yet. A poster is a **one-slide entry** in the carousel studio:

- File: `src/linkedin-carousels/carousels/<slug>/index.tsx` (plus `assets/`), exporting `export const slides = [Poster]`.
- Registered in the `carousels` array of `src/linkedin-carousels/registry.ts`.
- Canvas: **1080 × 1350** (4:5 portrait). This is the only format the engine renders right now. Other formats are documented in `references/formats.md` and marked "coming soon".
- Exported from `/linkedin-carousel` → My posts → Export as **PNG**.

## Step 1 — Brief like a coordinator

Restate what you understood, then ask what is still missing in **one** `AskUserQuestion` call (skip anything already answered and say what you assumed):

1. **Goal**: awareness · engagement (comments, shares) · click / sign-up · event attendance · hiring · launch / announcement. One goal per poster.
2. **Audience**: who exactly is scrolling past (role, industry, region, level), and what they care about.
3. **Platform and format**: LinkedIn feed · Instagram feed · Instagram/LinkedIn story · X · event banner. See Step 2.
4. **Key message and CTA**: the one sentence they should remember and the one action to take ("Register by 12 Nov", "Comment your answer", "Apply at …").

Also collect what you can't invent: **brand name, handle, logo file, event date/time/place, link, real numbers or quotes**. Never invent people, statistics, quotes, logos, dates or prices. If a fact is missing, ask or write around it.

## Step 2 — Confirm the format

Look up the format in `references/formats.md`.

- **4:5 portrait (1080 × 1350)**: supported. Continue.
- **Square, story or landscape**: tell the user it isn't supported by the studio yet. Offer to build the 4:5 version now, with the layout kept simple (centred stack, safe margins) so it reflows easily once the format lands. Mention which platforms happily accept 4:5 (LinkedIn, Instagram feed, Facebook).

## Step 3 — Pick a theme

Same rule as the carousel skill: **don't pick the theme yourself on create.** List `src/linkedin-carousels/themes/*/theme.md`, then call `AskUserQuestion` with the 3 themes that best fit the goal and audience (label each with its frontmatter `name`), plus **"No theme — design from scratch"**. Skip the question only when the user already named a theme or gave brand colours you'll build from.

- **Theme picked**: read its `theme.md` end to end. Copy its `TOKENS`, `Frame`, fonts and only the components you use into the poster file. Never import from `themes/`. Start the file with `// Theme: <id>` (or `// Theme: <id> · <palette-key>`).
- **No theme**: offer 3 aesthetic directions tailored to the topic (vibe + palette + type + motif), mark one "(Recommended)", and build tokens following *Tokens and styling* in the authoring reference.

## Step 4 — Concept and copy

Pick **one archetype** for the poster. The playbook maps goals to archetypes.

| Archetype | Use when | Focal point |
| --- | --- | --- |
| Hero photo + headline | Mood or place matters (events, culture, launches) | The photo, headline second |
| Big-type statement | A sharp opinion or hook carries it | The headline |
| Stat card | You have one real, sourced number | The number |
| Quote card | A real quote from a real, named person | The quote |
| Event / date card | Webinar, meetup, launch date | Date + title |
| Announcement | New product, hire, partnership, milestone | The "what's new" line |
| Tip / checklist | 3 short, parallel tips | Title, then icon rows |
| Before / after | A clear contrast or transformation | The split |

Write the copy before any JSX:

- **Headline**: ≤ 7 words. It must make sense on its own, with nothing else on the poster.
- **Support line**: ≤ 15 words, optional.
- **Details**: only what the goal needs (date · time · place, or 3 tips of ≤ 6 words each).
- **CTA**: one, as a verb ("Save your seat", "Comment below").
- **Signature**: brand or author name + handle, or a logo. Never a page number.

Then run the **3-second test**: cover everything but the focal point and headline. Does the message still land? If not, cut words or change the archetype. A poster should carry roughly **25 words at most**.

## Step 5 — Imagery

Follow `references/imagery.md`. In short:

1. Decide what the visual is for (set a mood, show the subject, stand for an idea, or support a number). If the type alone is stronger, use no photo.
2. **Photos come from Unsplash.** Use an Unsplash tool if the session has one (search for a tool whose name contains `unsplash`, including deferred tools, with `ToolSearch`). If not, use the Unsplash API with `UNSPLASH_ACCESS_KEY`, or the plain Unsplash URLs. Download into `carousels/<slug>/assets/`, never hotlink, and add a row to `assets/CREDITS.md`.
3. **Icons**: `@solar-icons/react` by default, `lucide-react` when the theme already uses Lucide. **One icon family and one style per poster.**
4. When the photo is central to the concept, show the user 2–3 candidates (photo page links) and let them pick.

## Step 6 — Build `carousels/<slug>/index.tsx`

Pick a short kebab-case slug, ideally with a `-poster` suffix (`ai-webinar-poster`), and check `src/linkedin-carousels/carousels/` for collisions.

Follow the authoring reference for the file contract, tokens, fonts and type scale, with these poster-specific rules:

- **One slide**: a single named component, `function Poster()`, and `export const slides = [Poster]`.
- **No page-number footer.** Swap the theme's `Footer page/total` for a signature row (name + handle, or logo), placed where the theme puts its footer.
- **Type scale for posters**: headline 120–180 px (≤ 3 lines), support line 44–56 px, details 36–44 px, signature 28–32 px. Never set text below 28 px, because posters are often seen as small thumbnails.
- **Hierarchy**: exactly one focal point. At most 3 type sizes and one accent colour, used for at most two roles (for example, the CTA and one highlighted word).
- **Safe area**: keep all text ≥ 80 px from every edge. For posters meant to be reused as stories later, keep the key content in the middle 1080 × 1080.
- **Photos** go through the theme's `Photo` / `PhotoBackdrop` component. Text never sits straight on a busy photo: use the backdrop fade, a solid panel, or put the text below the photo.
- **Icons**: sized in px (≥ 64 px), coloured with tokens (`var(--cx-accent)`, `var(--cx-fg)`). For Solar duotone styles, set `color` and `secondaryColor`.
- Do the vertical-budget maths from the authoring reference (usable height ≈ 1350 − padding − signature zone).

## Step 7 — Register and check

Add an import and an entry at the end of the `carousels` array in `src/linkedin-carousels/registry.ts`:

```ts
import { slides as aiWebinarPosterSlides } from './carousels/ai-webinar-poster'
// …
{ id: 'ai-webinar-poster', name: 'Poster: AI in sales webinar', slides: aiWebinarPosterSlides },
```

Start `name` with `Poster:` so posters stand out from carousels under My posts. Then run `vp check` and fix every error.

If the dev server is running (port 3000) and you have a browser tool, open `http://localhost:3000/linkedin-carousel` → My posts → the poster. Check that nothing is clipped, the headline reads at thumbnail size, contrast holds, and the photo crop keeps its subject. Don't start the dev server unless asked. If you couldn't check it visually, say so.

## Step 8 — Hand off like a coordinator

Give the user:

- The file path, and how to export: `/linkedin-carousel` → My posts → select the poster → **Export → PNG**.
- **Post copy**: a caption (hook line, 2–4 short lines of value, CTA), 3–5 relevant hashtags, and a first comment if the link should go there. Use the templates in the playbook.
- **Alt text** for the image (≤ 125 characters, says what's in it and what it says).
- **Posting tips**: best format fit, any platform caveats (for example, "the story version is coming soon; this 4:5 works on LinkedIn and Instagram feed").
- Assumptions you made: theme, copy choices, which photo and why, and the credits.

## Editing an existing poster

Read its `index.tsx` and the theme named on its `// Theme:` line. Keep the tokens and layout; change only what was asked. When you swap a photo, replace the file in `assets/` and update `CREDITS.md`.
