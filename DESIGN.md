# Design system — VAmore Systems

<!-- Derived from the shipped build: index.html, products.html, products/*.html,
     legal/*.html, style.css, script.js -->

The site is a **product showroom on a dark ground with one moment of brand weather**. The home page is a showcase and nothing else: hero, four trust signals, one act per script, one closing action. Every feature list, module grid and explanation lives on the script's own page. Content sits in a lot of air with large light type; the saturated colour appears three times only — the aurora field behind the hero, the primary action, and the hairlines that open each section. Apple-grade calm, not template gloss.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no framework, no bundler: GitHub Pages serves the repository as it stands, which is why the choice is deliberate rather than lazy. External runtime dependencies are `model-viewer` (unpkg, 3D card), the Tebex checkout script, and Google Fonts.

First load of the home page is roughly **370 KB** of local assets across 7 requests, most of it the hero model. The 11.6 MB panel recording is not one of them: it sits behind a 35 KB poster frame and `preload="none"`.

## World

- Near-black navy (`#05070c`) with a slow vertical falloff. Sections separate by air and one hairline, never by boxes.
- The brand axis (blue → cyan → teal) is a gradient used as light: the hero field, the scroll-progress line in the nav and the scroll cue's pill. Section edges are a plain hairline — no gradient stripes. The primary action is white: on this ground it is the highest-contrast surface on the page, and teal stays a signal rather than a button colour. Nothing else is saturated.
- Status is a dot plus neutral text: filled teal for available, hollow ring for in development. No badges, no second hue.
- Cards carry the catalogue and the purchase column, and nowhere else: the home page stays a showcase of acts. No eyebrow labels, no gradient text, no glow shadows, no stock or emoji icons.

## Motion

One authored moment plus two quiet supports.

1. **Hero.** The wordmark types itself, the line follows, then the 3D card takes up its rotation. Behind it a WebGL curtain field drifts (custom shader, ~60 lines, no library): domain-warped fbm noise in the brand axis, drawn at half resolution, CSS-blurred, faded in over 1.4s. It stops when the hero leaves the viewport or the tab is hidden, and never starts under reduced motion.
2. **Reveal.** Media and feature blocks arrive once with opacity, a 20px rise and a 6px blur clearing, on an exponential ease-out. A 3s timer guarantees nothing stays hidden if the observer never fires.
3. **Glyphs.** Each feature icon draws its strokes once, staggered by 110ms, when its block arrives.
4. **Objects.** Models and preview plates float on a 7.5s cycle over a breathing bloom, drift with a small scroll parallax, and lean in on hover. Models are display objects, not toys: no camera controls, so a click cannot drag the card out of frame.
5. **Entrance.** On load the first screen rises into place: each element lifts 24px and fades over 1.2s on `--ease-inout`, so the motion eases in and out instead of snapping away from the start. The steps are 110ms apart behind a 160ms delay, capped at 1s, which also buys the models and images a moment to decode. An inline flag in each page head puts that first screen into its hidden state before the first paint, so nothing shows itself at full opacity and then fades in from nothing; its own 3s timer releases the page even if `script.js` never arrives. A 2.2s timer guarantees nothing stays hidden, and the classes are dropped once everyone has arrived so no element keeps a compositor layer.

Under `prefers-reduced-motion` the page lands on the finished state: no shader, no rotation, no reveal, no entrance, no typing, and the recording holds its poster frame with controls exposed.

## Tokens (`style.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#05070c` | page ground |
| `--bg-lift` | `#080c13` | footer |
| `--bg-panel` / `--bg-panel-2` | `#0c121b` / `#111925` | media surfaces, closing band, skip link |
| `--line` / `--line-soft` | `rgba(180,208,235,.12)` / `.06` | hairlines, button borders |
| `--ink` | `#f4f8fc` | headings, primary text |
| `--ink-2` | `#a9bbcd` | prose |
| `--ink-3` | `#8598ac` | labels, notes, pending items |
| `--blue` `--cyan` `--teal` | `#1450c8` `#17a2c9` `#25c9b0` | the brand axis |
| `--brand-axis` | gradient of the three | hero field, progress line, section rules |
| `--ok` | `#25c9b0` | available now, focus ring, the glow under the primary action |
| `--link` | `#6aa8ff` | inline links |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | hover and state transitions |
| `--ease-inout` | `cubic-bezier(.37,0,.63,1)` | the load entrance, in and out |
| `--shadow-sm` / `--shadow-md` | contact + fall | depth on buttons, tags, chips, thumbs / on cards, media, bands |

Every raised element carries a shadow: a close contact shadow plus a wider fall, so buttons, tags, chips, thumbnails, cards, media frames and bands sit above the ground rather than on it.

Radius `10px` on buttons, `16px` on cards and the purchase column, `20px` on framed media and preview plates, `6px` on chips. Nothing is a pill except the scroll cue. Frames `1120px` / `1280px`. Section rhythm 116px mobile, 176px desktop; showcase acts sit 104-200px apart.

## Type

- **Archivo** carries display: `h1` at 700 up to 5.4rem in the hero, `h2` at 600, tracking `-0.045em` / `-0.04em`. A workhorse grotesk with real weight, chosen over the fashionable display faces that mark a page as generated.
- **IBM Plex Sans** carries text: 17px/1.6, prose capped at 68ch. It reads as engineering documentation rather than as a startup template. Showcase copy runs at 1rem in `--ink-3` so the object and the name lead, not the paragraph.
- **Martian Mono** for the wordmark lockup only.
- **Azeret Mono** inside `code` only — real commands and file names (`/vamoreconfig`, `config.lua`).
- Compared figures carry `tabular-nums`.

## Components

- **`.nav`** — sticky, blurred, with `.nav-progress`: a 1px scroll-progress line in the brand axis. It carries Products plus `.nav-soon` entries (Discord, YouTube) that are visibly not clickable yet, and no product-specific call to action: the catalogue is broader than any one script.
- **`.hero` / `.aurora` / `.stage`** — the first viewport: shader field, typing headline, one filled action, the rotating `vamore_logo.glb`, and a `.scroll-cue`: a rounded pill with a translucent brand gradient and a light that sweeps down it.
- **`.trust` / `.tag` / `.chip`** — small labels on their own lifted surface: a step lighter than the ground, a hairline, a contact shadow and a teal dot on the trust row. Used for the four signals under the hero and for framework chips.
- **`.btn`** — `.btn-primary` is white with a dark label: it carries buying and View details, rises 2px on hover, darkens slightly as it lifts, throws a white glow around itself and lets a metal glare cross it. `.btn-quiet` is the outlined secondary; `.btn.is-disabled` is the never-clickable state used for unreleased products. A button labelled "Buy" always buys.
- **`.act`** — a product act: copy on one side, the real artifact on the other. `.flip` reverses it, and the home page alternates sides down the showcase.
- **`.is-object`** — how a 3D model or a preview plate is presented: no panel behind it, a brand-light bloom that breathes on an 11s cycle, a soft contact shadow beneath, a 7.5s float, and a small scroll parallax so the object drifts slower than the page.
- **`.show-blank`** — the preview plate for anything without a shipped visual: a dashed frame, the brand mark and an honest line. Config Manager uses it too until its model exists; the real recording stays on its detail page.
- **`.act.show`** — the home showcase: one act per script with a status and price line, the name, two sentences, and a single View details action. Depth lives on the detail page, never here.
- **`.player`** — poster image, real `<video>` behind it, an explicit play control, and lazy loading. Playback starts when the block is 40% on screen.
- **`.features` / `.feature`** — the module grid: hairline-separated cells with a self-drawing glyph, a heading and two lines. Not cards; no shadows, no rounded floating boxes.
- **`.schematic`** — the registration diagram: four scripts wired into one panel, the two shipping scripts on live wires. It lives on the Config Manager page, where the claim it illustrates is made.
- **`.grid-cards` / `.card`** — the catalogue: a cover (model, image or preview plate), then name with its rating, status, one line of copy, framework chips, and a footer that carries the price on the left and View details on the right. Rendered from `RESOURCES` in `script.js`, so home and catalogue can never disagree.
- **`.stars`** — the rating row. It draws from real reviews only: with none on record every product shows five empty stars and `(0)`, never an invented score.
- **`.detail-grid` / `.gallery` / `.buy-card`** — the product page, laid out the way this category expects one: media on the left, full-bleed with no frame around it, with arrows and a thumbnail strip, and on the right a purchase column with no box around it: name at 3.6rem, rating, status, framework chips, price at 3rem, a full-width action, then hairline-divided disclosure panels, a documentation block, a file tree and one at-a-glance card. The card is the only boxed element on the page.
- **`.slide-empty` / `.thumb.is-empty`** — a wired but unfilled screenshot slot: a dashed inner outline, a drawn image glyph and the name of the shot that belongs there. Banking has four, Invoices three; each carries a TODO with the 16:9 file path to drop in. Media is letterboxed, never cropped: a panel recording loses its meaning when its save bar is clipped.
- **`.stat-card`** — the two-figure card at the foot of the purchase column. It carries only counts we can verify (modules, frameworks); server and player numbers stay absent until real telemetry exists.
- **`.tree`** — the resource's actual file structure, read from the shipped repository rather than illustrated.
- **`.panels` / `.panel`** — native `<details>` disclosures for description, requirements, support and the pre-sale questions. Closed by default except the description.
- **`.specs` / `.lines`** — key/value and name/description rows with tabular figures.
- **`.close-band`** — the one lifted surface, closing home and catalogue with the two real actions.
- **`.prose` / `.notice`** — the legal pages, in the same system, with the placeholder notice marked rather than dressed up.
- **`.pending`** — an unresolved link: dimmed, `not-allowed`, suffixed `· pending`.

## Accessibility

Skip link on every page; `:focus-visible` ring in teal at 3px offset; nav marks the current page with `aria-current`; every icon is `aria-hidden` beside real text; the recording carries a described `alt` on its poster and an `aria-label` on the play control; the diagram is an `img` role with a text label. Contrast for body and label text clears WCAG AA on the ground.

## Content rules

- Two scripts are purchasable (Banking €40, Config Manager free); two are in development (Invoices, Restaurants). The build says exactly that and never dresses an unfinished script as buyable.
- No invented metrics, testimonials, ratings, recordings, player counts or performance figures. Rating rows render empty with a count of zero until real reviews exist, and the stat card names only what can be counted in the repository. The only real media are `assets/admin-panel-demo.mp4`, its extracted poster `assets/img/panel-poster.jpg`, `assets/img/panel-24.jpg` and `assets/img/panel-33.jpg` (frames from that same recording), `assets/glb/vamore_logo.glb` (hero), `assets/glb/creditcard.glb` (Banking) and the brand assets.
- Links that do not exist yet (Discord, Tebex storefront, docs, changelog, status) render as `.pending` with a `TODO` naming the replacement. Legal pages exist but state plainly that their content is not published yet.
