# Surface brief — vamore.shop (marketing site: home, catalog, product detail)

Mode: Persuade.

## Direction contract (revision 2 — replaces the Server Console world)

The Server Console build shipped and the user rejected it: it read as a script's own log output instead of a place to buy scripts. That world is the anti-reference now. Nothing carries over from it except the product truth and the content rules at the bottom of this file. User's brief for this revision: simple and clean like Apple, as appealing as lbscripts.com, dark, and the rotating 3D card kept as a real object on the page.

THESIS: this is a storefront for a small catalogue of expensive-feeling software, and it sells the way a hardware product page sells — one object at a time, held in a lot of dark air, with a short line of large type saying what it is and a real picture of the thing itself. It refuses the FiveM-store default (a wall of same-size product tiles with neon borders and glow) and it refuses the console world it replaces (log lines, status flags, line numbers, monospace as costume).

OWN-WORLD: near-black navy ground (#070b10) with a slow vertical falloff, one accent running blue #1450c8 to teal #25c9b0, spent on the primary action and on thin dividing lines and nowhere else. Surfaces are separated by air and by a barely-there panel step, never by boxes with borders. Type is a large, light grotesk at display sizes with real spacing discipline: more space above a heading than below it, one idea per screen, prose at 65-75ch. Monospace appears only where a real command or file name is quoted (`/vamoreconfig`, `config.lua`).

STORY: the visitor lands on the wordmark typing itself over a slowly rotating bank card, learns in one line what VAmore is, then walks one script per act — what it is, what it looks like running, what it costs — and buys the one they came for without ever meeting a tile grid.

FIRST VIEWPORT: centered, calm, mostly empty. Wordmark types itself, the positioning line follows, the rotating `creditcard.glb` sits under it as the single hero object, and one filled accent button says what to do next. No table, no grid, no status flags, no frame chrome.

FORM: Product showroom. Each script gets a full-width act on the home page: statement heading, two sentences, the real artifact (the card model, the panel recording), one action. The catalogue is a single clean list, not a tile grid. Detail pages use the same acts at a smaller scale.

MOTION: one authored moment (the typewriter, then the card taking up its rotation) plus a single quiet reveal used on product media only. `prefers-reduced-motion` lands on the finished state with the model paused.

RAISES kept from revision 1: real tabular figures where numbers are compared, status never dressed as a badge on a neutral row, one dominant gesture owning the first viewport.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md rewritten to the shipped world.

## Content rules for this surface

- Purchasable today: Banking (€40, Tebex 7627622), Config Manager (€0, Tebex 7627638). Everything else is shown as in development and never carries a buy action.
- In development: Invoices (€25, detail page exists, no Tebex package), Restaurants (no page yet).
- No invented metrics, recordings, testimonials, player counts, or performance figures. The only real media are `assets/vid/admin-panel-demo.mp4`, `assets/glb/creditcard.glb`, and the brand assets under `assets/`.
- Unresolved links (Discord, Tebex store, docs, changelog, status, legal) render as visibly disabled entries marked `pending`, never as live links to `#`.

## Cited adaptations

- TYPE. The console stack (Martian Mono + Geist/Azeret Mono) dies with revision 1. The display and text voice is a single light grotesk; Martian Mono survives only in the wordmark lockup, where the brand assets already use it. Monospace is kept for quoted commands and file names, which is what the craft floor allows it for.
