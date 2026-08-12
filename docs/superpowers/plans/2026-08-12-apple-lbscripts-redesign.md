# Apple/lbscripts-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give VAmore Systems' static site a bolder, more "impressive" identity inspired by apple.com (huge typography, generous whitespace, large alternating image/text panels) and lbscripts.com (trust-badge row, credibility-first hero framing) — without changing the brand palette, fonts, build approach, or the project's placeholder-content-integrity convention.

**Architecture:** Same three files as the existing rebuild (`index.html`, `style.css`, `script.js`), no build step, no dependencies. This plan is additive/restructuring on top of that rebuild, not a rewrite.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, `clamp()`, Grid/Flexbox), vanilla JS (`IntersectionObserver`, `classList`) — unchanged.

## Global Constraints

- Keep existing color tokens (`--color-accent-blue: #1450c8`, `--color-accent-teal: #0a6f68`, `--color-accent-teal-bright: #25c9b0`, `--color-dark-bg: #0c1520`) — no new brand colors.
- Keep existing fonts (`Instrument Sans`, `Martian Mono`) — no new font families.
- Every specific-sounding numeric/factual claim that isn't already `(placeholder)`-labeled gets an HTML `<!-- TODO: ... -->` (or JS `//`) comment directly above it, per the project's established content-integrity convention.
- No build tooling, no npm, no framework — files must work by opening `index.html` directly.
- Placeholder links keep `href="#"` with `data-placeholder="true"`.
- Reuse existing components/classes (`.pill`, `.btn`, `.suite-facts`, `.suite-fact`, `.suite-fw`) rather than duplicating their CSS.

---

### Task 1: Global glow tokens, hero upgrade, new Trust Bar section

**Files:**
- Modify: `style.css` (root tokens, `.hero-copy h1`, new `.hero-copy::before` glow, new `.trust*` rules)
- Modify: `index.html` (hero `<h1>` unchanged text, new `<section class="trust">` inserted between the hero `</section>` and the `<section id="demo"...>` opening tag)

**Interfaces:**
- Produces: `--glow-blue` and `--glow-teal` CSS custom properties on `:root`, reused by Task 2 (flagship panel glows) and Task 4 (pricing glow). Any later task applying a glow uses the same two-property pattern: a `position: relative` container plus a `::before` with `background: var(--glow-blue|teal); filter: blur(...); z-index: -1; pointer-events: none;`.
- Consumes: nothing new from earlier tasks.

- [ ] **Step 1: Add glow tokens to `:root` in `style.css`**

Add these two lines inside the existing `:root { ... }` block (after `--color-border-soft`, before `--radius-pill`):

```css
  --glow-blue: radial-gradient(60% 60% at 50% 50%, rgba(20, 80, 200, 0.28), transparent 70%);
  --glow-teal: radial-gradient(60% 60% at 50% 50%, rgba(37, 201, 176, 0.24), transparent 70%);
```

- [ ] **Step 2: Bump hero headline scale in `style.css`**

Change:
```css
.hero-copy h1 { margin: 0; font-size: clamp(42px, 6.6vw, 88px); line-height: 0.98; font-weight: 600; letter-spacing: -0.05em; text-wrap: balance; }
```
to:
```css
.hero-copy h1 { margin: 0; font-size: clamp(46px, 8vw, 116px); line-height: 0.96; font-weight: 600; letter-spacing: -0.05em; text-wrap: balance; }
```

- [ ] **Step 3: Add hero glow in `style.css`**

Change:
```css
.hero-copy { display: flex; flex-direction: column; gap: 26px; max-width: 620px; }
```
to:
```css
.hero-copy { position: relative; display: flex; flex-direction: column; gap: 26px; max-width: 620px; }
.hero-copy::before {
  content: ''; position: absolute; top: -90px; left: -110px; width: 380px; height: 380px;
  background: var(--glow-blue); filter: blur(50px); z-index: -1; pointer-events: none;
}
```

- [ ] **Step 4: Add Trust Bar markup to `index.html`**

