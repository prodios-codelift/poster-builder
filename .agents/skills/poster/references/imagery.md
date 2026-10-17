# Imagery — photos and icons

How to think about, choose, source and credit visuals for posters and carousels. The `poster` and `linkedin-carousel` skills both use this guide.

## 1. Decide what the visual is for, before you search

A visual earns its place by doing one job. Name the job first, because it decides what you search for:

| Job | Example | What to look for |
| --- | --- | --- |
| **Set the mood** | Conference poster, culture post | Atmosphere, light, place; no clear "subject" needed |
| **Show the subject** | Product launch, Dubai event, a city or venue | The real thing, recognisable at thumbnail size |
| **Stand for an idea** | "Growth", "focus", "trust" | A metaphor (see below), not a literal diagram |
| **Support a number** | Stat card | Usually *no photo*. A big icon or pure type is stronger |

**No photo is a valid choice.** Big-type statements, stat cards and quote cards are often stronger without one. Don't add a photo just to fill space.

## 2. Turn the concept into search terms

Think like a photo editor, not a keyword matcher.

- **Go one step sideways from the literal.** Literal searches return clichés. Metaphors read faster and look less like stock.

  | Idea | Avoid (cliché) | Try instead |
  | --- | --- | --- |
  | Growth | arrow chart, coins stack | seedling, staircase, sunrise over a field, climbing wall |
  | Teamwork | handshake, hands in a circle | rowing crew, orchestra, a kitchen line at service |
  | Focus | target with darts | a single lit window, a long-exposure road, a lone chess piece |
  | Speed / efficiency | rocket launch | cyclist motion blur, a train in a station, a coffee pour |
  | Customer conversations | headset call centre | a market stall chat, a café counter, a hand holding a phone |
  | Security / trust | padlock on a keyboard | a lighthouse, a vault door, a bridge's cables |
  | Ideas / innovation | lightbulb | a sketchbook spread, a workshop bench, prisms of light |
  | Remote work | laptop on a beach | a quiet desk by a window, a home office at dawn |

- **Write 3–5 query variants** per concept, mixing literal and metaphorical terms.
- **Add composition and mood words** that fit the layout: `minimal`, `negative space`, `top view`, `flat lay`, `close up`, `wide`, `soft light`, `golden hour`, `monochrome`, `pastel`, `dark moody`.
- **Match orientation** to where the photo sits: `portrait` for a full-bleed cover, `landscape` for an `ImageSplit` band, `squarish` for a tile.
- **Localise** when the audience is regional: a UAE audience → Dubai/Abu Dhabi streets, Gulf architecture, desert light, regional dress where appropriate. Avoid generic Western office scenes for a Gulf business post.

## 3. Choosing between candidates

Pick the photo that passes most of these:

- **One clear focal point**, readable at about 300 px wide (feed thumbnail size).
- **Negative space where the text goes.** Sky, wall, desk or blur on the side or end opposite the subject.
- **Survives the theme's treatment.** Many themes tint photos (duotone, grayscale + blend). Pick photos with clear light and dark areas. Flat, low-contrast or very dark photos turn into a solid block once tinted.
- **Fits the palette's temperature** (warm photo + warm palette) when the theme doesn't tint.
- **Authentic over posed.** Real light, real places, candid moments. Skip the over-lit studio smile.
- **Inclusive and region-appropriate people.** Their age, gender and ethnicity should match the audience you're speaking to.
- **No visible brands, logos, readable text or watermarks** in the frame. They compete with your message and raise trademark issues.
- **No faces that imply an endorsement** or a customer story.

## 4. Composition on the canvas

- **One photo per poster.** In carousels, a photo slide at most every 3–4 slides.
- Place the subject on a **rule-of-thirds** line, away from the headline.
- **Never put body text straight on a busy photo.** Use the theme's `PhotoBackdrop` (fades to `bg` under the text), a solid panel, or text below the photo. Large headlines may sit on a calm area of the photo only when the contrast is ≥ 4.5:1 everywhere the text sits.
- Crop to the slot it's shown in (`object-cover`, explicit width/height) and check the crop doesn't cut through heads or the subject.

## 5. Ethics and evidence

- Stock photos **set a mood. They are never evidence.**
- No strangers presented as customers, employees, speakers or the author. No stand-in screenshots or fake product shots.
- A slide that needs a real portrait, product screenshot, team photo or logo needs the **real file from the user**. Look in the global `assets/` folder first. If it isn't there, ask the user for it and save it there.

## 6. Sourcing photos from Unsplash

Use only photos under the free **Unsplash License**. Skip **Unsplash+** photos (marked "Unsplash+", or with a lock or "premium" badge); they need a paid licence.

Work through these options in order:

### A. An Unsplash tool is available → use it

Check the session for a tool whose name contains `unsplash`. It may be loaded already or deferred, so run `ToolSearch` with the query `unsplash`. If one exists, use it to search (with orientation and colour filters if it offers them) and to download. Record the **photographer name** and the **photo page URL** (`https://unsplash.com/photos/<id>`) from its result.

