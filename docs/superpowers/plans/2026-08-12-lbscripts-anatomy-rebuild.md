# lbscripts-Anatomy Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully rebuild the VAmore Systems static site's three files to match lbscripts.com's page anatomy (nav → centered hero → 3-column feature row → static product grid → demo → compare → footer), in a full-dark color system, compact spacing. This replaces the previous Apple-style pass entirely — not a patch.

**Architecture:** Each task in this plan rewrites one whole file (`script.js`, `index.html`, `style.css`, in that dependency order — JS defines the DOM contract, HTML provides it, CSS styles it). Each task's step gives the complete final file content to write — this is a full-file replacement, not a diff, because the majority of each file's content changes. No build step, no dependencies, unchanged from before.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, `clamp()`, Grid/Flexbox), vanilla JS (`IntersectionObserver`, `classList`) — unchanged.

## Global Constraints

- Keep existing color tokens' hex values for the three brand accents (`--color-accent-blue: #1450c8`, `--color-accent-teal: #0a6f68`, `--color-accent-teal-bright: #25c9b0`) — no new brand colors.
- Keep existing fonts (`Instrument Sans`, `Martian Mono`) — no new font families.
- Every specific-sounding numeric/factual claim that isn't already `(placeholder)`-labeled gets an HTML `<!-- TODO: ... -->` (or JS `//`) comment directly above it.
- No build tooling, no npm, no framework — files must work by opening `index.html` directly.
- Placeholder links keep `href="#"` with `data-placeholder="true"`.
- No interactive picker/expand-collapse JS for the suite — the product grid is static cards rendered once.
- No Pricing section, no Support-stats section, no flagship panels, no trust bar, no glow effects — all removed per the approved spec.

---

### Task 1: Rewrite `script.js`

**Files:**
- Modify (full rewrite): `script.js`

**Interfaces:**
- Produces: `SYSTEMS` array (unchanged shape/content from the current file — 10 entries), `renderProductGrid()` (queries `#product-grid`, renders one card per `SYSTEMS` entry), `initDemoChapters()` (unchanged behavior, queries `#demo-chapters`/`#demo-video-label`), `initNavScroll()` (unchanged, queries `#nav`), `initScrollReveal()` (unchanged).
- Consumes: nothing from other tasks — this is the first task, and it defines the element IDs (`#product-grid`, `#nav`, `#demo-chapters`, `#demo-video-label`) that Task 2's HTML must provide.
- Removed from the current file entirely: `FLAGSHIP_SLUGS`, `FLAGSHIP_SYSTEMS`, `renderFlagshipPanels()`, `renderHeroPills()`, `initSuite()`, `renderSuitePanel()`, `systemDetailMarkup()`, `renderPricingPills()`. None of these are referenced anywhere in the new page.

- [ ] **Step 1: Replace the entire contents of `script.js` with:**