Insert this new `<section>` immediately after the hero section's closing `</section>` (the one that closes `<section class="section hero">`) and before `<section id="demo" class="section section-dark demo">`:

```html
  <section class="trust">
    <div class="container trust-inner">
      <div class="trust-badges">
        <span class="pill">esx</span>
        <span class="pill">qbcore</span>
        <span class="pill">qbox</span>
        <span class="pill">standalone</span>
      </div>
      <div class="trust-stats">
        <div class="trust-stat">
          <span class="trust-stat-value">10</span>
          <span class="trust-stat-key">systems · 1 codebase</span>
        </div>
        <!-- TODO: placeholder trust stat — replace with a real number before launch -->
        <div class="trust-stat">
          <span class="trust-stat-value">—</span>
          <span class="trust-stat-key">servers running the suite (placeholder)</span>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 5: Add Trust Bar styles to `style.css`**

Append after the `.footer-legal a:hover { color: var(--color-text); }` rule (end of the nav/footer block, before `.hero { ... }`):

```css
.trust { padding: clamp(28px, 4vw, 44px) clamp(18px, 4vw, 40px); }
.trust-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 28px; flex-wrap: wrap;
  border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);
  padding: 26px 0;
}
.trust-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.trust-stats { display: flex; gap: 34px; flex-wrap: wrap; }
.trust-stat { display: flex; flex-direction: column; gap: 3px; }
.trust-stat-value { font-size: clamp(22px, 2.6vw, 30px); font-weight: 600; letter-spacing: -0.03em; color: var(--color-text); line-height: 1; }
.trust-stat-key { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-text-muted); }
```

- [ ] **Step 6: Verify**

Run: `grep -c "trust-stat-value" index.html` → expect `2`.
Run: `grep -c "glow-blue" style.css` → expect `2` (the token definition plus its one usage).
Open `index.html` directly in a browser and confirm: hero headline is visibly larger than before, a soft blue glow sits behind the hero copy, and a thin badge/stat bar appears between the hero and the dark demo section.

- [ ] **Step 7: Commit**

```bash
git add index.html style.css
git commit -m "feat: bump hero scale, add glow tokens, add trust bar section"
```

---

### Task 2: Suite section — flagship full-bleed panels (Inventory, Phone, Housing, Dispatch)

**Files:**
- Modify: `index.html` (suite section markup — add `<div class="flagship-list" id="flagship-list"></div>` and an "Explore the rest" sub-heading before the existing picker markup)
- Modify: `script.js` (add `FLAGSHIP_SLUGS`, add `renderFlagshipPanels()`, extend the top-of-file content-integrity comment, call the new function from `DOMContentLoaded`)
- Modify: `style.css` (new `.flagship-*` rules)

**Interfaces:**
- Produces: `FLAGSHIP_SLUGS` (array of 4 slugs: `'va-inventory'`, `'va-phone'`, `'va-housing'`, `'va-dispatch'`), consumed by Task 3's `initSuite()` to exclude these from the compact picker.
- Produces: `renderFlagshipPanels()` — no args, queries `#flagship-list`, reads from the existing `SYSTEMS` array (no new data source).
- Consumes: `SYSTEMS` array and `.suite-facts`/`.suite-fact`/`.suite-fw`/`.pill`/`.btn`/`.btn-primary` styles, all already defined.

- [ ] **Step 1: Extend the content-integrity comment at the top of `script.js`**

Change:
```js
// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
const SYSTEMS = [
```
to:
```js
// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
// NOTE: every "ui shot · WxH" label rendered from this data (flagship panels,
// suite panel) is a placeholder mockup dimension, not a real screenshot.
const SYSTEMS = [
```

- [ ] **Step 2: Add `FLAGSHIP_SLUGS` and `renderFlagshipPanels()` to `script.js`**

Insert this new block right after the `SYSTEMS` array's closing `];` and before `function renderHeroPills() {`:

