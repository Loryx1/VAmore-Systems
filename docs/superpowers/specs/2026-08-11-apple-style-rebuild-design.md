# VAmore Systems landing page rebuild — Apple-style, plain HTML/CSS/JS

## Problem

`index.html` currently uses a custom, non-standard templating system (`<x-dc>`, `<sc-for>`,
`{{ }}` bindings, `data-dc-script`, a `DCLogic` base class) and loads `./support.js`, a file
that does not exist anywhere in the repo. No browser understands these tags without that
runtime. The site is served via GitHub Pages on the custom domain `vamore.info` (see `CNAME`),
so as committed, the live site renders blank/broken.

The content and visual direction (typography, color, spacing, motion) are already close to
what's wanted — clean, Apple-like, generous whitespace, rounded pills, subtle motion — so the
rebuild keeps that direction but re-implements it as plain, dependency-free HTML/CSS/JS that
runs directly on GitHub Pages.

## Goals

- Site renders correctly as static files with no external runtime/build step.
- Visual language stays Apple-like: clean typography, large whitespace, rounded pill UI,
  restrained motion, respects `prefers-reduced-motion`.
- Existing brand colors kept (blue `#1450c8` → teal `#25c9b0` gradient accents).
- Existing section structure and copy carried over, since it already fits the site's purpose
  (showcasing FiveM scripts with a path to the Tebex store).
- Content that isn't real yet (script lineup, support stats, Tebex/Discord links) is clearly
  marked as placeholder so it's easy to find and replace later — not silently shipped as fact.

## Non-goals

- No real script lineup, pricing, or support metrics yet (business decided separately).
- No JS framework, bundler, or build pipeline — this is a static marketing page.
- No CMS/backend — content lives in the JS/HTML source.

## File structure

```
index.html   structure/content only
style.css    all styling (design tokens as CSS custom properties)
script.js    small vanilla-JS behaviors (no framework)
assets/      existing logo/icon PNGs (already in repo, reused where useful)
```

No build step. Deployable as-is via GitHub Pages.

## Design tokens (style.css :root)

- Fonts: `Instrument Sans` (body/headlines), `Martian Mono` (tags/meta) — same Google Fonts
  link as today.
- Background: light radial/linear gradient `#ffffff` → `#f4f6fa` → `#e9edf3`; dark sections use
  `#0c1520`.
- Text: primary `#121820`, secondary `#454d58` / `#474f5a`.
- Accent: blue `#1450c8`, teal `#0a6f68` / `#25c9b0` (gradient pair reused from the current
  logomark gradient).
- Radius: pill buttons/tags use `999px`; cards use `~24–26px`.
- Motion: fade/slide-in on scroll via `IntersectionObserver` (replaces the current
  `animation-timeline: view()` usage, which isn't reliable cross-browser); everything gated
  behind `prefers-reduced-motion`.

## Sections (content carried over from current index.html, rebuilt as static markup)

1. **Sticky nav** — logo (inline SVG gradient mark, kept as-is), anchor links (`#suite`,
   `#demo`, `#compare`, `#support`), Discord link (`href="#"`, placeholder), CTA button. Nav
   background/blur toggles on scroll via a small JS scroll listener (replaces the `scrolled`
   state from the old component).
2. **Hero** — framework pills (esx/qbcore/qbox/"one config line"), headline, subcopy, two CTAs
   (`#pricing`, `#suite`), and the `server.cfg`-style card listing 10 placeholder script slugs
   as pills.
3. **Demo** — headline/subcopy, placeholder video block (no real video yet), chapter buttons
   that toggle an "active chapter" label via JS (no framework state, plain `classList` toggle).
4. **Suite** — left: list of 10 placeholder scripts (slug/name/price rows); right: sticky detail
   panel showing the selected script's description, facts, supported frameworks, and a
   "Buy on Tebex" button (`href="#"`, placeholder). Selection handled with a small JS click
   handler swapping an `active` index and re-rendering the detail panel from a JS data array.
5. **Compare** — static "suite vs. mixed vendors" comparison table, content unchanged.
6. **Support stats** — kept, but every number is wrapped with an HTML comment
   `<!-- TODO: replace with real support metrics before launch -->` right above the block, so
   it's unmissable in source and can't be mistaken for verified data.
7. **Pricing** — price card, feature pill list, "Get it on Tebex" CTA (`href="#"`, placeholder).
8. **Footer** — logo, Discord/YouTube links (`href="#"`, placeholder), footer link columns,
   legal line, Impressum/Privacy/Terms (`href="#"`, placeholder).

All `href="#"` placeholders use a shared convention (`data-placeholder="true"` attribute or a
`<!-- TODO -->` comment right above) so a future find-and-replace pass is easy.

## JS behavior (script.js)

Small, framework-free, single responsibility functions:
- `initNavScroll()` — toggles a `.scrolled` class on the header past a scroll threshold.
- `initSuitePicker()` — click handler on the script list; updates the active row's styling and
  re-renders the detail panel from a `SYSTEMS` data array (same shape as today's `SYSTEMS`
  const, minus the DC-specific render glue).
- `initDemoChapters()` — click handler toggling the active chapter button + label text.
- `initScrollReveal()` — `IntersectionObserver`-based fade/slide-in for section entrances,
  no-ops under `prefers-reduced-motion`.

No external JS dependencies.

## Testing / verification

- Open `index.html` directly in a browser (file://) and via a local static server; confirm nav
  scroll state, suite picker, and demo chapter buttons work with no console errors.
- Check responsive behavior at mobile/tablet/desktop widths (the current `clamp()`-based sizing
  approach is kept).
- Verify `prefers-reduced-motion` disables animations.
- Confirm no references remain to `x-dc`, `sc-for`, `{{ }}`, or `support.js`.

## Open items intentionally deferred

- Real script lineup/pricing, real support metrics, real Tebex/Discord URLs — all marked as
  placeholders per decisions above, to be swapped in later by the user.
