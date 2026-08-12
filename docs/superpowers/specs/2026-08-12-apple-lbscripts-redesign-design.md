# Apple/lbscripts-Inspired Redesign — Design Spec

**Status:** Approved by user 2026-08-12. Builds on the existing plain HTML/CSS/JS rebuild (`2026-08-11-apple-style-rebuild-design.md`). Does not replace it — this is a visual/structural upgrade of the same three files (`index.html`, `style.css`, `script.js`).

## Goal

Give the site a more "impressive" identity, taking cues from apple.com (huge typography, generous whitespace, large alternating image/text panels, premium restraint) and lbscripts.com (dark-on-light contrast punches, trust-badge row, credibility-first hero framing) — while keeping VAmore's existing blue/teal brand palette and the project's strict placeholder-content-integrity convention (every specific-sounding claim not yet real gets an explicit `<!-- TODO -->` / `//` marker).

## Non-Goals

- No new fonts (keep Instrument Sans + Martian Mono).
- No change to the existing blue/teal color tokens.
- No structural rewrite of Demo, Compare, Support, Pricing, Footer, Nav — those get typography/spacing/contrast polish only, not new markup structure.
- No real content (prices, stats, screenshots) — still 100% placeholder, same integrity rules as the first rebuild.

## A) Global Visual System

- Hero H1 scale increases: `clamp(42px, 6.6vw, 88px)` → `clamp(46px, 8vw, 116px)`. Letter-spacing stays `-0.05em`.
- Section H2 scale increases modestly across Demo/Suite/Compare/Support/Pricing: current max ~58-64px → max ~72-80px, to stay proportionate to the bigger hero without matching it (hero must remain the visual peak of the page).
- New CSS custom properties for gradient glows, added to `:root`:
  - `--glow-blue: radial-gradient(60% 60% at 50% 50%, rgba(20,80,200,0.28), transparent 70%);`
  - `--glow-teal: radial-gradient(60% 60% at 50% 50%, rgba(37,201,176,0.24), transparent 70%);`