```js
const FLAGSHIP_SLUGS = ['va-inventory', 'va-phone', 'va-housing', 'va-dispatch'];

function renderFlagshipPanels() {
  const wrap = document.getElementById('flagship-list');
  if (!wrap) return;
  wrap.innerHTML = FLAGSHIP_SLUGS.map((slug, i) => {
    const s = SYSTEMS.find((sys) => sys.slug === slug);
    const reversed = i % 2 === 1;
    const glow = i % 2 === 0 ? 'flagship-glow-blue' : 'flagship-glow-teal';
    return `
    <div class="flagship-panel${reversed ? ' flagship-panel-reverse' : ''} reveal">
      <div class="flagship-image"><span>${s.slug} · ui shot · 1600×900</span></div>
      <div class="flagship-copy ${glow}">
        <div class="flagship-copy-head"><h3>${s.name}</h3><span>${s.price}</span></div>
        <p>${s.body}</p>
        <div class="suite-facts">
          ${s.facts.map((f) => `<div class="suite-fact"><span class="suite-fact-key">${f.k}</span><span class="suite-fact-val">${f.v}</span></div>`).join('')}
        </div>
        <div class="suite-fw">
          ${s.fw.map((f) => `<span class="pill">${f}</span>`).join('')}
        </div>
        <a href="#" class="btn btn-primary" data-placeholder="true">Buy ${s.name} on Tebex</a>
      </div>
    </div>`;
  }).join('');
}
```

- [ ] **Step 3: Call `renderFlagshipPanels()` from `DOMContentLoaded`**

Change:
```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initDemoChapters();
  initSuite();
  renderPricingPills();
  initScrollReveal();
});
```
to:
```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  renderHeroPills();
  renderFlagshipPanels();
  initDemoChapters();
  initSuite();
  renderPricingPills();
  initScrollReveal();
});
```

(`renderHeroPills()` moves here explicitly — Task 3 removes the old call to it from inside `initSuite()`.)

- [ ] **Step 4: Add flagship panel markup container to `index.html`**

Change the suite section's inner markup from:
```html
  <section id="suite" class="section suite">
    <div class="container suite-inner">
      <div class="suite-head">
        <h2>What's in the suite.</h2>
        <span class="mono-label">pick a system to inspect it</span>
      </div>
      <div class="suite-grid">
        <div class="suite-list" id="suite-list"></div>
        <div class="suite-panel" id="suite-panel"></div>
      </div>
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

      <div class="suite-head suite-head-explore">
        <h2>Explore the rest of the suite.</h2>
        <span class="mono-label">pick a system to inspect it</span>
      </div>
      <div class="suite-grid">
        <div class="suite-list" id="suite-list"></div>
        <div class="suite-panel" id="suite-panel"></div>
      </div>
    </div>
  </section>
```

(Task 3 handles making the picker below show only the remaining six systems.)

- [ ] **Step 5: Add flagship panel styles to `style.css`**

Append after the `.suite-fw { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }` rule (end of the existing suite-panel block, before `.compare-inner`):

```css
.flagship-list { display: flex; flex-direction: column; gap: clamp(60px, 8vw, 110px); margin: clamp(20px, 3vw, 30px) 0 clamp(50px, 7vw, 90px); }
.flagship-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: clamp(32px, 5vw, 70px); align-items: center; }
.flagship-panel-reverse .flagship-image { order: 2; }
.flagship-panel-reverse .flagship-copy { order: 1; }

.flagship-image {
  height: clamp(320px, 38vw, 520px); border-radius: var(--radius-card); overflow: hidden;
  background: repeating-linear-gradient(135deg, rgba(18, 24, 32, 0.055) 0 13px, rgba(18, 24, 32, 0.015) 13px 26px);
  display: grid; place-items: center; border: 1px solid var(--color-border);
}
.flagship-image span { font-family: var(--font-mono); font-size: 11px; color: #5b636e; text-align: center; padding: 0 20px; }

.flagship-copy { position: relative; display: flex; flex-direction: column; gap: 18px; max-width: 460px; }
.flagship-copy::before {
  content: ''; position: absolute; top: -60px; left: -60px; width: 320px; height: 320px;
  filter: blur(50px); z-index: -1; pointer-events: none;
}
.flagship-glow-blue::before { background: var(--glow-blue); }
.flagship-glow-teal::before { background: var(--glow-teal); }

.flagship-copy-head { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
.flagship-copy-head h3 { margin: 0; font-size: clamp(30px, 4vw, 52px); font-weight: 600; letter-spacing: -0.045em; }
.flagship-copy-head span { font-family: var(--font-mono); font-size: 17px; color: var(--color-accent-teal); }
.flagship-copy > p { margin: 0; font-size: 17px; line-height: 1.6; color: var(--color-text-secondary); }

.suite-head-explore { margin-top: clamp(10px, 2vw, 20px); }
```

