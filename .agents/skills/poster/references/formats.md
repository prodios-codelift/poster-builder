# Formats — canvas sizes and safe zones

Design for the format the post will actually be seen in. Platform UI (profile row, buttons, captions, progress bars) covers parts of the image, so keep text out of those zones.

## Status

| Format | Canvas | Aspect | Platforms | Status |
| --- | --- | --- | --- | --- |
| **Portrait feed** | 1080 × 1350 | 4:5 | LinkedIn feed and document posts, Instagram feed, Facebook, Threads | **Supported** (carousel studio) |
| Square feed | 1080 × 1080 | 1:1 | Instagram, LinkedIn, Facebook, X | Coming soon |
| Story / Reel cover | 1080 × 1920 | 9:16 | Instagram/Facebook Stories, Reels covers, LinkedIn mobile, TikTok | Coming soon |
| Landscape post | 1200 × 675 | 16:9 | X / Twitter, LinkedIn link-style images | Coming soon |
| Event / banner | 1920 × 1080 | 16:9 | Event pages, YouTube thumbnails (1280 × 720), slides, screens | Coming soon |

The engine renders only **1080 × 1350** today (`src/linkedin-carousels/dimensions.ts`). For a "coming soon" format, tell the user, then offer the 4:5 version. Build it with a simple centred stack and generous margins so it reflows once the format is supported. Don't edit `dimensions.ts`, the studio or the exporter from the poster skill. Adding formats is engine work.

## Per-format guidelines

### Portrait 4:5 — 1080 × 1350 (supported)

- Largest footprint in mobile feeds, so it's the default for LinkedIn and Instagram.
- Margins ≥ 80 px. Text ≥ 28 px (headline 120–180 px).
- Instagram's 3:4 profile grid trims about 34 px off each side of a 4:5 post (older grids showed a 1:1 centre crop). The ≥ 80 px margins cover the 3:4 trim. For older 1:1 grids, keep the headline inside the middle 1080 × 1080.
- CTA and signature sit in the bottom band (≥ 72 px from the edge).

### Square 1:1 — 1080 × 1080 (coming soon)

- About 20% less height than 4:5: cut to headline + one line + signature.
- Margins ≥ 72 px. Headline 110–160 px.
- Works everywhere. Choose it when the same image goes to X and Instagram.

### Story / Reel 9:16 — 1080 × 1920 (coming soon)

- **Top ~250 px**: profile name, progress bar. **Bottom ~340 px**: reply bar, stickers, captions. Keep text out of both.
- Usable safe area ≈ 1080 × 1330, centred. Side margins ≥ 64 px.
- Viewed full screen for 3–5 seconds: one headline (≤ 6 words), one visual, one CTA ("Link in bio", "Tap the link sticker"). Leave space for a link sticker in the lower middle.
- Full-bleed vertical photos work best. Use portrait-orientation Unsplash searches.

### Landscape 16:9 — 1200 × 675 (coming soon)

- X crops in-feed previews to about 16:9 and LinkedIn link cards to 1.91:1 (1200 × 627). Keep key content in the centre 1100 × 600.
- Text reads smaller: headline ≥ 72 px, body ≥ 32 px, ≤ 15 words total.
- Good for split layouts: photo on one half, text on the other.

### Event / banner — 1920 × 1080 (coming soon)

- Seen on bigger screens, often from a distance: title, date · time · place, logo, nothing else.
- Margins ≥ 96 px. Title 120–180 px.
- YouTube thumbnails (1280 × 720): the bottom-right corner is covered by the duration badge.

## Choosing a format for the goal

| Goal | Best format | Why |
| --- | --- | --- |
| Stop the scroll in the LinkedIn / IG feed | 4:5 | Biggest feed footprint |
| Same image across many platforms | 1:1 | Fewest crops |
| Time-boxed promo, behind-the-scenes, "today only" | 9:16 story | Full screen, swipe-up link |
| News, link share on X | 16:9 | Native preview shape |
| Event page, livestream, screen at a venue | 1920 × 1080 | Matches screens and event tools |