```js
// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
const SYSTEMS = [
  { slug: 'va-inventory', name: 'Inventory', price: '€35', fw: ['ESX', 'QBCore', 'Qbox'],
    body: 'Grid-slot inventory with real weight, stashes, shops and trunks. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-phone', name: 'Phone', price: '€45', fw: ['ESX', 'QBCore', 'Qbox'],
    body: 'Multi-app phone sharing accounts and inventory with the rest of the suite. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-housing', name: 'Housing', price: '€40', fw: ['QBCore', 'Qbox'],
    body: 'Buy, rent, furnish, hand over keys, persistent interiors. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-banking', name: 'Banking', price: '€30', fw: ['ESX', 'QBCore'],
    body: 'Accounts, transfers, business ledgers and ATMs. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-dispatch', name: 'Dispatch', price: '€32', fw: ['ESX', 'QBCore'],
    body: 'MDT, unit status and a live map for police and EMS. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-jobs', name: 'Jobs', price: '€28', fw: ['ESX', 'QBCore'],
    body: 'Shifts, payroll and per-grade permissions shared across the suite. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-garage', name: 'Garage', price: '€25', fw: ['ESX', 'QBCore'],
    body: 'Persistent vehicle storage with insurance and impound. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-admin', name: 'Admin', price: '€22', fw: ['ESX', 'QBCore', 'Standalone'],
    body: 'One menu across the whole suite: inventory, properties, accounts, tickets. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-crafting', name: 'Crafting', price: '€18', fw: ['ESX', 'QBCore', 'Standalone'],
    body: 'Blueprint crafting with skill levels, benches and durability. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] },
  { slug: 'va-fuel', name: 'Fuel', price: '€12', fw: ['Standalone'],
    body: 'Stations, jerrycans, electric charging and per-vehicle consumption. (placeholder)',
    facts: [{ k: 'placeholder', v: 'replace with real perf/feature facts before launch' }] }
];

function renderProductGrid() {
  const wrap = document.getElementById('product-grid');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map((s) => `
    <div class="product-card reveal">
      <div class="product-card-head">
        <span class="product-card-slug">${s.slug}</span>
        <span class="product-card-price">${s.price}</span>
      </div>
      <h3>${s.name}</h3>
      <p>${s.body}</p>
      <div class="product-card-fw">
        ${s.fw.map((f) => `<span class="pill">${f}</span>`).join('')}
      </div>
      <a href="#" class="btn btn-primary" data-placeholder="true">Buy on Tebex</a>
    </div>`).join('');
}

function initDemoChapters() {
  const wrap = document.getElementById('demo-chapters');
  const label = document.getElementById('demo-video-label');
  if (!wrap || !label) return;
  wrap.addEventListener('click', (event) => {
    const btn = event.target.closest('.chapter-btn');
    if (!btn) return;
    wrap.querySelectorAll('.chapter-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    label.textContent = `demo video · 2400×1240 · ${btn.dataset.chapter}`;
  });
}

function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  renderProductGrid();
  initDemoChapters();
  initScrollReveal();
});
```

- [ ] **Step 2: Verify**

Run: `node -c script.js` → must pass (valid syntax).
Run: `grep -c "function " script.js` → expect `5` (`renderProductGrid`, `initDemoChapters`, `initNavScroll`, `initScrollReveal`, plus none other — confirms the removed functions are actually gone).
Run: `grep -c "FLAGSHIP\|renderSuitePanel\|initSuite\|renderPricingPills\|renderHeroPills" script.js` → expect `0`.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: rewrite script.js for lbscripts-anatomy rebuild (static product grid, drop flagship/picker/pricing JS)"
```

---

### Task 2: Rewrite `index.html`

**Files:**
- Modify (full rewrite): `index.html`

**Interfaces:**
- Consumes: the element IDs Task 1's `script.js` queries — `#nav`, `#product-grid`, `#demo-chapters`, `#demo-video-label`. This task's markup must provide exactly those IDs.
- Produces: the full class-name vocabulary Task 3's `style.css` must style — `.nav`, `.nav-inner`, `.nav-logo`, `.nav-links`, `.nav-actions`, `.hero`, `.hero-inner`, `.hero-badges`, `.hero-cta`, `.features`, `.feature`, `.feature-icon`, `.suite`, `.suite-head`, `.product-grid`, `.product-card`, `.product-card-head`, `.product-card-slug`, `.product-card-price`, `.product-card-fw`, `.demo`, `.demo-inner`, `.demo-head`, `.demo-video`, `.demo-chapters`, `.chapter-btn`, `.compare`, `.compare-inner`, `.compare-head`, `.compare-table`, `.compare-row`, `.footer`, `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-legal`, plus the shared utility classes `.container`, `.section`, `.pill`, `.pill-solid`, `.btn`, `.btn-primary`, `.btn-secondary`, `.reveal`, `.mono-label`.

- [ ] **Step 1: Replace the entire contents of `index.html` with:**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VAmore Systems — FiveM scripts that talk to each other</title>
<link rel="icon" href="assets/vamore-favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Martian+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="nav" id="nav">
  <div class="container nav-inner">
    <a href="#top" class="nav-logo">
      <svg width="26" height="26" viewBox="0 0 128 128" fill="none" aria-hidden="true">
        <defs><linearGradient id="vamMark" gradientUnits="userSpaceOnUse" x1="14" y1="104" x2="110" y2="20"><stop offset="0%" stop-color="#1450c8"></stop><stop offset="55%" stop-color="#1b8fc4"></stop><stop offset="100%" stop-color="#25c9b0"></stop></linearGradient></defs>
        <path d="M14 24 L27 54" stroke="url(#vamMark)" stroke-width="15"></path>
        <path d="M30.5 62 L46 98 L78 24 L110 98" stroke="url(#vamMark)" stroke-width="15" stroke-linejoin="miter"></path>
        <path d="M50 74 H107" stroke="url(#vamMark)" stroke-width="15"></path>
      </svg>
      <span>VAmore Systems</span>
    </a>
    <nav class="nav-links">
      <a href="#suite">Suite</a>
      <a href="#demo">Demo</a>
      <a href="#compare">Compare</a>
    </nav>
    <div class="nav-actions">
      <a href="#" class="pill" data-placeholder="true">discord</a>
      <a href="#" class="btn btn-primary" data-placeholder="true">Buy on Tebex</a>
    </div>
  </div>
