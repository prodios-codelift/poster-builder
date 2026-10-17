---
name: apply-comment
description: Apply pending @slide-comment markers written by the LinkedIn carousel studio comment mode. Use when the user runs /apply-comment or asks to "apply comments", "apply slide comments", "process slide comments", "apply the inspector comments", or references markers left inside `src/linkedin-carousels/carousels/**` or `src/linkedin-carousels/themes/**`.
---

# Apply slide comments

The carousel studio has a **Comment** mode (header toggle, dev only). The user clicks a rendered slide element stamped with `data-tsd-source` and attaches a textual note (e.g. *"make this red"*, *"change to 'Fresh headline'"*). Each comment is persisted as an in-source JSX marker inside the carousel or theme file. The studio pins each pending comment to its element, lets the user edit or delete it, and tells them to run `/apply-comment` to apply them.

Your job: read those markers, perform the described edits, and delete the markers.

> **Before making any page edit**, consult the right authoring skill:
>
> - Multi-slide carousel under `carousels/` → **`linkedin-carousel`** (and its `references/authoring.md`).
> - One-slide poster under `carousels/` (name often starts with `Poster:` / slug ends in `-poster`) → **`poster`**.
> - Theme demo under `themes/<id>/` → that theme’s `theme.md` plus authoring rules.
>
> Honour the file’s `// Theme: <id>` line when present. A comment like *"make this bigger"* or *"change the accent colour"* must stay consistent with those rules.

## Marker format

```
{/* @slide-comment id="c-<8hex>" ts="<ISO>" text="<base64url(JSON)>" */}
```

- Sits as the **first child inside** the JSX element it refers to (i.e. between that element's opening `>` and its other children). The marker is dropped *into* its target, not floated above it. Newly written markers get a line of their own; older ones may share a line with the content that follows them.
- `text` is base64url-encoded JSON: `{"note": "...", "hint"?: "...", "rect"?: {"x", "y", "w", "h"}, "page"?: n}`.
  - `rect` is present when the comment was left on a dragged region rather than on an element. Values are pixels on the **1080 × 1350** carousel canvas, measured from the page's top-left corner. The marker still sits inside the deepest element that contains the region, but the note refers to what is *inside* that region. The studio UI currently does not write `rect`.
  - `page` is the 0-based index into the file’s `slides` array (the slide open in the studio when the comment was left).
- Detection regex (authoritative — use exactly this):

  ```
  /\{\/\*\s*@slide-comment\s+id="(c-[a-f0-9]+)"\s+ts="([^"]+)"\s+text="([A-Za-z0-9_\-]+={0,2})"\s*\*\/\}/g
  ```

## Procedure

1. **Identify the target file(s).**
   - If the user names a carousel or theme (`uae-omnichannel-crm`, `noir-luxe`, etc.), work on that single `index.tsx` under `src/linkedin-carousels/carousels/<id>/` or `src/linkedin-carousels/themes/<id>/`.
   - If they say "all" or don't specify, scan every `src/linkedin-carousels/carousels/*/index.tsx` and `src/linkedin-carousels/themes/*/index.tsx`. Process each file one at a time.

2. **Read the file and find all markers.**
   - Run the regex above against the whole file.
   - For each match, base64url-decode `text` and `JSON.parse` it to get `{ note, hint?, rect?, page? }`.
   - Record each hit as `{ id, lineIndex (0-based), note, hint, rect, page }`.
   - If there are no markers, tell the user and stop.

3. **Understand each comment in context.**
   - The targeted JSX element is the **enclosing** element of the marker — i.e. read upward from the marker line until you reach the unclosed JSX opening tag whose body the marker lives in. That element is the target. (For self-closing elements like `<img />` or icons, the studio hoists the marker to the nearest non-self-closing ancestor; in that case the comment usually refers to a child of the enclosing element rather than the enclosing element itself — use the `note` text to disambiguate.)
   - Read enough surrounding code (parent element, sibling elements, tokens, inline styles) to apply the change faithfully. A comment inside a `<div>` with an inline `background` style usually refers to that element's styling, for example.
   - When the payload has a `rect`, work out which children of the enclosing element fall inside that region (compare their positions and sizes against the rect on the 1080×1350 canvas) and apply the note to those — not to the whole enclosing element.
   - If the `note` is ambiguous, do the smallest reasonable interpretation and mention the assumption in your summary.

4. **Apply edits in reverse line order.**
   - Sort markers by descending `lineIndex` and process one at a time, using the `Edit` tool.
   - Processing top-down would invalidate line numbers for later markers as the file shrinks/grows.

5. **Remove each marker after applying its edit.**
   - Delete the marker token. If nothing else is left on that line, delete the whole line including its trailing `\n`; if content shares the line, keep that content.
   - Never leave a marker behind for an edit you applied — that signals a failure. Markers deliberately skipped per the edge cases below stay in place.

6. **Verify.**
   - After all edits, re-read the file and confirm the only remaining markers are ones you reported as skipped.
   - Confirm the edited JSX is well-formed (balanced tags, no dangling attributes). Run `vp check` from the repo root and fix every error you introduced.
   - If the dev server is running (port 3000) and you have a browser tool, open `/linkedin-carousel` → the edited post/theme → the affected slide and confirm the change looks right.

7. **Report.**
   - Summarise: `N applied, M skipped` plus a one-line description of each change (including the carousel/theme id).

## base64url decoding helper

```js
function decode(s) {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString('utf8');
}
```

You can run this inline via `node -e '...'` if you need to inspect a payload; otherwise just reason about the decoded string.

## Edge cases

- **Marker with no enclosing JSX element** (shouldn't happen — the studio won't write one — but if you find one): delete it and note as orphan.
- **Multiple markers stacked on consecutive lines inside the same element**: they all refer to that enclosing element. Read their notes in source order to understand the combined intent, then apply and delete them bottom-up per step 4.
- **Comment asks for something outside the target element's scope** (e.g. "add a new slide"): do the closest-reasonable edit and mention the scope expansion in your summary. When adding/removing/reordering slides, renumber every `Footer page / total`.
- **Can't resolve the comment** (e.g. truly ambiguous, or the file changed shape such that the target element doesn't exist): leave the marker in place and report it as skipped. Don't guess.

## Do not

- Do not touch `package.json`, `vite.config.ts`, studio routes, or files outside `src/linkedin-carousels/carousels/` and `src/linkedin-carousels/themes/`.
- Do not add dependencies.
- Do not re-introduce markers or leave `TODO` breadcrumbs — the user already has a record in git.
