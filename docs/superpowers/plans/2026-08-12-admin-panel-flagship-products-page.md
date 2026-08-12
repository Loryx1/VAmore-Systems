# Admin Panel USP + Flagship Panels + Products Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prominent Admin Panel USP section after the Hero, restructure the Suite section into 4 large alternating "flagship" panels (frameless placeholder images), and move the full 10-system catalog to a new `products.html` page reachable via "View all scripts" / "All Scripts" links.

**Architecture:** Builds on the current lbscripts-anatomy page (`index.html`/`style.css`/`script.js` as of commit `ae299c0`). Task order follows the dependency chain: `script.js` first (defines the `#flagship-list` contract and the shared `SYSTEMS`/`renderProductGrid` reuse), then `index.html` (provides that contract, restructures Suite, adds Admin Panel), then the new `products.html` (reuses `renderProductGrid`/`#product-grid` unchanged), then `style.css` last (styles everything the other three define).

**Tech Stack:** Plain HTML5, CSS3, vanilla JS — unchanged, no build step.

## Global Constraints

- Keep existing color tokens, fonts, and the full-dark visual system unchanged.
- Every specific-sounding numeric/factual claim not already `(placeholder)`-labeled gets an explicit `<!-- TODO -->` / `//` comment — the Admin Panel section in particular, since it markets an in-development feature.
- `href="#"` placeholder links keep `data-placeholder="true"`. `products.html` links are real, resolvable links — do NOT mark them `data-placeholder`.
- No build tooling. `products.html` is a second plain static file, same head/nav/footer pattern as `index.html`.
- `script.js` is shared by both pages — every render/init function must keep its `if (!el) return;` guard so it no-ops safely on whichever page lacks its target element.

---

### Task 1: `script.js` — add flagship panel rendering

**Files:**
- Modify: `script.js`

**Interfaces:**
- Produces: `FLAGSHIP_SLUGS` (array of 4 slugs), `renderFlagshipPanels()` (queries `#flagship-list`, no-ops if absent — same guard pattern as every other render function in this file).
- Consumes: existing `SYSTEMS` array, unchanged.

- [ ] **Step 1: Insert `FLAGSHIP_SLUGS` and `renderFlagshipPanels()` right after the `SYSTEMS` array's closing `];` and before `function renderProductGrid() {`**

```js
const FLAGSHIP_SLUGS = ['va-inventory', 'va-phone', 'va-housing', 'va-dispatch'];

function renderFlagshipPanels() {
  const wrap = document.getElementById('flagship-list');
  if (!wrap) return;
  wrap.innerHTML = FLAGSHIP_SLUGS.map((slug, i) => {
    const s = SYSTEMS.find((sys) => sys.slug === slug);
    if (!s) return '';
    const reversed = i % 2 === 1;
    return `
    <div class="flagship-panel${reversed ? ' flagship-panel-reverse' : ''} reveal">
      <div class="flagship-image"><span>${s.slug} · product shot placeholder</span></div>
      <div class="flagship-copy">
        <h3>${s.name}</h3>
        <p>${s.body}</p>
        <div class="flagship-meta">
          <span class="flagship-price">${s.price}</span>
          <a href="#" class="btn btn-secondary" data-placeholder="true">Buy on Tebex</a>
        </div>
      </div>
    </div>`;
  }).join('');
}
```

- [ ] **Step 2: Wire `renderFlagshipPanels()` into `DOMContentLoaded`**

Change:
```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  renderProductGrid();
  initDemoChapters();
  initScrollReveal();
});
```
to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  renderProductGrid();
  renderFlagshipPanels();
  initDemoChapters();
  initScrollReveal();
});
```

- [ ] **Step 3: Verify**

Run: `node -c script.js` → must pass.
Run: `grep -c "FLAGSHIP_SLUGS\|renderFlagshipPanels" script.js` → expect `3` (the array declaration, the function declaration, the `DOMContentLoaded` call).

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add renderFlagshipPanels() for the 4 flagship suite systems"
```

---

### Task 2: `index.html` — Admin Panel section, Suite restructure, nav link

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `renderFlagshipPanels()`'s `#flagship-list` contract from Task 1.
- Produces: class names Task 4's CSS must style — `.admin-panel`, `.admin-panel-inner`, `.admin-panel-copy`, `.admin-panel-facts`, `.admin-panel-image`, `.flagship-list`, `.flagship-panel`, `.flagship-panel-reverse`, `.flagship-image`, `.flagship-copy`, `.flagship-meta`, `.flagship-price`, `.suite-view-all`.

