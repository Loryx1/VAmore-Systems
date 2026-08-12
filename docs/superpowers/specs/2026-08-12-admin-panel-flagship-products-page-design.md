# Admin Panel USP + Flagship Panels + Products Page — Design Spec

**Status:** Approved by user 2026-08-12. Builds on the current lbscripts-anatomy rebuild (`index.html`/`style.css`/`script.js` as of commit `ae299c0`). Adds a new page (`products.html`) and restructures the Suite section; does not touch Nav base structure, Hero, Feature Row, Demo, or Compare beyond what's specified here.

## Goal

Two changes:
1. Market the site's core differentiator — a planned Admin Panel that lets server owners/developers change every script's settings through a UI (buttons, input fields) instead of hand-editing `config.lua`, requiring no coding knowledge — via a new, prominent section right after the Hero.
2. Restructure the Suite section to show 4 "flagship" systems as large alternating image+text panels (lbscripts product-page style: large frameless placeholder image, heading + very short description alternating left/right), with the remaining systems moved to a new dedicated `products.html` page reachable via a "View all Scripts" button.

## Non-Goals

- No new fonts, no new brand colors — same tokens as the current dark theme.
- No change to Hero, Feature Row, Demo, Compare, or Footer content/structure beyond nav link additions.
- No real Admin Panel screenshot or real product PNGs — everything stays placeholder, consistent with the rest of the site.
- No build tooling — `products.html` is a second plain static HTML file, same pattern as `index.html`.

## A) Admin Panel Section (new, placed directly after Hero, before Feature Row)

Two-column layout (text left, placeholder mockup right — not alternating, single fixed block):
- Eyebrow/kicker: `no config.lua required` (mono label style, matching existing `.mono-label` convention).
- Headline: "Every setting, one panel." (large, matches other section H2 scale).
- Subcopy: explains the capability — each script in the suite gets its own tab in a shared Admin Panel; settings change via buttons and input fields instead of editing Lua files by hand; no coding knowledge needed.
- 3 short bullet/fact lines (mono-label style, like existing `.suite-fact` pattern reused): e.g. "One panel, every script", "Buttons and forms, not code", "No restart required (placeholder)".
- Placeholder mockup: large image-placeholder block (reuses existing frameless placeholder treatment — see §C) representing the panel UI, no real screenshot.
- **Content-integrity:** this describes a feature that does not exist yet (in development). Add an explicit `<!-- TODO -->` comment above the section noting: confirm real ship status/timeline before launch, and that the mockup is a placeholder, not a real screenshot. This follows the same discipline already applied to every other forward-looking claim on the site.

## B) Suite Section Restructure

### B1. Flagship panels (4 systems: Inventory, Phone, Housing, Dispatch — same 4 chosen in the earlier Apple-style pass, reused as the "most visual" subset)

Each panel, alternating image-left/copy-right and image-right/copy-left:
- Large placeholder image block — see §C for the "frameless" treatment.
- Heading (system name), short description (reuse the existing `SYSTEMS[i].body` string verbatim — already short, no rewrite needed), price, small "Buy on Tebex" link (`data-placeholder="true"`).
- No framework-pill row, no facts list in this compact version (kept for the full grid on `products.html` instead) — matches user's explicit "sehr kurze Beschreibung" instruction.

### B2. "View all Scripts" CTA
Below the 4 flagship panels: a button linking to `products.html` (a real, resolvable internal link — not `data-placeholder`, since the target page genuinely exists once this plan ships).

### B3. `products.html` (new page)
Same `<head>`, nav, and footer markup as `index.html` (shared header/footer for consistency). Nav links use path-qualified anchors so they work identically from either page: `index.html#suite`, `index.html#demo`, `index.html#compare`, plus a new `products.html` link labeled "All Scripts". `index.html`'s own nav gets the same "All Scripts" link added, pointing to `products.html`.

Page body: a heading ("The full suite.") + the existing static product-grid component (`.product-grid`/`.product-card`, already defined in `style.css`, currently used on `index.html`'s Suite section) — moved here, now listing **all 10** `SYSTEMS` entries (not just the 6 non-flagship ones), so this page is the complete catalog. `renderProductGrid()` in `script.js` is unchanged (still targets `#product-grid`, still reads all of `SYSTEMS`) — it simply now runs against a container that lives on `products.html` instead of `index.html`. Existing null-guard pattern (`if (!wrap) return`) means `script.js` stays a single shared file safely loaded by both pages — functions no-op harmlessly on whichever page doesn't have their target element.

## C) "Frameless" Placeholder Image Treatment

Both the flagship panel images and the Admin Panel mockup use a new placeholder style distinct from the previous "card" look: no border, no solid surface-color background — just the existing subtle repeating-diagonal-stripe fill (already used elsewhere for placeholders) sitting directly on the section background, so it reads as an image silhouette rather than a bordered card. A small mono-label caption (e.g. `va-inventory · product shot placeholder`) stays centered in the block, same convention as before. An HTML comment near the first use of this pattern notes these are placeholder shapes standing in for real PNG assets, to be replaced before launch.

## D) Content-Integrity Rules (restated)

- Admin Panel section: explicit `<!-- TODO -->` above the section (ship-status/timeline claim).
- Flagship panel bodies: already covered by the existing top-of-file `SYSTEMS` TODO comment in `script.js` — no new marker needed, same data.
- Placeholder images (flagship + admin panel mockup): noted via HTML comment as placeholder shapes, not real assets.
- "View all Scripts" → `products.html` is a real functioning link, not `data-placeholder`.

## File Impact Summary

- `index.html`: new Admin Panel section markup after Hero; Suite section markup replaced with flagship-panel container + "View all Scripts" button; nav gets an "All Scripts" link.
- `products.html` (new file): head/nav/footer mirrored from `index.html`; body has a heading + `<div class="product-grid" id="product-grid"></div>`.
- `script.js`: new `FLAGSHIP_SLUGS` (4 slugs) + `renderFlagshipPanels()` targeting a new `#flagship-list` container; `renderProductGrid()` unchanged; `DOMContentLoaded` handler calls both (each no-ops safely on the page that lacks its target).
- `style.css`: new `.admin-panel*` rules, new `.flagship-*` rules (frameless variant, distinct from the deleted card-style flagship CSS from the earlier pass), reuses existing `.product-grid`/`.product-card` unchanged.

## Self-Review

- **Placeholder scan:** no TBD — Admin Panel TODO wording specified, flagship image placeholder convention specified.
- **Consistency:** flagship panels and products.html both read from the same unmodified `SYSTEMS` array — no data divergence. Nav link scheme (`index.html#anchor`) works identically from both pages.
- **Scope:** two clearly separable additions (Admin Panel section; Suite restructure + new page) — matches what the user asked for, no extra unrequested changes.