### B. `UNSPLASH_ACCESS_KEY` is set → use the API

```bash
curl -s -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" \
  "https://api.unsplash.com/search/photos?query=dubai%20skyline%20dusk&orientation=portrait&per_page=10&content_filter=high"
```

From each result use `user.name` (photographer), `links.html` (photo page), `urls.raw` (image) and `premium` (skip if `true`). Before downloading, call the photo's `links.download_location` with the same header; the API guidelines require this to count the download. Never print or commit the key.

### C. No tool, no key → use the plain URLs

1. **Search** with `WebSearch` restricted to Unsplash (for example `site:unsplash.com/photos dubai skyline dusk`). Unsplash's bot check blocks scripted browsing of its search pages. Don't try to get past it. Opening a single photo page with `WebFetch` or the built-in browser is fine if it loads.
2. **Collect photo page links** (`https://unsplash.com/photos/<slug>-<id>`; the id is the last segment after the final `-`). Note the photographer from the page or search result, and skip anything marked Unsplash+.
3. **Download** with `https://unsplash.com/photos/<id>/download?force=true`, which redirects to `images.unsplash.com`. **A redirect anywhere else means Unsplash+ or a removed photo, so reject it.** Request the crop directly with the image parameters below (append them to the final `images.unsplash.com` URL, or `curl -L` the download link and resize afterwards).
4. **Download into the scratchpad first** and check the file (JPEG, ≤ ~350 KB, subject matches) before copying it into `assets/`.
5. If unsplash.com can't be reached, many Unsplash originals are mirrored on Wikimedia Commons (search "<subject> unsplash" on commons.wikimedia.org). Credit the photographer and Unsplash URL, plus the Commons file page.

### Download at the right size

`images.unsplash.com` URLs accept resizing parameters, so you rarely need to resize locally:

```bash
mkdir -p src/linkedin-carousels/carousels/<slug>/assets
curl -L -o src/linkedin-carousels/carousels/<slug>/assets/cover.jpg \
  "https://images.unsplash.com/photo-XXXXXXXX?w=1080&h=1350&fit=crop&crop=entropy&q=78&fm=jpg"
```

| Slot | Size (w × h) |
| --- | --- |
| Full-bleed 4:5 poster or cover | 1080 × 1350 |
| Top-of-slide photo (`PhotoCover`) | 1080 × 600 |
| `ImageSplit` band | 1200 × 700 |
| Square tile | 600 × 600 |

`crop=entropy` keeps the busiest region; use `crop=faces` for portraits, or `crop=focalpoint&fp-x=0.3&fp-y=0.5` to steer it. Keep files **under ~350 KB** (lower `q` if needed) and check the file is really a JPEG (`file cover.jpg`).

### Always

- **Download into `carousels/<slug>/assets/` and import it.** Never hotlink a remote URL: the exporter can't capture cross-origin images, so the PNG/PDF comes out blank.
- Brand files the user supplies (logos, portraits, screenshots) go in the global `assets/` folder instead and are imported as `@assets/<file>`, so every post can reuse them. Stock photos stay with the post that uses them.
- Use descriptive file names (`cover.jpg`, `desert-road.jpg`).
- Add a row to `carousels/<slug>/assets/CREDITS.md` (create it if missing):

  ```md
  # Photo credits

  Photos from [Unsplash](https://unsplash.com), free to use under the [Unsplash License](https://unsplash.com/license).

  | File        | Photographer | Source                                  |
  | ----------- | ------------ | --------------------------------------- |
  | `cover.jpg` | Jane Doe     | https://unsplash.com/photos/abc123XYZ   |
  ```

- When the photo carries the concept (hero posters, covers), **show the user 2–3 candidates** (photo page links plus one line on why each fits) before building, unless they asked you to just pick.

## 7. Icons

### Which family

| Family | Package | Use when |
| --- | --- | --- |
| **Solar** (default for posters) | `@solar-icons/react` | New posters or carousels, especially colourful, product or playful looks. Its six styles, including two duotones, read well at social sizes. |
| **Lucide** | `lucide-react` | The theme's recipes already use Lucide, or you want a thin, neutral, technical line. |

**One family and one style per piece.** Never mix Solar with Lucide, or Solar `bold` with Solar `linear`, in the same poster or carousel.

### Solar styles → theme mood

| Style | Import path | Fits |
| --- | --- | --- |
| `linear` | `@solar-icons/react/linear` | Editorial, minimal, corporate, Swiss |
| `outline` | `@solar-icons/react/outline` | Same as linear, slightly heavier on dark backgrounds |
| `broken` | `@solar-icons/react/broken` | Friendly, hand-made, notebook looks |
| `bold` | `@solar-icons/react/bold` | Brutalist, high contrast, condensed impact |
| `line-duotone` | `@solar-icons/react/line-duotone` | Soft gradient, product UI, light themes |
| `bold-duotone` | `@solar-icons/react/bold-duotone` | Bento, pop, colourful brand posters |

### Usage