- [ ] **Step 1: Add the "All Scripts" nav link**

Change:
```html
    <nav class="nav-links">
      <a href="#suite">Suite</a>
      <a href="#demo">Demo</a>
      <a href="#compare">Compare</a>
    </nav>
```
to:
```html
    <nav class="nav-links">
      <a href="#suite">Suite</a>
      <a href="#demo">Demo</a>
      <a href="#compare">Compare</a>
      <a href="products.html">All Scripts</a>
    </nav>
```

- [ ] **Step 2: Insert the Admin Panel section between the Hero section's closing `</section>` and the Feature Row's opening `<section class="section features">`**

```html
  <!-- TODO: this Admin Panel section markets a feature that doesn't exist yet — confirm real ship status/timeline before launch. The mockup below is a placeholder shape, not a real screenshot. -->
  <section class="section admin-panel">
    <div class="container admin-panel-inner">
      <div class="admin-panel-copy">
        <span class="mono-label">no config.lua required</span>
        <h2>Every setting, one panel.</h2>
        <p>Every script in the suite gets its own tab in a shared Admin Panel. Change settings
          with buttons and input fields instead of editing Lua files by hand — no coding
          knowledge needed.</p>
        <div class="admin-panel-facts">
          <span class="pill">one panel, every script</span>
          <span class="pill">buttons and forms, not code</span>
          <span class="pill">no restart required (placeholder)</span>
        </div>
      </div>
      <div class="admin-panel-image"><span>admin panel · UI mockup placeholder</span></div>
    </div>
  </section>
```

- [ ] **Step 3: Restructure the Suite section**

Change:
```html
  <section id="suite" class="section suite">
    <div class="container suite-inner">
      <div class="suite-head">
        <h2>What's in the suite.</h2>
        <span class="mono-label">ten systems, one vendor</span>
      </div>
      <div class="product-grid" id="product-grid"></div>
    </div>
  </section>
```
to:
```html
  <section id="suite" class="section suite">
    <div class="container suite-inner">
      <div class="suite-head">
        <h2>What's in the suite.</h2>
        <span class="mono-label">four of the ten, up close</span>
      </div>
      <div class="flagship-list" id="flagship-list"></div>
      <a href="products.html" class="btn btn-secondary suite-view-all">View all scripts</a>
    </div>
  </section>
```

- [ ] **Step 4: Point the footer's "All ten systems" link at the new catalog page**