</header>

<main id="top">
  <section class="section hero">
    <div class="container hero-inner">
      <div class="hero-badges">
        <span class="pill pill-solid">esx</span>
        <span class="pill pill-solid">qbcore</span>
        <span class="pill pill-solid">qbox</span>
        <span class="pill">standalone</span>
      </div>
      <h1>Ten systems that were written to talk to each other.</h1>
      <p>Most servers stitch a phone from one vendor onto an inventory from another and spend
        the season fixing the seam. VAmore ships the whole layer — one item table, one
        notification stack, one support thread.</p>
      <div class="hero-cta">
        <a href="#suite" class="btn btn-primary">View the suite</a>
        <a href="#demo" class="btn btn-secondary">See how it runs</a>
      </div>
    </div>
  </section>

  <section class="section features">
    <div class="container features-grid">
      <div class="feature reveal">
        <span class="feature-icon">↻</span>
        <h3>Regular updates</h3>
        <!-- TODO: placeholder service claim — confirm real update cadence before launch -->
        <p>Continuous improvements across the suite. (placeholder)</p>
      </div>
      <div class="feature reveal">
        <span class="feature-icon">◆</span>
        <h3>Active support</h3>
        <!-- TODO: placeholder service claim — confirm real support commitment before launch -->
        <p>We're here when something breaks. (placeholder)</p>
      </div>
      <div class="feature reveal">
        <span class="feature-icon">10</span>
        <h3>Systems, one codebase</h3>
        <p>Every system in the suite shares the same item table, permissions and notifications.</p>
      </div>
    </div>
  </section>

  <section id="suite" class="section suite">
    <div class="container suite-inner">
      <div class="suite-head">
        <h2>What's in the suite.</h2>
        <span class="mono-label">ten systems, one vendor</span>
      </div>
      <div class="product-grid" id="product-grid"></div>
    </div>
  </section>

  <section id="demo" class="section demo">
    <div class="container demo-inner">
      <!-- TODO: this whole demo block (headline, subcopy, video resolution, chapter timestamps) describes a specific recording that doesn't exist yet — replace once a real demo video is recorded -->
      <div class="demo-head">
        <h2>Eleven minutes, one server, nothing cut.</h2>
        <p>Recorded on a Saturday night with 61 players online. Jump to whichever system you were
          going to ask about anyway.</p>
      </div>
      <div class="demo-video reveal">
        <span id="demo-video-label">demo video · 2400×1240 · 00:00 boot</span>
      </div>
      <div class="demo-chapters" id="demo-chapters">
        <button class="chapter-btn is-active" data-chapter="00:00 boot">00:00 boot</button>
        <button class="chapter-btn" data-chapter="01:12 inventory">01:12 inventory</button>
        <button class="chapter-btn" data-chapter="03:40 phone">03:40 phone</button>
        <button class="chapter-btn" data-chapter="05:55 housing">05:55 housing</button>
        <button class="chapter-btn" data-chapter="08:02 dispatch">08:02 dispatch</button>
        <button class="chapter-btn" data-chapter="09:48 admin">09:48 admin</button>
      </div>
    </div>
  </section>

  <section id="compare" class="section compare">
    <div class="container compare-inner">
      <div class="compare-head">
        <h2>One vendor, or five.</h2>
        <p>Nothing here is a dig at single-script developers — plenty are excellent. It's just a
          different shape of problem once you run ten of them side by side.</p>
      </div>
      <div class="compare-table">
        <div class="compare-row compare-row-head">
          <span></span>
          <span class="compare-col-ours">vamore suite</span>
          <span>mixed vendors</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">Item metadata across systems</span>
          <span class="compare-ours">one table</span>
          <span class="compare-theirs">bridge per pair</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">Permissions and job grades</span>
          <span class="compare-ours">inherited</span>
          <span class="compare-theirs">redefined per script</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">Notification style</span>
          <span class="compare-ours">one stack</span>
          <span class="compare-theirs">three or four</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">A bug between two systems</span>
          <span class="compare-ours">one ticket</span>
          <span class="compare-theirs">two vendors pointing at each other</span>
        </div>
        <div class="compare-row">
          <span class="compare-label">Framework migration</span>
          <span class="compare-ours">suite-wide, one release</span>
          <span class="compare-theirs">whenever each vendor gets to it</span>
        </div>
        <!-- TODO: "0.19 ms" / "0.6–1.4 ms" are placeholder perf claims tied to the placeholder script lineup — replace with real measurements before launch -->
        <div class="compare-row">
          <span class="compare-label">Total idle cost</span>
          <span class="compare-ours">0.19 ms</span>
          <span class="compare-theirs">typically 0.6–1.4 ms</span>
        </div>
      </div>
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
      <p>The whole server layer from one place, maintained by the people who run a server on it.</p>
      <div class="footer-socials">
        <a href="#" class="pill" data-placeholder="true">discord</a>
        <a href="#" class="pill" data-placeholder="true">youtube</a>
      </div>
    </div>
    <div class="footer-col">
      <span class="footer-col-title">suite</span>
      <a href="#suite">Inventory</a>
      <a href="#suite">Phone</a>
      <a href="#suite">Housing</a>
      <a href="#suite">All ten systems</a>
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