- Glows are applied as absolutely-positioned pseudo-elements or background layers behind section headlines (hero, flagship panels, pricing) — decorative only, `pointer-events: none`, hidden under `prefers-reduced-motion` is not required (they're static, not animated) but must not reduce text contrast (headline text stays on solid/near-solid background, glow sits behind/beside it, never directly under body copy).
- Existing `.reveal` / `initScrollReveal()` mechanism is reused for new elements (trust bar, flagship panels) — no new JS reveal system.

## B) New Trust Bar (new section, between Hero and Demo)

New `<section class="section trust">` with:
- A row of framework-compatibility badges: `ESX`, `QBCore`, `Qbox`, `Standalone` (real facts — these frameworks are genuinely what SYSTEMS support, not fabricated).
- Two stat callouts, same visual family as the existing Support-section `.stat` component but inline/compact:
  - `10 systems · 1 codebase` — real (derived from `SYSTEMS.length`, currently 10 entries) — **not a placeholder**, it's a true statement about the lineup as defined in `script.js`.
  - `— servers running the suite (placeholder)` — fabricated-sounding count, needs `<!-- TODO: placeholder trust stat — replace with a real number before launch -->` directly above it, same pattern as existing Support stats.
- No JS needed — static markup, matches existing `.pill` / `.stat` styling patterns.

## C) Suite Section — Structural Rebuild

Replaces the current single compact picker (`suite-list` + `suite-panel`) with two parts:

### C1. Flagship panels (new, full-bleed)
Four systems get large individual panels: **Inventory, Phone, Housing, Dispatch** (chosen as the four most "visual" systems — inventory/phone/housing/dispatch are the ones a buyer would want to see UI for first; the other six are supporting/utility systems).

Each panel:
- Full container width, alternating layout (odd panels: image left/copy right; even panels: reversed) — same alternation pattern Apple uses on product pages.
- Large placeholder image block (reuses the existing diagonal-stripe placeholder pattern from `.suite-panel-image`, scaled up to `clamp(320px, 38vw, 520px)` height), labeled with the same `${slug} · ui shot · WxH` mono-label convention already in `script.js`.
- Large heading (`clamp(30px, 4vw, 52px)`), one paragraph of copy (reuse existing `SYSTEMS[i].body` text), 2-3 fact chips (reuse `SYSTEMS[i].facts`), framework pills (reuse `SYSTEMS[i].fw`), price, "Buy X on Tebex" CTA (`data-placeholder="true"`, same as today).
- Alternating background: panel 1 & 3 on default light bg, panel 2 & 4 on a slightly tinted panel background (`#f4f6fa`, matches existing hero gradient's mid-tone) — for visual separation without introducing a new color.
- Rendered by a new `renderFlagshipPanel(slug)` function in `script.js` that looks up the system by slug from `SYSTEMS` and injects markup into a container — avoids duplicating system data.

### C2. "Explore the rest" (compact, existing pattern kept)
- Heading: "Explore the rest of the suite."
- Reuses the existing `suite-list` / `suite-panel` picker UI (`initSuite()`, `renderSuitePanel()`), but scoped to the remaining six systems: Banking, Jobs, Garage, Admin, Crafting, Fuel. Implementation detail for the plan: filter `SYSTEMS` by excluding the four flagship slugs, or maintain the picker over a derived subset array — plan should specify exact approach.
- Visually smaller than today's version (this was the main suite section before; now it's the secondary one) — reduce `suite-panel-image` height back down or keep as-is, plan decides based on layout balance.

### C3. Content-integrity fix (carried over)
Add a one-line JS comment above `SYSTEMS` or the panel-rendering functions noting that `ui shot · WxH` labels are placeholder mockup dimensions, not real screenshots — closes the inconsistency where the demo video's resolution claim got an HTML `<!-- TODO -->` but the suite panel image labels didn't.

## D) Other Sections — Polish Only

For Demo, Compare, Support, Pricing, Footer, Nav:
- Increase heading scale per the "Global Visual System" numbers above.
- Increase section vertical padding slightly where it reads cramped next to the new bigger hero/flagship panels (exact clamp values decided at plan-writing time, staying within the existing `--radius-card` / spacing-token system).
- Nav: no structural change; optionally increase logo/link letter-spacing tightness to match the bolder identity — cosmetic, low-risk.
- No new markup structure, no new components, no content changes beyond what's already placeholder-marked.

## E) Content-Integrity Rules (unchanged, restated for this pass)

Every specific-sounding numeric/factual claim introduced by this redesign that isn't already covered by explicit `(placeholder)` labeling gets an HTML `<!-- TODO: ... -->` comment (or `//` in JS) directly above it, describing what needs to be replaced before launch. This applies to: the new trust-bar server count, and nothing else new (framework badges and "10 systems" are real, derived facts, not claims).

## File Impact Summary

- `index.html`: new trust-bar section markup; suite section markup restructured into flagship-panel containers + compact explore-grid containers; heading/section class tweaks for polish across other sections.
- `style.css`: new trust-bar styles; new flagship-panel styles (alternating layout, glow); updated heading-scale clamp values across sections; new `--glow-blue`/`--glow-teal` tokens.
- `script.js`: new `renderFlagshipPanel()` (or similar) function; `initSuite()` updated to operate on the six-system subset; new content-integrity comment near `SYSTEMS`.

## Self-Review

- **Placeholder scan:** no TBD/vague items — trust-bar stat and its TODO marker are explicit; flagship panel selection (Inventory/Phone/Housing/Dispatch) is explicit and justified.
- **Consistency:** flagship panels reuse `SYSTEMS` data (no duplication), explore-grid reuses existing picker code path scoped to a subset — no divergent data sources.
- **Scope:** structural change is isolated to the Suite section + one new Trust-bar section; everything else is additive polish. Matches user's explicit choice (full-bleed panels for top systems only, not all ten).