- [ ] **Step 6: Verify**

Run: `grep -c "flagship-panel" index.html style.css script.js` → each file should show matches (markup container in html, rules in css, class-string generation in js).
Open `index.html` in a browser: confirm four large alternating panels appear under "What's in the suite." — Inventory (image left), Phone (image right), Housing (image left), Dispatch (image right) — each with heading, price, facts, framework pills, and a "Buy X on Tebex" button.

- [ ] **Step 7: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: rebuild suite section with 4 flagship full-bleed panels"
```

---

### Task 3: Suite section — scope "Explore the rest" picker to the remaining 6 systems

**Files:**
- Modify: `script.js` (`renderSuitePanel`, `initSuite`)

**Interfaces:**
- Consumes: `FLAGSHIP_SLUGS` and `SYSTEMS` from Task 2.
- Changes signature: `renderSuitePanel(index)` → `renderSuitePanel(list, index)`. No other file calls `renderSuitePanel`, so this is a safe in-place signature change.

- [ ] **Step 1: Update `renderSuitePanel` to take a `list` parameter**

Change:
```js
function renderSuitePanel(index) {
  const panel = document.getElementById('suite-panel');
  if (!panel) return;
  const s = SYSTEMS[index];
  panel.innerHTML = `
```
to:
```js
function renderSuitePanel(list, index) {
  const panel = document.getElementById('suite-panel');
  if (!panel) return;
  const s = list[index];
  panel.innerHTML = `
```

(The rest of the function body — the template string using `s.slug`, `s.name`, etc. — stays unchanged.)

- [ ] **Step 2: Update `initSuite()` to build and use the six-system subset**

Change:
```js
function initSuite() {
  const list = document.getElementById('suite-list');
  if (!list) return;
  let active = 0;

  function renderList() {
    list.innerHTML = SYSTEMS.map((s, i) => `
      <button class="suite-row${i === active ? ' is-active' : ''}" data-index="${i}">
        <span class="suite-row-slug">${s.slug}</span>
        <span class="suite-row-name">${s.name}</span>
        <span class="suite-row-price">${s.price}</span>
      </button>`).join('');
  }

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('.suite-row');
    if (!btn) return;
    active = Number(btn.dataset.index);
    renderList();
    renderSuitePanel(active);
  });

  renderList();
  renderSuitePanel(active);
  renderHeroPills();
}
```
to:
```js
function initSuite() {
  const list = document.getElementById('suite-list');
  if (!list) return;
  const rest = SYSTEMS.filter((s) => !FLAGSHIP_SLUGS.includes(s.slug));
  let active = 0;

  function renderList() {
    list.innerHTML = rest.map((s, i) => `
      <button class="suite-row${i === active ? ' is-active' : ''}" data-index="${i}">
        <span class="suite-row-slug">${s.slug}</span>
        <span class="suite-row-name">${s.name}</span>
        <span class="suite-row-price">${s.price}</span>
      </button>`).join('');
  }

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('.suite-row');
    if (!btn) return;
    active = Number(btn.dataset.index);
    renderList();
    renderSuitePanel(rest, active);
  });

  renderList();
  renderSuitePanel(rest, active);
}
```

(`renderHeroPills()` no longer called here — Task 2 Step 3 already added it to `DOMContentLoaded` directly.)

- [ ] **Step 3: Verify**

Run: `grep -n "renderSuitePanel" script.js` → expect exactly 3 matches: the function definition and its two call sites inside `initSuite()`, all passing `rest` (or `list`, in the parameter) as the first argument.
Open `index.html` in a browser: the "Explore the rest of the suite" picker lists exactly 6 rows (Banking, Jobs, Garage, Admin, Crafting, Fuel) — none of the 4 flagship systems appear in this list. Clicking a row still updates the detail panel correctly.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "fix: scope explore-the-rest picker to the 6 non-flagship systems"
```