Run: `grep -c "id=\"nav\"\|id=\"product-grid\"\|id=\"demo-chapters\"\|id=\"demo-video-label\"" index.html` → expect `4` (all four IDs Task 1's JS queries are present exactly once each).
Run: `grep -c "id=\"pricing\"\|id=\"support\"\|flagship\|suite-panel\|suite-list" index.html` → expect `0` (confirms removed sections/classes are gone).
Open `index.html` directly in a browser (note: the product grid will render empty until Task 1's `script.js` is in place — since Task 1 runs first in this plan, it already is): confirm nav, centered hero, 3-column feature row, suite heading + populated product grid, demo, compare, footer all appear top to bottom with no console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite index.html for lbscripts-anatomy rebuild (centered hero, feature row, static product grid, drop pricing/support)"
```

---

### Task 3: Rewrite `style.css`

**Files:**
- Modify (full rewrite): `style.css`

**Interfaces:**
- Consumes: every class name and ID Task 2's `index.html` defines (see Task 2's Interfaces list) — this task must style all of them.
- Produces: nothing further — this is the last task in the plan.

- [ ] **Step 1: Replace the entire contents of `style.css` with:**

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
}
a { color: var(--color-accent-teal-bright); text-decoration: none; }
a:hover { color: var(--color-accent-blue); }
:focus-visible { outline: 2px solid var(--color-accent-teal-bright); outline-offset: 3px; border-radius: 999px; }
::selection { background: rgba(37, 201, 176, 0.3); }
img { max-width: 100%; display: block; }

:root {
  --font-body: 'Instrument Sans', Helvetica, sans-serif;
  --font-mono: 'Martian Mono', monospace;
  --color-bg: #0a0f16;
  --color-bg-alt: #060a10;
  --color-surface: #101927;
  --color-text: #f5f7fa;
  --color-text-secondary: rgba(245, 247, 250, 0.72);
  --color-text-muted: rgba(245, 247, 250, 0.54);
  --color-accent-blue: #1450c8;
  --color-accent-teal: #0a6f68;
  --color-accent-teal-bright: #25c9b0;
  --color-border: rgba(245, 247, 250, 0.10);
  --color-border-soft: rgba(245, 247, 250, 0.18);
  --radius-pill: 999px;
  --radius-card: 22px;
  --nav-height: 64px;
}

@keyframes vamIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}

.container { max-width: 1240px; margin: 0 auto; padding: 0 clamp(18px, 4vw, 36px); }
.section { padding: clamp(48px, 6vw, 88px) clamp(18px, 4vw, 36px); scroll-margin-top: var(--nav-height); }

.pill {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 6px 11px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  transition: color 160ms ease, border-color 160ms ease;
}
a.pill:hover { color: var(--color-text); border-color: rgba(245, 247, 250, 0.4); }
.pill-solid { background: var(--color-surface); color: var(--color-text); border-color: var(--color-border-soft); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  padding: 13px 24px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}
.btn-primary { color: var(--color-bg); background: #fff; }
.btn-primary:hover { background: var(--color-accent-teal-bright); color: var(--color-bg); }
.btn-secondary { color: var(--color-text); border-color: var(--color-border-soft); }
.btn-secondary:hover { border-color: var(--color-text); }

.reveal { opacity: 0; }
.reveal.is-visible { animation: vamIn 560ms ease both; }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 90;
  background: transparent; border-bottom: 1px solid transparent;
  backdrop-filter: blur(18px);
  transition: background 240ms ease, border-color 240ms ease;
}
.nav.is-scrolled { background: rgba(10, 15, 22, 0.85); border-bottom-color: var(--color-border); }
.nav-inner {
  height: var(--nav-height);
  display: flex; align-items: center; gap: clamp(16px, 3vw, 40px);
}
.nav-logo { display: flex; align-items: center; gap: 10px; color: var(--color-text); font-size: 16px; font-weight: 600; letter-spacing: -0.03em; }
.nav-links { display: flex; align-items: center; gap: clamp(12px, 2vw, 24px); font-size: 14px; flex-wrap: wrap; margin: 0 auto; }
.nav-links a { color: var(--color-text-muted); }
.nav-links a:hover { color: var(--color-text); }
.nav-actions { margin-left: auto; display: flex; align-items: center; gap: 9px; }

.hero { padding-top: clamp(140px, 18vh, 200px); padding-bottom: clamp(48px, 7vw, 90px); text-align: center; }
.hero-inner { display: flex; flex-direction: column; align-items: center; gap: 22px; max-width: 760px; margin: 0 auto; }
.hero-badges { display: flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }
.hero h1 { margin: 0; font-size: clamp(42px, 7vw, 92px); line-height: 0.98; font-weight: 600; letter-spacing: -0.05em; text-wrap: balance; }
.hero p { margin: 0; font-size: clamp(16px, 1.8vw, 19px); line-height: 1.6; color: var(--color-text-secondary); max-width: 52ch; }
.hero-cta { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: clamp(24px, 4vw, 40px); }
.feature { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.feature-icon {
  font-family: var(--font-mono); font-size: 20px; color: var(--color-accent-teal-bright);
  width: 48px; height: 48px; border-radius: var(--radius-pill); background: var(--color-surface);
  border: 1px solid var(--color-border); display: grid; place-items: center;
}
.feature h3 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.02em; }
.feature p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--color-text-muted); max-width: 32ch; }

.suite-inner { display: flex; flex-direction: column; gap: clamp(24px, 3vw, 36px); }
.suite-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
.suite-head h2 { margin: 0; font-size: clamp(30px, 4.4vw, 58px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; }
.mono-label { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-text-muted); }

.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.product-card {
  border-radius: var(--radius-card); background: var(--color-surface); border: 1px solid var(--color-border);
  padding: 22px; display: flex; flex-direction: column; gap: 12px;
}
.product-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.product-card-slug { font-family: var(--font-mono); font-size: 10px; padding: 6px 10px; border-radius: var(--radius-pill); background: rgba(245, 247, 250, 0.06); color: var(--color-text-muted); }
.product-card-price { font-family: var(--font-mono); font-size: 13px; color: var(--color-accent-teal-bright); }
.product-card h3 { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -0.03em; }
.product-card p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--color-text-secondary); flex-grow: 1; }
.product-card-fw { display: flex; flex-wrap: wrap; gap: 6px; }

.demo { background: var(--color-bg-alt); }
.demo-inner { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 32px); }
.demo-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
.demo-head h2 { margin: 0; font-size: clamp(28px, 4vw, 50px); line-height: 1.05; font-weight: 600; letter-spacing: -0.045em; max-width: 18ch; }
.demo-head p { margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--color-text-muted); max-width: 40ch; }

.demo-video {
  border-radius: clamp(14px, 2vw, 22px); overflow: hidden; border: 1px solid var(--color-border);
  background: var(--color-surface); height: clamp(180px, 28vw, 380px);
  display: grid; place-items: center;
}
.demo-video span { font-family: var(--font-mono); font-size: clamp(9.5px, 1.1vw, 11px); color: var(--color-text-muted); text-align: center; padding: 0 20px; }

.demo-chapters { display: flex; flex-wrap: wrap; gap: 8px; }
.chapter-btn {
  font-family: var(--font-mono); font-size: 10px; padding: 9px 14px; border-radius: var(--radius-pill);
  cursor: pointer; background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border-soft);
}
.chapter-btn.is-active { background: #fff; color: var(--color-bg); border-color: #fff; }

.compare-inner { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(20px, 3vw, 32px); }
.compare-head { display: flex; flex-direction: column; gap: 12px; max-width: 34ch; }
.compare-head h2 { margin: 0; font-size: clamp(28px, 4vw, 50px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; }
.compare-head p { margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--color-text-muted); }

.compare-table { border-radius: 20px; background: var(--color-surface); border: 1px solid var(--color-border); overflow: hidden; }
.compare-row { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; align-items: center; padding: 14px clamp(16px, 3vw, 26px); border-bottom: 1px solid var(--color-border); }
.compare-row:last-child { border-bottom: none; }
.compare-row-head { font-family: var(--font-mono); font-size: 10px; color: var(--color-text-muted); }
.compare-col-ours { text-align: center; color: var(--color-text); }
.compare-row-head span:nth-child(3) { text-align: center; }
.compare-label { font-size: 14.5px; font-weight: 500; }
.compare-ours { text-align: center; font-size: 13.5px; color: var(--color-accent-teal-bright); }
.compare-theirs { text-align: center; font-size: 13.5px; color: var(--color-text-muted); }

.footer { background: var(--color-bg-alt); border-top: 1px solid var(--color-border); padding: clamp(36px, 6vw, 60px) clamp(18px, 4vw, 36px) 28px; }
.footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 30px; }
.footer-brand { display: flex; flex-direction: column; gap: 12px; }
.footer-brand p { margin: 0; font-size: 13px; line-height: 1.6; color: var(--color-text-muted); max-width: 27ch; }
.footer-socials { display: flex; gap: 7px; }
.footer-col { display: flex; flex-direction: column; gap: 9px; }
.footer-col-title { font-family: var(--font-mono); font-size: 10px; color: var(--color-text-muted); }
.footer-col a { font-size: 13.5px; color: var(--color-text-muted); }
.footer-col a:hover { color: var(--color-text); }
.footer-legal {
  margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--color-border);
  display: flex; gap: 18px; flex-wrap: wrap;
  font-family: var(--font-mono); font-size: 9.5px; color: var(--color-text-muted);
}
.footer-legal a { color: var(--color-text-muted); }
.footer-legal a:hover { color: var(--color-text); }
```

- [ ] **Step 2: Verify**

Run: `grep -c "product-card\|feature-icon\|nav-links\|compare-table\|footer-grid" style.css` → expect at least 5 (one rule block per class family present).
Run: `grep -c "flagship\|glow-blue\|glow-teal\|pricing-card\|stat-value\|suite-panel\|suite-list\|suite-row" style.css` → expect `0` (confirms all obsolete rules removed).
Open `index.html` in a browser: confirm the whole page renders dark (near-black background, light text), nav/hero/features/product-grid/demo/compare/footer all styled and legible, product cards show data in a grid, no unstyled/broken elements, no console errors.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: rewrite style.css for full-dark compact lbscripts-anatomy theme"
```

---

## Final Verification (whole-branch)

After all 3 tasks: open `index.html` in a browser and check top to bottom against the spec's structure — nav (logo, Suite/Demo/Compare links, Discord + Tebex CTA), centered hero, 3-column feature row (2 with TODO-marked placeholder claims, 1 real fact), suite heading + 10-card product grid, demo (video placeholder + chapters, still interactive), compare table, footer (logo/columns/legal). Confirm: no Pricing or Support section exists anywhere, no console errors, no leftover references to flagship/picker/pricing code in any file, every specific-sounding new claim is real or TODO/placeholder-marked, page reads noticeably shorter/more compact than the previous version.
