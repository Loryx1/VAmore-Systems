# lbscripts-Anatomy Rebuild — Design Spec

**Status:** Approved by user 2026-08-12. **Supersedes** the structural decisions of `2026-08-12-apple-lbscripts-redesign-design.md` (that spec's Apple-style flagship panels, trust bar, pricing section, and support-stats section are all removed by this pass). This is a full rebuild of `index.html`, `style.css`, and `script.js` — not a patch on top of the previous version.

## Goal

The previous redesign made the page too long and visually "stretched out." Rebuild the page from scratch with a much closer structural mirror of lbscripts.com's actual page anatomy (nav → centered hero → 3-column feature row → product grid → footer), in a full-dark theme, kept compact. Demo and Compare are kept as additional sections after the lbscripts-core, compacted. Pricing and Support-stats sections are dropped entirely. This is not a hybrid of the old page and lbscripts — it's a new page taking its structure from lbscripts and its content/brand from VAmore.

## Non-Goals

- No new fonts (keep Instrument Sans + Martian Mono).
- No new brand colors (keep `--color-accent-blue: #1450c8`, `--color-accent-teal: #0a6f68`, `--color-accent-teal-bright: #25c9b0`).
- No interactive picker/flagship-panel JS complexity — the product grid is static cards, no click-to-expand state.
- No pricing/bundle section, no support-stats section — dropped per explicit user decision.
- No build tooling — plain HTML/CSS/JS, no dependencies.
- Placeholder-content-integrity convention stays in force: every specific-sounding numeric/factual claim not already `(placeholder)`-labeled gets an explicit `<!-- TODO -->` / `//` comment.

## A) Color System (full-dark)

New `:root` tokens (replacing the current light-based ones):

```
--color-bg: #0a0f16          (base page background, near-black)
--color-bg-alt: #060a10      (slightly darker, used for section rhythm alternation)
--color-surface: #101927     (elevated card background — replaces white cards)
--color-text: #f5f7fa        (primary text, near-white)
--color-text-secondary: rgba(245, 247, 250, 0.72)
--color-text-muted: rgba(245, 247, 250, 0.54)
--color-border: rgba(245, 247, 250, 0.10)
--color-border-soft: rgba(245, 247, 250, 0.18)
--color-accent-blue: #1450c8        (unchanged)
--color-accent-teal: #0a6f68        (unchanged)
--color-accent-teal-bright: #25c9b0 (unchanged, primary on-dark accent — used more heavily now, it already reads well on dark per the old .section-dark sections)
```

- No more separate `--color-dark-bg`/`--color-dark-bg-2` tokens — the whole page is dark by default now, so the old light/dark section split collapses. `--color-bg-alt` takes over the old `.section-dark` alternation role (subtle rhythm, not a hard light/dark break).
- "Solid/emphasis" elements (primary CTA buttons, active states) invert to white-on-dark — reusing the pattern the old page already used for `.btn-light` and the active demo-chapter button (`background:#fff; color: var(--color-bg)`), now applied as the default for `.btn-primary` and `.pill-solid` too.
- Card surfaces (product cards, hero visual block, compare table, demo video placeholder) use `--color-surface`, not white and not pure `--color-bg` — gives depth without introducing a second bright color.

## B) Page Structure (top to bottom)

### 1. Nav
Fixed, blurred dark background on scroll. Logo (existing inline SVG gradient mark, unchanged) + centered menu (`Suite`, `Demo`, `Compare`) + right side: Discord pill (`href="#" data-placeholder="true"`) + primary CTA button linking to `#suite`.

### 2. Hero
Centered single-column (not the old two-column copy+card layout). Contains, in order: small pill/badge row (framework badges: ESX/QBCore/Qbox/Standalone — real facts), headline ("Ten systems that were written to talk to each other." — reuse existing copy), subheadline paragraph (reuse existing copy), one or two centered CTA buttons ("View the suite" → `#suite`, "See how it runs" → `#demo`). No hero card/console visual — lbscripts' hero has no accompanying visual element, just centered text and a button, so this version drops the old `.hero-card` entirely for a closer structural match.

### 3. Feature Row
Three columns, each: a small symbol/icon (reuse simple unicode glyphs in the mono font, matching lbscripts' visual approach: `↻` `◆` `10`), a heading, a one-line description:
1. `↻` "Regular updates" — "Continuous improvements across the suite. (placeholder — confirm real update cadence before launch)"
2. `◆` "Active support" — "We're here when something breaks. (placeholder — confirm real support commitment before launch)"
3. `10` "Systems, one codebase" — real fact, derived from `SYSTEMS.length`, no placeholder needed (same reasoning as the old trust bar's "10 systems · 1 codebase").

This directly replaces the old trust-bar section — same credibility-signal purpose, lbscripts' actual layout.

### 4. Product Grid ("Suite")
Section heading + one static grid of all 10 `SYSTEMS` entries as cards (no picker, no expand/collapse). Each card: slug pill, name, price, one-line body text (truncate/reuse existing `body` strings as-is, they're already short), framework pills, "Buy X on Tebex" button (`data-placeholder="true"`). Grid: `repeat(auto-fit, minmax(260px, 1fr))`, roughly 3-4 columns on desktop, 1 on mobile. This replaces both the old flagship-panel block and the old compact picker — one unified, static, much shorter section.

### 5. Demo (kept, compacted)
Same content/functionality as before (headline, subcopy, video placeholder, chapter buttons, `initDemoChapters()` JS unchanged in behavior) but visually tightened: shorter video placeholder height, tighter internal gaps, reduced section padding (see §C).

### 6. Compare (kept, compacted)
Same table content/rows as before, tightened padding and row height.

### 7. Footer
Restructured to match lbscripts' anatomy: logo block on the left, link-group columns in the middle (`Suite` links, `Resources` links, `Company`/support links), legal row at the bottom (copyright, Impressum/Privacy/Terms placeholders). Content is materially the same as the current footer's links — just laid out to match lbscripts' left-logo / middle-columns / bottom-legal pattern (the current footer is already close to this; only visual/spacing tightening needed, not a content rewrite).

## C) Compactness

- `.section` base padding: roughly halved from the previous pass — target `clamp(48px, 6vw, 88px)` (down from `clamp(90px, 12vw, 170px)`).
- Hero padding-top reduced (no longer needs to clear a two-column card layout) — target `clamp(140px, 18vh, 200px)` top, `clamp(48px, 7vw, 90px)` bottom.
- Demo video placeholder height: target `clamp(180px, 28vw, 380px)` (down from `clamp(220px, 42vw, 640px)`).
- Section heading scale pulled back slightly from the last pass (which was tuned for a much taller page): target `clamp(30px, 4.4vw, 58px)` for section H2s, hero H1 stays large but reined in from the last pass's 116px peak — target `clamp(42px, 7vw, 92px)` since hero is now centered/shorter, not fighting a two-column card for visual weight.
- Product grid cards: compact padding, no oversized image placeholders (no flagship-style 320-520px tall image blocks) — each card is text/data-forward like lbscripts' product cards, not a big visual block.

## D) Content-Integrity

- Feature-row items 1 and 2 (Regular updates, Active support) get explicit `<!-- TODO -->` comments — they're service-quality claims about a business that doesn't have real operating history yet, same discipline as the rest of the site.
- Feature-row item 3 (10 systems) stays unmarked — it's a verifiable fact about the code, not a claim.
- Product grid inherits the existing `SYSTEMS` placeholder marking (top-of-file comment already covers slugs/names/prices/bodies/ui-shot labels — carried over unchanged, no image placeholders needed in this simpler card design so the "ui shot" labeling question doesn't apply here).
- All Tebex/Discord links keep `href="#" data-placeholder="true"`.

## E) Removed From The Previous Pass

- Trust bar section (replaced by Feature Row).
- Flagship panel concept (`FLAGSHIP_SLUGS`, `renderFlagshipPanels()`, `.flagship-*` CSS) — removed entirely.
- Interactive suite picker (`initSuite()`, `renderSuitePanel()`, `.suite-list`/`.suite-panel`/`.suite-row` CSS) — removed entirely, replaced by the static product grid.
- Pricing section (`#pricing`, `.pricing-*` CSS, `renderPricingPills()`) — removed entirely.
- Support-stats section (`#support`, `.support-*`/`.stat-*` CSS) — removed entirely.
- Glow tokens/effects (`--glow-blue`/`--glow-teal`, `::before` glow blocks) — removed; the previous pass's glow mechanism had a real stacking-context bug once already, and lbscripts' actual aesthetic doesn't use them — a plainer, flatter dark surface is closer to the reference and lower-risk.

## Self-Review

- **Placeholder scan:** no TBD/vague items — every new claim (feature-row 1 & 2) has explicit TODO wording specified above.
- **Consistency:** product grid reuses the existing `SYSTEMS` array unchanged — no new data source, no divergent content.
- **Scope:** this is a full rebuild, explicitly authorized as such by the user ("komplett neues Layout... völlig neue Seite") — not scope creep, it's the stated goal.
- **Cross-check with removed content:** confirmed with user that Pricing and Support sections are intentionally dropped, not an oversight.