---

### Task 4: Typography/spacing polish across Demo, Suite headings, Compare, Support, Pricing + pricing glow

**Files:**
- Modify: `style.css` (`.section` base padding, five section heading rules, new pricing glow)

**Interfaces:**
- Consumes: `--glow-teal` token from Task 1.
- No new interfaces produced — this is a pure styling pass, no markup or JS changes.

- [ ] **Step 1: Increase base section padding**

Change:
```css
.section { padding: clamp(80px, 11vw, 150px) clamp(18px, 4vw, 40px); scroll-margin-top: var(--nav-height); }
```
to:
```css
.section { padding: clamp(90px, 12vw, 170px) clamp(18px, 4vw, 40px); scroll-margin-top: var(--nav-height); }
```

- [ ] **Step 2: Bump section heading scales**

Change each of these five rules (leave everything else in each rule unchanged):

```css
.demo-head h2 { margin: 0; font-size: clamp(30px, 4.6vw, 58px); ... }
```
→ `font-size: clamp(34px, 5.2vw, 72px);`

```css
.suite-head h2 { margin: 0; font-size: clamp(32px, 5vw, 64px); ... }
```
→ `font-size: clamp(34px, 5.4vw, 76px);`

```css
.compare-head h2 { margin: 0; font-size: clamp(32px, 5vw, 62px); ... }
```
→ `font-size: clamp(34px, 5.4vw, 76px);`

```css
.support-head h2 { margin: 0; font-size: clamp(32px, 5vw, 62px); ... }
```
→ `font-size: clamp(34px, 5.4vw, 76px);`

```css
.pricing-copy h2 { margin: 0; font-size: clamp(32px, 5vw, 60px); ... }
```
→ `font-size: clamp(34px, 5.4vw, 74px);`

(Only the `font-size` value changes in each rule; `margin`, `line-height`, `font-weight`, `letter-spacing`, `max-width` stay exactly as they are today.)

- [ ] **Step 3: Add pricing glow**

Change:
```css
.pricing-copy { display: flex; flex-direction: column; gap: 20px; }
```
to:
```css
.pricing-copy { position: relative; display: flex; flex-direction: column; gap: 20px; }
.pricing-copy::before {
  content: ''; position: absolute; top: -70px; left: -80px; width: 340px; height: 340px;
  background: var(--glow-teal); filter: blur(50px); z-index: -1; pointer-events: none;
}
```

- [ ] **Step 4: Verify**

Run: `grep -c "clamp(34px" style.css` → expect `5` (the five bumped headings).
Open `index.html` in a browser: scroll through Demo, Suite, Compare, Support, Pricing — headings read noticeably larger and sections have more vertical breathing room than before; a soft teal glow sits behind the pricing copy without reducing text legibility.

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "style: bump section heading scale, section padding, add pricing glow"
```

---

## Final Verification (whole-branch)

After all 4 tasks: open `index.html` in a browser and check top to bottom — nav, hero (bigger headline + glow), trust bar (badges + 2 stats, one placeholder-marked), demo, suite (4 flagship panels alternating, then 6-item explore picker), compare, support, pricing (with glow), footer. Confirm no console errors, confirm every new claim is either real (derived from `SYSTEMS`) or `<!-- TODO -->`/`(placeholder)`-marked, confirm no leftover reference to the old single 10-system picker.
