# Design system — VAmore Systems

<!-- Derived from the shipped build: index.html, products.html, products/*.html,
     legal/*.html, style.css, script.js -->

The site is a **product showroom on a dark ground with one moment of brand weather**. The home page is a showcase and nothing else: hero, four trust signals, one act per script, one closing action. Every feature list, module grid and explanation lives on the script's own page. Content sits in a lot of air with large light type; the saturated colour appears three times only — the aurora field behind the hero, the primary action, and the hairlines that open each section. Apple-grade calm, not template gloss.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no framework, no bundler: GitHub Pages serves the repository as it stands, which is why the choice is deliberate rather than lazy. External runtime dependencies are `model-viewer` (unpkg, 3D card), the Tebex checkout script, and Google Fonts.

First load of the home page is roughly **370 KB** of local assets across 7 requests, most of it the hero model. The 11.6 MB panel recording is not one of them: it sits behind a 35 KB poster frame and `preload="none"`.

## World

- Near-black navy (`#05070c`) with a slow vertical falloff. Sections separate by air and one hairline, never by boxes.
- The brand axis (blue → cyan → teal) is a gradient used as light: the hero field, the scroll-progress line, the short rule that opens each section. Flat teal carries the primary action. Nothing else is saturated.
- Status is a dot plus neutral text: filled teal for available, hollow ring for in development. No badges, no second hue.
- No cards as page structure, no eyebrow labels, no gradient text, no glow shadows, no stock or emoji icons.

## Motion

One authored moment plus two quiet supports.

1. **Hero.** The wordmark types itself, the line follows, then the 3D card takes up its rotation. Behind it a WebGL curtain field drifts (custom shader, ~60 lines, no library): domain-warped fbm noise in the brand axis, drawn at half resolution, CSS-blurred, faded in over 1.4s. It stops when the hero leaves the viewport or the tab is hidden, and never starts under reduced motion.
2. **Reveal.** Media and feature blocks arrive once with opacity, a 20px rise and a 6px blur clearing, on an exponential ease-out. A 3s timer guarantees nothing stays hidden if the observer never fires.
3. **Glyphs.** Each feature icon draws its strokes once, staggered by 110ms, when its block arrives.

Under `prefers-reduced-motion` the page lands on the finished state: no shader, no rotation, no reveal, no typing, and the recording holds its poster frame with controls exposed.

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
| `--ok` | `#25c9b0` | primary action, available now |
| `--link` | `#6aa8ff` | inline links |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | every transition |

Radius `999px` on buttons, `24px` on media surfaces. Frames `1120px` / `1280px`. Section rhythm 96px mobile, 136px desktop.

## Type

- **Schibsted Grotesk**, weight 400 for display: `h1` to 5.6rem in the hero, 4rem elsewhere, tracking `-0.035em`. Body 17px/1.6, prose capped at 68ch.
- **Martian Mono** for the wordmark lockup only.
- **Azeret Mono** inside `code` only — real commands and file names (`/vamoreconfig`, `config.lua`).
- Compared figures carry `tabular-nums`.

## Components

- **`.nav`** — sticky, blurred, with `.nav-progress`: a 1px scroll-progress line in the brand axis.
- **`.hero` / `.aurora` / `.stage`** — the first viewport: shader field, typing headline, one filled action, the rotating `vamore_logo.glb`, and a `.scroll-cue` that names the next move.
- **`.trust`** — four factual signals under the hero (frameworks, one-time purchase, in-game configuration, live apply), each with a drawn icon.
- **`.act`** — a product act: copy on one side, the real artifact on the other. `.flip` reverses it, and the home page alternates sides down the showcase.
- **`.act.show`** — the home showcase: one act per script with a status and price line, the name, two sentences, and a single View details action. Depth lives on the detail page, never here.
- **`.player`** — poster image, real `<video>` behind it, an explicit play control, and lazy loading. Playback starts when the block is 40% on screen.
- **`.features` / `.feature`** — the module grid: hairline-separated cells with a self-drawing glyph, a heading and two lines. Not cards; no shadows, no rounded floating boxes.
- **`.schematic`** — the registration diagram: four scripts wired into one panel, the two shipping scripts on live wires. It lives on the Config Manager page, where the claim it illustrates is made.
- **`.catalog` / `.item`** — the lineup, rendered from `RESOURCES` in `script.js` so home and catalogue can never disagree. Hover slides the row text and lights a brand-axis edge.
- **`.specs` / `.lines`** — key/value and name/description rows with tabular figures.
- **`.close-band`** — the one lifted surface, closing home and catalogue with the two real actions.
- **`.prose` / `.notice`** — the legal pages, in the same system, with the placeholder notice marked rather than dressed up.
- **`.pending`** — an unresolved link: dimmed, `not-allowed`, suffixed `· pending`.

## Accessibility

Skip link on every page; `:focus-visible` ring in teal at 3px offset; nav marks the current page with `aria-current`; every icon is `aria-hidden` beside real text; the recording carries a described `alt` on its poster and an `aria-label` on the play control; the diagram is an `img` role with a text label. Contrast for body and label text clears WCAG AA on the ground.

## Content rules

- Two scripts are purchasable (Banking €40, Config Manager free); two are in development (Invoices, Restaurants). The build says exactly that and never dresses an unfinished script as buyable.
- No invented metrics, testimonials, recordings, player counts or performance figures. The only real media are `assets/admin-panel-demo.mp4`, its extracted poster `assets/img/panel-poster.jpg`, `assets/glb/vamore_logo.glb` (hero), `assets/glb/creditcard.glb` (Banking) and the brand assets.
- Links that do not exist yet (Discord, Tebex storefront, docs, changelog, status) render as `.pending` with a `TODO` naming the replacement. Legal pages exist but state plainly that their content is not published yet.