Change:
```html
      <a href="#suite">All ten systems</a>
```
(inside the footer's `suite` column) to:
```html
      <a href="products.html">All ten systems</a>
```

- [ ] **Step 5: Verify**

Run: `grep -c "id=\"flagship-list\"\|admin-panel-inner\|products.html" index.html` → expect at least `4` (flagship-list container, admin-panel-inner wrapper, plus the 3 `products.html` links: nav, suite-view-all, footer).
Run: `grep -c "id=\"product-grid\"" index.html` → expect `0` (the static product grid moved out of index.html entirely — Task 3 puts it on products.html).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add Admin Panel USP section, restructure suite into flagship panels"
```

---

### Task 3: `products.html` — new catalog page

**Files:**
- Create: `products.html`

**Interfaces:**
- Consumes: `renderProductGrid()` and `#product-grid` from the existing `script.js` (unchanged, already reads all of `SYSTEMS`) — this task provides the `#product-grid` container that used to live on `index.html`.
- Produces: `.products-head` class, consumed by Task 4's CSS.

- [ ] **Step 1: Create `products.html` with this exact content:**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VAmore Systems — All scripts</title>
<link rel="icon" href="assets/vamore-favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Martian+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="nav" id="nav">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo">
      <svg width="26" height="26" viewBox="0 0 128 128" fill="none" aria-hidden="true">
        <defs><linearGradient id="vamMark" gradientUnits="userSpaceOnUse" x1="14" y1="104" x2="110" y2="20"><stop offset="0%" stop-color="#1450c8"></stop><stop offset="55%" stop-color="#1b8fc4"></stop><stop offset="100%" stop-color="#25c9b0"></stop></linearGradient></defs>
        <path d="M14 24 L27 54" stroke="url(#vamMark)" stroke-width="15"></path>
        <path d="M30.5 62 L46 98 L78 24 L110 98" stroke="url(#vamMark)" stroke-width="15" stroke-linejoin="miter"></path>
        <path d="M50 74 H107" stroke="url(#vamMark)" stroke-width="15"></path>
      </svg>
      <span>VAmore Systems</span>
    </a>
    <nav class="nav-links">
      <a href="index.html#suite">Suite</a>
      <a href="index.html#demo">Demo</a>
      <a href="index.html#compare">Compare</a>
      <a href="products.html">All Scripts</a>
    </nav>
    <div class="nav-actions">
      <a href="#" class="pill" data-placeholder="true">discord</a>
      <a href="#" class="btn btn-primary" data-placeholder="true">Buy on Tebex</a>
    </div>
  </div>
</header>

<main id="top">
  <section class="section products-head">
    <div class="container">
      <h1>The full suite.</h1>
      <p>All ten systems, one vendor, one codebase. Pick one to start, or take the whole layer.</p>
    </div>
  </section>

  <section class="section products-list">
    <div class="container">
      <div class="product-grid" id="product-grid"></div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <div class="nav-logo">
        <svg width="24" height="24" viewBox="0 0 128 128" fill="none" aria-hidden="true">
          <defs><linearGradient id="vamMarkF" gradientUnits="userSpaceOnUse" x1="14" y1="104" x2="110" y2="20"><stop offset="0%" stop-color="#1450c8"></stop><stop offset="100%" stop-color="#25c9b0"></stop></linearGradient></defs>
          <path d="M14 24 L27 54" stroke="url(#vamMarkF)" stroke-width="15"></path>
          <path d="M30.5 62 L46 98 L78 24 L110 98" stroke="url(#vamMarkF)" stroke-width="15" stroke-linejoin="miter"></path>
          <path d="M50 74 H107" stroke="url(#vamMarkF)" stroke-width="15"></path>
        </svg>
        <span>VAmore Systems</span>
      </div>
      <!-- TODO: placeholder claim — "maintained by the people who run a server on it" implies an existing operating server; confirm or rewrite before launch. -->
      <p>The whole server layer from one place, maintained by the people who run a server on it.</p>
      <div class="footer-socials">
        <a href="#" class="pill" data-placeholder="true">discord</a>
        <a href="#" class="pill" data-placeholder="true">youtube</a>
      </div>
    </div>
    <div class="footer-col">
      <span class="footer-col-title">suite</span>
      <a href="index.html#suite">Inventory</a>
      <a href="index.html#suite">Phone</a>
      <a href="index.html#suite">Housing</a>
      <a href="products.html">All ten systems</a>
    </div>
    <div class="footer-col">
      <span class="footer-col-title">resources</span>
      <a href="#" data-placeholder="true">Documentation</a>
      <a href="#" data-placeholder="true">Changelog</a>
      <a href="#" data-placeholder="true">Framework bridges</a>
      <a href="#" data-placeholder="true">Status</a>
    </div>
    <div class="footer-col">
      <span class="footer-col-title">company</span>
      <a href="#" data-placeholder="true">Support</a>
      <a href="#" data-placeholder="true">Tebex store</a>
      <a href="#" data-placeholder="true">Discord</a>
      <a href="#" data-placeholder="true">Report misuse</a>
    </div>
  </div>
  <div class="container footer-legal">
    <span>© 2026 vamore systems</span>
    <span>not affiliated with rockstar games or cfx.re</span>
    <a href="#" data-placeholder="true">impressum</a>
    <a href="#" data-placeholder="true">privacy</a>
    <a href="#" data-placeholder="true">terms</a>
  </div>
</footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run: `grep -c "id=\"product-grid\"" products.html` → expect `1`.
Run: `grep -c "index.html#suite\|index.html#demo\|index.html#compare" products.html` → expect `4` (3 in nav+footer suite column, minus — count exactly: nav has 3 index.html# links, footer suite column has 3 more `index.html#suite`, so expect `6`; run the grep yourself and sanity-check the count matches what's in the file rather than trusting this number blindly).
Open `products.html` directly in a browser: confirm nav, heading, a populated grid of all 10 product cards, footer — same visual language as `index.html`, no console errors.

- [ ] **Step 3: Commit**

```bash
git add products.html
git commit -m "feat: add products.html catalog page listing all 10 systems"
```

---

### Task 4: `style.css` — Admin Panel, flagship panel, products-head styles

**Files:**
- Modify: `style.css`

**Interfaces:**
- Consumes: class names from Tasks 2 and 3.
- Produces: nothing further — last task in the plan.

- [ ] **Step 1: Add Admin Panel and flagship panel styles**

Append after the `.mono-label { ... }` rule and before `.product-grid { ... }` (keeps the new suite-adjacent styles grouped near the existing suite rules):

```css
.admin-panel-inner { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(28px, 4vw, 56px); align-items: center; }
.admin-panel-copy { display: flex; flex-direction: column; gap: 14px; }
.admin-panel-copy h2 { margin: 0; font-size: clamp(30px, 4.4vw, 58px); line-height: 1.02; font-weight: 600; letter-spacing: -0.045em; }
.admin-panel-copy p { margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--color-text-secondary); max-width: 46ch; }
.admin-panel-facts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.admin-panel-image {
  height: clamp(220px, 30vw, 380px); display: grid; place-items: center;
  background: repeating-linear-gradient(135deg, rgba(245, 247, 250, 0.05) 0 13px, rgba(245, 247, 250, 0.015) 13px 26px);
}
.admin-panel-image span { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-align: center; padding: 0 20px; }

.flagship-list { display: flex; flex-direction: column; gap: clamp(40px, 6vw, 72px); margin: clamp(16px, 2vw, 24px) 0 clamp(28px, 4vw, 44px); }
.flagship-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(28px, 4vw, 56px); align-items: center; }
.flagship-panel-reverse .flagship-image { order: 2; }
.flagship-panel-reverse .flagship-copy { order: 1; }
@media (max-width: 760px) {
  .flagship-panel-reverse .flagship-image,
  .flagship-panel-reverse .flagship-copy { order: 0; }
}

.flagship-image {
  height: clamp(240px, 32vw, 420px); display: grid; place-items: center;
  background: repeating-linear-gradient(135deg, rgba(245, 247, 250, 0.05) 0 13px, rgba(245, 247, 250, 0.015) 13px 26px);
}
.flagship-image span { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); text-align: center; padding: 0 20px; }

.flagship-copy { display: flex; flex-direction: column; gap: 12px; }
.flagship-copy h3 { margin: 0; font-size: clamp(24px, 3vw, 38px); font-weight: 600; letter-spacing: -0.04em; }
.flagship-copy p { margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--color-text-secondary); max-width: 42ch; }
.flagship-meta { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
.flagship-price { font-family: var(--font-mono); font-size: 14px; color: var(--color-accent-teal-bright); }

.suite-view-all { align-self: flex-start; }
```

- [ ] **Step 2: Add `products.html`-specific heading styles**

Append after the rule block from Step 1 (before `.demo { ... }`):

```css
.products-head { padding-top: clamp(120px, 16vh, 170px); }
.products-head h1 { margin: 0 0 12px; font-size: clamp(36px, 5.5vw, 68px); line-height: 1; font-weight: 600; letter-spacing: -0.05em; }
.products-head p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--color-text-secondary); max-width: 52ch; }
```

- [ ] **Step 3: Verify**

Run: `grep -c "admin-panel-inner\|flagship-panel\|products-head" style.css` → expect at least `5`.
Open both `index.html` and `products.html` in a browser: confirm the Admin Panel section renders (copy left, placeholder mockup right), the 4 flagship panels alternate image/copy sides with visible placeholder shapes (no border/card look — frameless), the "View all scripts" button is normal-width (not stretched full-width), and `products.html`'s heading + product grid render correctly styled.

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "style: add admin panel, flagship panel, and products-head rules"
```

---

## Final Verification (whole-branch)

After all 4 tasks: open `index.html` — confirm Admin Panel section appears directly after Hero with its TODO-marked placeholder framing, Suite section shows exactly 4 flagship panels alternating sides with frameless placeholder images, "View all scripts" links to `products.html`. Open `products.html` — confirm nav/footer match `index.html`'s visual language, all 10 systems appear in the grid, all `index.html#...` links correctly navigate back and scroll to the right section. Confirm no leftover `#product-grid` on `index.html`, no console errors on either page, every new claim (Admin Panel section) is TODO-marked.
