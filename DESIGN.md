# Design system — VAmore Systems

<!-- Derived from the shipped build: index.html, products.html, products/*.html, style.css, script.js -->

The site is a **product showroom on a dark ground**. One object or one argument per screen, held in a lot of air, with large light type and a single accent spent on the action. It sells the way a hardware product page sells. It is deliberately not the FiveM-store default (a wall of glowing product tiles) and not the console world it replaced (log lines, status flags, monospace everywhere).

## World

- Near-black navy ground with a slow vertical falloff, no bloom behind the hero. Sections are separated by air and one hairline, never by boxes.
- Teal is the only saturated colour in the interface: the primary button, the available-now dot, the focus ring, the caret. The blue-to-teal brand gradient appears in the logo mark and in the short accent rule at the start of each section divider. There is no second status hue: in development is a hollow dot on neutral text.
- No cards as page structure, no eyebrow labels, no gradient text, no glow shadows, no unicode icons (every icon is drawn SVG).
- Motion: one authored moment — the wordmark types itself, the subline follows, then the 3D card takes up its rotation. Product media fades in once on first view. Under `prefers-reduced-motion` the page lands on the finished state: no model rotation anywhere, and both videos hold the frame that proves their claim with controls exposed.

## Tokens (`style.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#070b10` | page ground |
| `--bg-panel` | `#0e151e` | media frames, closing band |
| `--line` / `--line-soft` | `rgba(190,214,238,.10)` / `.055` | hairlines, button borders |
| `--ink` | `#f3f7fb` | headings, primary text |
| `--ink-2` | `#a6b8ca` | prose |
| `--ink-3` | `#8397ab` | labels, notes, pending items |
| `--brand-a` → `--brand-b` | `#1450c8` → `#25c9b0` | logo mark, and the short accent rule that starts every section divider |
| `--ok` | `#25c9b0` | primary action, available now |
| `--link` | `#6aa8ff` | inline links |

Radius: `999px` on buttons, `22px` on media frames. Content frame `1120px`, wide frame `1280px`. Section rhythm `96px` mobile / `132px` desktop.

## Type

- **Schibsted Grotesk** carries display and text at weight 400: `h1` runs to 5.6rem in the hero and 4rem elsewhere, tracking `-0.035em`; body 17px/1.6. Prose is capped at 68ch.
- **Martian Mono** is the wordmark lockup only.
- **Azeret Mono** appears only inside `code` — real commands and file names (`/vamoreconfig`, `config.lua`). Never as decoration.
- Figures that are compared carry `tabular-nums` (`.num`, prices, spec values).

## Components

- **`.hero`** — centred, calm: typing headline, subline, one filled action, one quiet action, then `.stage`.
- **`.stage`** — the hero object: `creditcard.glb` in `model-viewer` at `field-of-view: 17deg` so the card owns the viewport, rotation started by the typewriter's completion, depth carried by the model's own shadow and nothing else.
- **`.act`** — a product act: copy on one side, the real artifact on the other. `.flip` reverses the order. This is the page's main structure, in place of a card grid.
- **`.act-media` / `.detail-media`** — the media surfaces: a panel gradient and a 22px radius, no border. Surfaces separate by air and by that step, never by a drawn box.
- **`.lines`** — feature listings as full-width rows (name column, description column). No boxes, no equal-height tiles.
- **`.specs`** — key/value rows with tabular figures, used wherever numbers or capabilities are compared.
- **`.catalog` / `.item`** — the lineup: one row per script with name, status, one-line summary, price and an arrow. Rendered from `RESOURCES` in `script.js`, so home and catalogue can never disagree.
- **`.status`** — a dot plus a word in neutral text: a filled teal dot for "Available now", a hollow ring for "In development". Never a filled badge.
- **`.btn`** — `.btn-primary` (solid teal, dark label) is the single accent action per view and always reaches Tebex checkout; `.btn-quiet` is the outlined secondary, used for the persistent nav action and for navigation; `.btn.is-disabled` is the never-clickable state used for unreleased scripts. A button labelled "Buy" always buys.
- **`.close-band`** — the one lifted surface on the page, closing the home page with the two real actions.
- **`.pending`** — an unresolved link, rendered as dimmed text with a `· pending` suffix and `not-allowed`, never as a live link.

## Content rules

- Two scripts are purchasable (Banking €40, Config Manager free); two are in development (Invoices, Restaurants). The build says exactly that and never dresses an unfinished script as buyable.
- No invented metrics, testimonials, recordings, player counts or performance figures. The only real media are `assets/vid/admin-panel-demo.mp4`, `assets/glb/creditcard.glb` and the brand assets.
- Links that do not exist yet (Discord, Tebex storefront, docs, changelog, status, Impressum, privacy, terms) render as `.pending`, each with a `TODO` comment naming its replacement.

## Browser surfaces

Selection, caret, `accent-color`, focus ring and scrollbars are themed from the palette. These are part of the system, not defaults left in place.
