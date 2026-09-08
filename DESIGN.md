# Design system — VAmore Systems

<!-- Derived from the shipped build: index.html, products.html, products/*.html, style.css, script.js -->

The site is a **server console**. Every page is one session: log lines, status flags, spec tables and commands. The visitor is a FiveM server owner who reads resource logs daily, so the product argument is made in that language rather than in marketing-card language.

## World

- Near-black navy ground, one raised console surface, hairline rules instead of shadows or glass.
- Status is a **flooded field**: a running resource's row carries a teal wash across its full width, a building one an amber wash. The field never fades out before the price and action columns, and status never reduces to a small badge on a neutral row.
- No cards-as-page-structure, no eyebrow labels above headings, no gradient text, no glow, no unicode icons (the two icons in the build are drawn SVG).
- One authored motion moment: the home page's boot log types itself, then prints its resource lines. Everything else is instant. `prefers-reduced-motion` skips straight to the finished state.

## Tokens (`style.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--void` | `#060a0e` | page ground |
| `--panel` | `#0b1118` | console surface, tables, footer |
| `--panel-2` | `#101a24` | console bar, table head, button rest |
| `--panel-3` | `#16222e` | button hover |
| `--rule` | `#1a2530` | hairline borders |
| `--rule-bright` | `#2b3d4d` | button borders, scrollbar thumb |
| `--ink` | `#dfe8f0` | primary text |
| `--ink-2` | `#9db1c4` | secondary text, prose |
| `--ink-3` | `#6b8296` | labels, line numbers, disabled |
| `--ok` | `#25c9b0` | running / available / primary action |
| `--ok-field` | `#0d2b29` | running row wash |
| `--build` | `#f2a63c` | building / not purchasable |
| `--build-field` | `#2b2211` | building row wash |
| `--link` | `#59a0ff` | inline links |
| `--link-deep` | `#1450c8` | logo gradient only |

Radius `4px` (controls) / `6px` (surfaces). Content frame `1180px`. Line-number gutter `46px`, fixed rather than `ch`, so line 01 (set at headline size) shares a column with lines 02+.

## Type

- `--font-brand` / `--font-legend` **Martian Mono** — the legend voice: wordmark, spec keys, footer column titles, the console path. Never headings; its width breaks the type scale.
- `--font-display` / `--font-mono` **Azeret Mono** — the log voice: headings, log lines, tables, commands, figures. Monospace here carries data and commands, not decoration. It stands in for the contract's Geist Mono, which `impeccable detect` flags as overused; the substitution is cited in `.impeccable/surfaces/site.md`.
- `--font-text` **Archivo** — prose, capped at 68ch.

Headings are `500`/`600` weight with `-0.04em` tracking; `h1` tops out at 2.5rem so it reads as a printed log line, not a marketing hero.

## Components

- **`.console`** — the framed session. `.console-bar` carries path and framework list; `.console-body` holds the log.
- **`.log` / `.log-line`** — ch-based grid with a counter gutter; `.flag` (teal) and `.flag-build` (amber) mark state.
- **`.resources` / `.res-row`** — the resource table. Columns: name, status, summary, price, action. Row state classes `is-running` / `is-building` apply the wash. Collapses to a stacked layout under 860px.
- **`.cmd`** — command buttons. `.cmd-run` is the single accent action per view. On the home page it is printed inside the console as the last log line (`> buy banking`), not floated in a hero; the sticky bar carries the same destination as a secondary command. `.cmd.is-pending` is the disabled, never-clickable state used for unreleased scripts and unresolved links.
- **`.specs`** — key/value spec list, monospace, tabular figures.
- **`.ledger`** — the module listing, printed rather than carded: a numbered row per module, name in the mono legend column, description in prose. Used for Banking's six modules and Config Manager's four. There are no feature cards anywhere in the build.
- **`.verbose`** — a command button (`--verbose`, `--verbose  [on]`) matching the filter row, present on both the home page and the catalogue. The one control that changes the whole page, mirroring Config Manager's role in the product; state persists in `localStorage` and applies on load.
- **`.filters`** — `all` / `--running` / `--building`, written as CLI flags.

## Content rules

- Two resources are purchasable (Banking €40, Config Manager free); two are building (Invoices, Restaurants). The build says exactly that everywhere and never dresses a building resource as buyable.
- No invented metrics, testimonials, recordings, player counts or performance figures. The only real media are `assets/vid/admin-panel-demo.mp4` and `assets/glb/creditcard.glb`.
- Links that do not exist yet (Discord, Tebex storefront, docs, changelog, status, Impressum, privacy, terms) render as `.pending` spans marked "pending", never as live `#` links. Each carries a `TODO` comment naming what to replace it with.

## Browser surfaces

Selection, caret, focus ring and scrollbar are themed from the palette; figures are tabular by default. These are part of the system, not defaults left in place.