```tsx
import { CalendarIcon, MapPointIcon } from '@solar-icons/react/bold-duotone'

<CalendarIcon size={88} color="var(--cx-accent)" secondaryColor="var(--cx-fg)" secondaryOpacity={0.35} />
<MapPointIcon size={88} color="var(--cx-accent)" secondaryColor="var(--cx-fg)" secondaryOpacity={0.35} />
```

Props: `size` (number = px), `color`, `strokeWidth` (linear, broken and line-duotone only), `secondaryColor` and `secondaryOpacity` (duotone styles only), `alt` (adds an SVG `<title>`), plus any SVG prop (`className`, `style`). No `SolarProvider` is needed; set the props on each icon so the file stays self-contained.

Lucide, for comparison: `import { Calendar } from 'lucide-react'` → `<Calendar className="size-[88px]" style={{ color: 'var(--cx-accent)' }} strokeWidth={1.75} />`.

### Rules

- An icon is a **noun for one idea**: one icon per item, the same meaning everywhere in the piece.
- **≤ 4 icons per poster or slide**, all the same size and style, all coloured with tokens (`var(--cx-accent)`, `var(--cx-fg)`, `var(--cx-muted)`). Never hard-code colours.
- **Size ≥ 64 px** on the 1080 canvas (it shows at about 22 px on a phone). Use 120–240 px when a single icon is the hero of a poster with no photo.
- Use icons for **parallel ideas** (icon grid, tip rows, event details: date · time · place) or as a **hero** when no photo fits. Not as decoration scattered around.
- Don't use icons in place of real logos. Brand logos come from the user or a properly licensed source, credited in `CREDITS.md`.
- Import only the icons you use (unused imports fail `vp check`).
- **Credit Solar** when you use it. Add this line to `assets/CREDITS.md`: `Icons: [Solar](https://github.com/480-Design/Solar-Icon-Set) by 480 Design, CC BY 4.0.`

### Concept → icon cheat sheet

All names below were checked against the installed packages. Before using a name that isn't listed, confirm it exists with `ls node_modules/@solar-icons/react/dist/icons/linear/<kebab-name>.mjs` (component = PascalCase + `Icon`), or browse https://solar-icons.vercel.app. For Lucide, grep `node_modules/lucide-react/dist/lucide-react.d.ts`.

| Concept | Solar | Lucide |
| --- | --- | --- |
| Goal / focus | `TargetIcon` | `Target` |
| Launch / speed | `RocketIcon`, `BoltIcon` | `Rocket`, `Zap` |
| Team / community | `UsersGroupRoundedIcon`, `PeopleNearbyIcon` | `Users` |
| New hire / join | `UserPlusRoundedIcon` | `UserPlus` |
| Security / trust | `ShieldCheckIcon` | `ShieldCheck` |
| Time / deadline | `ClockCircleIcon` | `Clock` |
| Date / event | `CalendarIcon`, `TicketIcon` | `Calendar`, `Ticket` |
| Place | `MapPointIcon`, `Buildings2Icon` | `MapPin`, `Building` |
| Growth / results | `GraphUpIcon`, `GraphNewUpIcon`, `Chart2Icon` | `TrendingUp`, `ChartColumn` |
| Share / breakdown | `PieChart2Icon` | `ChartPie` |
| Conversation | `ChatRoundDotsIcon`, `UserSpeakRoundedIcon` | `MessageCircle` |
| Idea / insight | `LightbulbBoltIcon` | `Lightbulb` |
| Quality / highlight | `StarsIcon`, `StarShineIcon` | `Sparkles`, `Star` |
| Partnership | `HandShakeIcon` | `Handshake` |
| Care / culture | `HeartIcon` | `Heart` |
| Win / award | `CupStarIcon`, `MedalRibbonStarIcon` | `Trophy`, `Award` |
| Money / pricing | `WalletMoneyIcon`, `MoneyBagIcon`, `TagPriceIcon` | `Wallet`, `Tag` |
| Learning | `DiplomaIcon`, `BookBookmarkIcon` | `GraduationCap` |
| Do / don't | `CheckCircleIcon` / `CloseCircleIcon` | `CircleCheck` / `CircleX` |
| Warning / mistake | `DangerTriangleIcon` | `TriangleAlert` |
| Question / FAQ | `QuestionCircleIcon` | `CircleQuestionMark` |
| Webinar / talk | `MicrophoneIcon`, `Microphone3Icon`, `PlayCircleIcon` | `Mic`, `CirclePlay` |
| Link / visit | `LinkRoundIcon` | `Link` |
| Email / newsletter | `LetterIcon` | `Mail` |
| Commerce | `CartLarge2Icon`, `GiftIcon` | `ShoppingCart`, `Gift` |
| Work / jobs | `CaseRoundIcon` | `Briefcase` |
| Global / region | `GlobalIcon`, `EarthIcon` | `Globe` |
| Product / device | `LaptopIcon`, `SmartphoneIcon` | `Laptop`, `Smartphone` |
| Sustainability | `LeafIcon`, `Sun2Icon` | `Leaf` |
| Notification | `BellIcon` | `Bell` |
| Home / about us | `HomeSmileIcon` | `House` |
