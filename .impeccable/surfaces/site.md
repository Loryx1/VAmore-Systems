# Surface brief — vamore.shop (marketing site: home, catalog, product detail)

Mode: Persuade.

## Direction contract

THESIS: The site is the server console this buyer already lives in — resources listing, starting, reporting status — so the product argument is made in the buyer's own working language. It refuses the category arrangement: no centered hero over a three-up grid of glass feature cards, no neon glow, no eyebrow labels, no adjectives standing in for specs.

OWN-WORLD: Near-black navy ground (#080c11) with one raised console surface (#0e141c) and hairline rules (#1e2833) instead of shadows or glass. Teal #25c9b0 means running/available, blue #1450c8 means link/connection, amber #f0a02a means building/not yet purchasable — status is a flooded field, never a tinted badge on a neutral row. Type is a console stack: Martian Mono for legends, commands and status, Geist Mono for log lines and tabular figures, Archivo for prose. Everything sits on a ch-based column grid; figures are tabular. Components are log lines, status rows, spec tables, and command buttons — never cards.

STORY: The visitor lands mid-boot, reads two resources actually running and two building, understands that every script registers into one Config Manager, checks the real feature depth in tabular form, and runs the buy command on the module they came for.

FIRST VIEWPORT: One console frame spanning the full width, left-aligned, line-number gutter down its left edge. The wordmark types itself as the first log line, the positioning line as the second, then real resource lines print one per frame with their status flags. Primary action `> buy banking` sits inline in the log as the last printed line, not floating in a hero. No image, no gradient, no card.

FORM: Server Console — candidate 1 of my ordered grounded list (txAdmin/FiveM resource logs), chosen by the user over the dealt lead. Seed key 537141ca, scope direction, mode persuade, assigned index 6 (The Patchbay) declined by the user in favor of this pick.

RAISES (donated by the challengers the direction beat):
- Teletext Service → rigid cell grid: every column is a whole ch unit, no arbitrary widths.
- Ikeda Datamatics → real tabular density: monospace figures in columns instead of three adjectives per feature.
- Angura Theatre Poster → status floods the whole row, not a badge.
- Indoor Weather Sun → one dominant gesture owns the first viewport: a single console frame, not a card grid.
- Drawcord Cape → one visible control (`--verbose`) changes the entire page's density, mirroring the Config Manager's role in the product.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Content rules for this surface

- Purchasable today: Banking (€40, Tebex 7627622), Config Manager (€0, Tebex 7627638). Everything else prints as building and never carries a buy command.
- Building: Invoices (€25, detail page exists, no Tebex package), Restaurants (no page yet).
- No invented metrics, recordings, testimonials, player counts, or performance figures. The only real media are `assets/vid/admin-panel-demo.mp4` and `assets/glb/creditcard.glb`.
- Unresolved links (Discord, Tebex store, docs, changelog, status, legal) render as explicitly disabled console entries marked `pending`, never as live links to `#`.

## Cited adaptations

- TYPE (Geist Mono → Azeret Mono). OWN-WORLD named Martian Mono for legends, commands and status and Geist Mono for log lines and tabular figures. `impeccable detect` flags Geist Mono as an overused font, so the log voice is Azeret Mono instead: a real console face with the same tabular behaviour and no category smell. The two-voice split the contract asked for is kept, not collapsed: Martian Mono holds the legend voice (`--font-legend`: spec keys, footer column titles, the console path) and the wordmark; Azeret Mono holds the log voice (headings, log lines, tables, commands, figures). Martian is not used for headings, where its width broke the type scale at every size tested.
