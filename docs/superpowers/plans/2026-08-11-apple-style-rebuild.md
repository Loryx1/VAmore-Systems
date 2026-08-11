# VAmore Systems Landing Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current broken `index.html` (depends on a nonexistent `support.js` and
non-standard custom tags) with a plain, dependency-free HTML/CSS/JS site that renders correctly
on GitHub Pages, keeping the existing Apple-like visual direction and section structure.

**Architecture:** Three static files — `index.html` (markup only), `style.css` (all styling via
CSS custom properties), `script.js` (small vanilla-JS behaviors: nav scroll state, suite
picker, demo chapter toggle, scroll-reveal). No framework, no build step, no test runner —
correctness is verified by opening the page in a browser and checking the DOM/console, since
there is no application logic beyond simple DOM toggling.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, `clamp()`, CSS Grid/Flexbox), vanilla
JavaScript (`IntersectionObserver`, `classList`). Google Fonts (Instrument Sans, Martian Mono) —
same `<link>` tags as today.

## Global Constraints

- No `x-dc`, `sc-for`, `{{ }}`, `data-dc-script`, or any reference to `support.js` may remain
  anywhere in the repo when done (spec: Problem).
- No build step, no bundler, no JS framework, no test runner added (spec: Non-goals).
- Keep brand accent colors: blue `#1450c8`, teal `#0a6f68` / `#25c9b0` (spec: Design tokens).
- Every not-yet-real piece of content (script lineup/prices, support stats, Tebex/Discord URLs)
  must be visibly marked as a placeholder in source, not shipped as unmarked fact (spec:
  Sections 6, decisions from brainstorming).
- All `href="#"` placeholder links carry `data-placeholder="true"`.
- Respect `prefers-reduced-motion` for all animation (spec: Design tokens).
- Site must work opened directly as a static file (`file://` or any static server) — no
  server-side processing.

---

### Task 1: File scaffold, design tokens, nav, footer

**Files:**
- Create: `style.css`
- Create: `script.js`
- Modify: `index.html` (full rewrite, replacing the current `x-dc`-based content)

**Interfaces:**
- Produces: CSS custom properties on `:root` (`--font-body`, `--font-mono`, `--color-bg`,
  `--color-text`, `--color-text-secondary`, `--color-text-muted`, `--color-accent-blue`,
  `--color-accent-teal`, `--color-accent-teal-bright`, `--color-dark-bg`, `--color-dark-bg-2`,
  `--color-border`, `--color-border-soft`, `--radius-pill`, `--radius-card`, `--nav-height`)
  used by every later task. Utility classes `.pill`, `.pill-mono`, `.btn`, `.btn-primary`,
  `.btn-secondary`, `.section`, `.section-dark`, `.container` used by every later task.
  `script.js` exports nothing (plain script, `DOMContentLoaded`-gated) but later tasks append
  their own `init*()` functions to it and call them from one bottom `DOMContentLoaded` listener
  that Task 1 creates.

- [ ] **Step 1: Create `style.css` with reset, tokens, and shared utility classes**

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
}
a { color: var(--color-accent-blue); text-decoration: none; }
a:hover { color: var(--color-accent-teal); }
:focus-visible { outline: 2px solid var(--color-accent-blue); outline-offset: 3px; border-radius: 999px; }
::selection { background: #cddffb; }
img { max-width: 100%; display: block; }

:root {
  --font-body: 'Instrument Sans', Helvetica, sans-serif;
  --font-mono: 'Martian Mono', monospace;
  --color-bg: #eef1f5;
  --color-text: #121820;
  --color-text-secondary: #454d58;
  --color-text-muted: #474f5a;
  --color-accent-blue: #1450c8;
  --color-accent-teal: #0a6f68;
  --color-accent-teal-bright: #25c9b0;
  --color-dark-bg: #0c1520;
  --color-dark-bg-2: #060d15;
  --color-border: rgba(18, 24, 32, 0.09);
  --color-border-soft: rgba(18, 24, 32, 0.16);
  --radius-pill: 999px;
  --radius-card: 26px;
  --nav-height: 68px;
}

@keyframes vamIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}

.container { max-width: 1300px; margin: 0 auto; padding: 0 clamp(18px, 4vw, 40px); }
.section { padding: clamp(80px, 11vw, 150px) clamp(18px, 4vw, 40px); scroll-margin-top: var(--nav-height); }
.section-dark { background: var(--color-dark-bg); color: #fff; }

.pill {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
}
.pill-solid { background: var(--color-text); color: #fff; border-color: var(--color-text); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15.5px;
  font-weight: 500;
  padding: 15px 28px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;
}
.btn-primary { color: #fff; background: var(--color-text); }
.btn-primary:hover { background: var(--color-accent-blue); color: #fff; }
.btn-secondary { color: var(--color-text); border-color: var(--color-border-soft); }
.btn-secondary:hover { border-color: var(--color-text); color: var(--color-text); }

.reveal { opacity: 0; }
.reveal.is-visible { animation: vamIn 620ms ease both; }
```

- [ ] **Step 2: Create `script.js` with the `DOMContentLoaded` entry point**

```js
document.addEventListener('DOMContentLoaded', () => {
  // Later tasks add initNavScroll(), initSuitePicker(), initDemoChapters(),
  // initScrollReveal() here.
});
```

- [ ] **Step 3: Write `index.html` head, nav, and footer (hero/demo/suite/compare/support/pricing left as HTML comments for later tasks)**

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
      <a href="#suite">The suite</a>
      <a href="#demo">Demo</a>
      <a href="#compare">Compare</a>
      <a href="#support">Support</a>
    </nav>
    <div class="nav-actions">
      <a href="#" class="pill" data-placeholder="true">discord</a>
      <a href="#pricing" class="pill pill-solid">get the suite</a>
    </div>
  </div>
</header>

<main id="top">
  <!-- Task 2: hero section -->
  <!-- Task 3: demo section -->
  <!-- Task 4: suite section -->
  <!-- Task 5: compare + support sections -->
  <!-- Task 6: pricing section -->
</main>

<footer class="footer section-light">
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
      <a href="#support">Support</a>
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

- [ ] **Step 4: Add nav/footer CSS to `style.css`**

```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 90;
  background: transparent; border-bottom: 1px solid transparent;
  backdrop-filter: blur(20px);
  transition: background 240ms ease, border-color 240ms ease;
}
.nav.is-scrolled { background: rgba(246, 248, 251, 0.85); border-bottom-color: rgba(18, 24, 32, 0.1); }
.nav-inner {
  height: var(--nav-height);
  display: flex; align-items: center; gap: clamp(16px, 3vw, 44px);
}
.nav-logo { display: flex; align-items: center; gap: 10px; color: var(--color-text); font-size: 16.5px; font-weight: 600; letter-spacing: -0.03em; }
.nav-links { display: flex; align-items: center; gap: clamp(12px, 2vw, 26px); font-size: 14.5px; flex-wrap: wrap; }
.nav-links a { color: var(--color-text-muted); }
.nav-links a:hover { color: var(--color-text); }
.nav-actions { margin-left: auto; display: flex; align-items: center; gap: 9px; }

.footer { background: #e5eaf0; border-top: 1px solid rgba(18, 24, 32, 0.08); padding: clamp(46px, 7vw, 76px) clamp(18px, 4vw, 40px) 34px; }
.footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 34px; }
.footer-brand { display: flex; flex-direction: column; gap: 14px; }
.footer-brand p { margin: 0; font-size: 13.5px; line-height: 1.6; color: #4a525d; max-width: 27ch; }
.footer-socials { display: flex; gap: 7px; }
.footer-col { display: flex; flex-direction: column; gap: 10px; }
.footer-col-title { font-family: var(--font-mono); font-size: 10px; color: #5b636e; }
.footer-col a { font-size: 14px; color: var(--color-text-muted); }
.footer-col a:hover { color: var(--color-text); }
.footer-legal {
  margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(18, 24, 32, 0.08);
  display: flex; gap: 20px; flex-wrap: wrap;
  font-family: var(--font-mono); font-size: 9.5px; color: #5b636e;
}
.footer-legal a { color: #5b636e; }
.footer-legal a:hover { color: var(--color-text); }
```

- [ ] **Step 5: Manual verification**

Open `index.html` directly in a browser. Expected: nav bar with logo, links, discord/CTA
buttons visible and styled; footer with brand block, three link columns, legal line visible;
no console errors; page background is the light gray token color (empty `<main>` in between is
expected at this point).

- [ ] **Step 6: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: scaffold plain-HTML site with nav and footer"
```

---

### Task 2: Hero section

**Files:**
- Modify: `index.html` (replace `<!-- Task 2: hero section -->` comment)
- Modify: `style.css` (append hero styles)

**Interfaces:**
- Consumes: `.container`, `.pill`, `.pill-solid`, `.btn`, `.btn-primary`, `.btn-secondary` from
  Task 1.
- Produces: `#hero-pills` element (empty `<div>` with id `hero-pills`) that Task 4 populates
  with the same 10 script slugs via JS, so the two lists (hero card + suite list) stay in sync
  from one data source. Also defines the `SYSTEMS` JS data array format Task 4 depends on — see
  Task 4 for the array itself (declared once, in `script.js`, by Task 4).

- [ ] **Step 1: Replace the hero comment in `index.html` with markup**

```html
<section class="section hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <div class="hero-badges">
        <span class="pill pill-solid">esx</span>
        <span class="pill pill-solid">qbcore</span>
        <span class="pill pill-solid">qbox</span>
        <span class="pill">one config line</span>
      </div>
      <h1>Ten systems that were written to talk to each other.</h1>
      <p>Most servers stitch a phone from one vendor onto an inventory from another and spend
        the season fixing the seam. VAmore ships the whole layer — one item table, one
        notification stack, one support thread.</p>
      <div class="hero-cta">
        <a href="#pricing" class="btn btn-primary">Get the full suite — €199</a>
        <a href="#suite" class="btn btn-secondary">See what's inside</a>
      </div>
    </div>
    <div class="hero-card reveal">
      <div class="hero-card-header">
        <span>server.cfg</span>
        <span class="hero-card-meta">10 resources · 0.19 ms total</span>
      </div>
      <div class="hero-card-pills" id="hero-pills"></div>
      <div class="hero-card-divider"></div>
      <div class="hero-card-footer">
        <span>Every pill above shares the same item table, permission model and notification stack.</span>
        <a href="#suite">inspect ›</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append hero CSS**

```css
.hero { padding-top: clamp(122px, 17vh, 190px); padding-bottom: clamp(60px, 9vw, 110px); background: radial-gradient(130% 80% at 78% -10%, #ffffff 0%, #f4f6fa 44%, #e9edf3 100%); }
.hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: clamp(36px, 5vw, 76px); align-items: center; }
.hero-copy { display: flex; flex-direction: column; gap: 26px; max-width: 620px; }
.hero-badges { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.hero-copy h1 { margin: 0; font-size: clamp(42px, 6.6vw, 88px); line-height: 0.98; font-weight: 600; letter-spacing: -0.05em; text-wrap: balance; }
.hero-copy p { margin: 0; font-size: clamp(16.5px, 1.9vw, 20px); line-height: 1.6; color: var(--color-text-secondary); max-width: 50ch; }
.hero-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

.hero-card {
  border-radius: var(--radius-card); background: #fff; border: 1px solid var(--color-border);
  padding: 26px; box-shadow: 0 44px 80px -54px #4f5762;
  display: flex; flex-direction: column; gap: 18px;
}
.hero-card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-family: var(--font-mono); font-size: 10px; color: #59616c; }
.hero-card-meta { color: var(--color-accent-teal); }
.hero-card-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.hero-card-divider { height: 1px; background: var(--color-border); }
.hero-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; font-size: 14.5px; color: var(--color-text-muted); }
.hero-card-footer span { max-width: 30ch; }
```

- [ ] **Step 3: Manual verification**

Open `index.html`. Expected: hero headline, subtext, two CTA buttons, and the `server.cfg` card
render (pill list inside the card is empty until Task 4 wires `#hero-pills`) — that's expected
at this point.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add hero section"
```

---

### Task 3: Demo section + chapter toggle JS

**Files:**
- Modify: `index.html` (replace `<!-- Task 3: demo section -->`)
- Modify: `style.css` (append demo styles)
- Modify: `script.js` (add `initDemoChapters()`)

**Interfaces:**
- Consumes: `.container`, `.section`, `.section-dark`, `.pill` from Task 1.
- Produces: nothing consumed by later tasks (self-contained section).

- [ ] **Step 1: Replace the demo comment with markup**

```html
<section id="demo" class="section section-dark demo">
  <div class="container demo-inner">
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
```

- [ ] **Step 2: Append demo CSS**

```css
.demo-inner { display: flex; flex-direction: column; gap: clamp(28px, 4vw, 46px); }
.demo-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
.demo-head h2 { margin: 0; font-size: clamp(30px, 4.6vw, 58px); line-height: 1.02; font-weight: 600; letter-spacing: -0.045em; color: #fff; max-width: 18ch; }
.demo-head p { margin: 0; font-size: 16.5px; line-height: 1.6; color: rgba(255, 255, 255, 0.58); max-width: 40ch; }

.demo-video {
  border-radius: clamp(16px, 2vw, 26px); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--color-dark-bg-2); height: clamp(220px, 42vw, 640px);
  display: grid; place-items: center;
}
.demo-video span { font-family: var(--font-mono); font-size: clamp(9.5px, 1.1vw, 11.5px); color: rgba(255, 255, 255, 0.62); text-align: center; padding: 0 20px; }

.demo-chapters { display: flex; flex-wrap: wrap; gap: 8px; }
.chapter-btn {
  font-family: var(--font-mono); font-size: 10.5px; padding: 10px 16px; border-radius: var(--radius-pill);
  cursor: pointer; background: transparent; color: rgba(255, 255, 255, 0.72); border: 1px solid rgba(255, 255, 255, 0.2);
}
.chapter-btn.is-active { background: #fff; color: var(--color-dark-bg); border-color: #fff; }
```

- [ ] **Step 3: Add `initDemoChapters()` to `script.js` and call it**

```js
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
```

Update the bottom listener:

```js
document.addEventListener('DOMContentLoaded', () => {
  initDemoChapters();
});
```

- [ ] **Step 4: Manual verification**

Open `index.html`, scroll to Demo section. Click each chapter button — expected: clicked button
gets the active (white) style, others revert, and the label above the video placeholder updates
to match. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add demo section with chapter toggle"
```

---

### Task 4: Suite section + script picker JS (and hero pill sync)

**Files:**
- Modify: `index.html` (replace `<!-- Task 4: suite section -->`)
- Modify: `style.css` (append suite styles)
- Modify: `script.js` (add `SYSTEMS` data array and `initSuite()`)

**Interfaces:**
- Consumes: `#hero-pills` element id from Task 2; `.container`, `.section`, `.pill` from Task 1.
- Produces: `SYSTEMS` array (module-level `const` in `script.js`), shape:
  `{ slug: string, name: string, price: string, fw: string[], body: string, facts: {k: string, v: string}[] }[]`.
  All 10 entries are placeholder content, each `body` string ends with " (placeholder)" so it
  reads as clearly non-final in the rendered UI, not just in source.

- [ ] **Step 1: Replace the suite comment with markup**

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

- [ ] **Step 2: Append suite CSS**

```css
.suite-inner { display: flex; flex-direction: column; gap: clamp(30px, 4vw, 52px); }
.suite-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
.suite-head h2 { margin: 0; font-size: clamp(32px, 5vw, 64px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; max-width: 16ch; }
.mono-label { font-family: var(--font-mono); font-size: 10.5px; color: #4f5762; }

.suite-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(20px, 3vw, 40px); align-items: start; }
.suite-list { display: flex; flex-direction: column; gap: 6px; }
.suite-row {
  text-align: left; cursor: pointer; display: flex; align-items: center; gap: 14px;
  padding: 15px 18px; border-radius: var(--radius-pill); border: 1px solid transparent; background: transparent;
  font-family: var(--font-body); width: 100%;
}
.suite-row.is-active { background: #fff; border-color: rgba(18, 24, 32, 0.12); }
.suite-row-slug { font-family: var(--font-mono); font-size: 10px; padding: 6px 11px; border-radius: var(--radius-pill); background: rgba(18, 24, 32, 0.06); color: #3f4751; white-space: nowrap; }
.suite-row.is-active .suite-row-slug { background: var(--color-accent-blue); color: #fff; }
.suite-row-name { font-size: 15.5px; font-weight: 500; color: #2c333d; }
.suite-row.is-active .suite-row-name { color: var(--color-text); }
.suite-row-price { margin-left: auto; font-family: var(--font-mono); font-size: 11px; color: #3f4751; }
.suite-row.is-active .suite-row-price { color: var(--color-accent-teal); }

.suite-panel {
  position: sticky; top: 92px; border-radius: var(--radius-card); background: #fff;
  border: 1px solid var(--color-border); overflow: hidden; box-shadow: 0 40px 80px -56px #4f5762;
}
.suite-panel-image {
  height: clamp(190px, 26vw, 300px);
  background: repeating-linear-gradient(135deg, rgba(18, 24, 32, 0.055) 0 13px, rgba(18, 24, 32, 0.015) 13px 26px);
  display: grid; place-items: center;
}
.suite-panel-image span { font-family: var(--font-mono); font-size: 10.5px; color: #5b636e; text-align: center; padding: 0 18px; }
.suite-panel-body { padding: clamp(22px, 3vw, 32px); display: flex; flex-direction: column; gap: 16px; }
.suite-panel-title { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
.suite-panel-title h3 { margin: 0; font-size: clamp(22px, 2.6vw, 30px); font-weight: 600; letter-spacing: -0.035em; }
.suite-panel-title span { font-family: var(--font-mono); font-size: 15px; color: var(--color-accent-teal); }
.suite-panel-body > p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--color-text-secondary); }
.suite-facts { display: flex; flex-direction: column; gap: 11px; }
.suite-fact { display: flex; align-items: baseline; gap: 14px; }
.suite-fact-key { font-family: var(--font-mono); font-size: 11px; min-width: 74px; color: var(--color-accent-blue); }
.suite-fact-val { font-size: 14.5px; line-height: 1.5; color: #454d58; }
.suite-fw { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
```

- [ ] **Step 3: Add `SYSTEMS` array and `initSuite()` to `script.js`**

```js
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

function renderHeroPills() {
  const wrap = document.getElementById('hero-pills');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map((s) => `<span class="pill">${s.slug}</span>`).join('');
}

function renderSuitePanel(index) {
  const panel = document.getElementById('suite-panel');
  const s = SYSTEMS[index];
  panel.innerHTML = `
    <div class="suite-panel-image"><span>${s.slug} · ui shot · 1600×900</span></div>
    <div class="suite-panel-body">
      <div class="suite-panel-title"><h3>${s.name}</h3><span>${s.price}</span></div>
      <p>${s.body}</p>
      <div class="suite-facts">
        ${s.facts.map((f) => `<div class="suite-fact"><span class="suite-fact-key">${f.k}</span><span class="suite-fact-val">${f.v}</span></div>`).join('')}
      </div>
      <div class="suite-fw">
        ${s.fw.map((f) => `<span class="pill">${f}</span>`).join('')}
      </div>
      <a href="#" class="btn btn-primary" data-placeholder="true">Buy ${s.name} on Tebex</a>
    </div>`;
}

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

Update the bottom listener:

```js
document.addEventListener('DOMContentLoaded', () => {
  initDemoChapters();
  initSuite();
});
```

- [ ] **Step 4: Manual verification**

Open `index.html`. Expected: hero card now shows 10 slug pills; Suite section lists 10 rows with
first (`va-inventory`) active by default and its detail panel shown on the right. Click a
different row — expected: active row highlight moves, detail panel updates to that script's
name/price/body/facts/frameworks, "Buy … on Tebex" button text updates. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add suite section with script picker"
```

---

### Task 5: Compare + Support sections

**Files:**
- Modify: `index.html` (replace `<!-- Task 5: compare + support sections -->`)
- Modify: `style.css` (append compare/support styles)

**Interfaces:**
- Consumes: `.container`, `.section`, `.section-dark` from Task 1.
- Produces: nothing consumed by later tasks (self-contained sections).

- [ ] **Step 1: Replace the compare/support comment with markup**

```html
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
      <div class="compare-row">
        <span class="compare-label">Total idle cost</span>
        <span class="compare-ours">0.19 ms</span>
        <span class="compare-theirs">typically 0.6–1.4 ms</span>
      </div>
    </div>
  </div>
</section>

<section id="support" class="section section-dark support">
  <div class="container support-inner">
    <div class="support-head">
      <h2>Support you can put a number on.</h2>
      <span class="mono-label mono-label-dark">rolling 90-day window · updated weekly</span>
    </div>
    <!-- TODO: replace with real support metrics before launch — currently placeholder numbers -->
    <div class="support-grid">
      <div class="stat">
        <span class="stat-value">— h — m</span>
        <span class="stat-key">Median first reply (placeholder)</span>
        <span class="stat-note">Replace with a real measured value before launch.</span>
      </div>
      <div class="stat">
        <span class="stat-value">—%</span>
        <span class="stat-key">Closed same day (placeholder)</span>
        <span class="stat-note">Replace with a real measured value before launch.</span>
      </div>
      <div class="stat">
        <span class="stat-value">—</span>
        <span class="stat-key">Releases this year (placeholder)</span>
        <span class="stat-note">Replace with a real measured value before launch.</span>
      </div>
      <div class="stat">
        <span class="stat-value">0</span>
        <span class="stat-key">Paid version bumps (placeholder)</span>
        <span class="stat-note">Confirm this policy, then keep or replace.</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append compare/support CSS**

```css
.compare-inner { max-width: 1080px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(28px, 4vw, 44px); }
.compare-head { display: flex; flex-direction: column; gap: 16px; max-width: 34ch; }
.compare-head h2 { margin: 0; font-size: clamp(32px, 5vw, 62px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; }
.compare-head p { margin: 0; font-size: 17px; line-height: 1.6; color: #454d58; }

.compare-table { border-radius: 24px; background: #fff; border: 1px solid var(--color-border); overflow: hidden; }
.compare-row { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; align-items: center; padding: 18px clamp(18px, 3vw, 30px); border-bottom: 1px solid rgba(18, 24, 32, 0.07); }
.compare-row-head { font-family: var(--font-mono); font-size: 10px; color: #59616c; border-bottom: 1px solid var(--color-border); }
.compare-col-ours { text-align: center; color: var(--color-text); }
.compare-row-head span:nth-child(3) { text-align: center; }
.compare-label { font-size: 15.5px; font-weight: 500; }
.compare-ours { text-align: center; font-size: 14px; color: var(--color-accent-teal); }
.compare-theirs { text-align: center; font-size: 14px; color: #4f5762; }

.support-inner { display: flex; flex-direction: column; gap: clamp(34px, 5vw, 60px); }
.support-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
.support-head h2 { margin: 0; font-size: clamp(32px, 5vw, 62px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; color: #fff; max-width: 18ch; }
.mono-label-dark { color: rgba(255, 255, 255, 0.62); }
.support-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: clamp(24px, 4vw, 54px); }
.stat { display: flex; flex-direction: column; gap: 10px; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, 0.16); }
.stat-value { font-size: clamp(34px, 4.4vw, 54px); font-weight: 600; letter-spacing: -0.045em; color: #fff; line-height: 1; }
.stat-key { font-size: 15px; font-weight: 500; color: var(--color-accent-teal-bright); }
.stat-note { font-size: 14px; line-height: 1.55; color: rgba(255, 255, 255, 0.68); }
```

- [ ] **Step 3: Manual verification**

Open `index.html`, scroll to Compare and Support. Expected: comparison table renders 6 rows with
header; Support section clearly shows placeholder dashes/labels (not fabricated specific
numbers) with a visible source comment. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add compare and support sections"
```

---

### Task 6: Pricing section

**Files:**
- Modify: `index.html` (replace `<!-- Task 6: pricing section -->`)
- Modify: `style.css` (append pricing styles)
- Modify: `script.js` (add `renderPricingPills()`, called alongside suite render)

**Interfaces:**
- Consumes: `SYSTEMS` array from Task 4; `.container`, `.section`, `.btn-primary` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Replace the pricing comment with markup**

```html
<section id="pricing" class="section pricing">
  <div class="container pricing-grid">
    <div class="pricing-copy">
      <h2>Take the whole layer.</h2>
      <p>Ten systems, one license key, one Discord thread. Buy scripts individually if you'd
        rather start small — the suite price stays open to you as an upgrade for the
        difference.</p>
      <div class="pricing-terms">
        <span>14-day refund</span><span>escrow protected</span><span>lifetime updates</span>
      </div>
    </div>
    <div class="pricing-card">
      <span class="pricing-card-label">full suite</span>
      <div class="pricing-card-price">
        <span class="pricing-card-amount">€199</span>
        <span class="pricing-card-was">instead of €297</span>
      </div>
      <div class="pricing-card-pills" id="pricing-pills"></div>
      <a href="#" class="btn btn-light" data-placeholder="true">Get it on Tebex</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append pricing CSS**

```css
.pricing-grid { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(24px, 3vw, 40px); align-items: center; }
.pricing-copy { display: flex; flex-direction: column; gap: 20px; }
.pricing-copy h2 { margin: 0; font-size: clamp(32px, 5vw, 60px); line-height: 1; font-weight: 600; letter-spacing: -0.045em; max-width: 14ch; }
.pricing-copy p { margin: 0; font-size: 17px; line-height: 1.6; color: #454d58; max-width: 44ch; }
.pricing-terms { display: flex; gap: 24px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 10.5px; color: #4f5762; }

.pricing-card { border-radius: var(--radius-card); background: var(--color-text); padding: clamp(28px, 4vw, 42px); display: flex; flex-direction: column; gap: 20px; }
.pricing-card-label { font-family: var(--font-mono); font-size: 10px; color: var(--color-accent-teal-bright); }
.pricing-card-price { display: flex; align-items: baseline; gap: 12px; }
.pricing-card-amount { font-size: clamp(44px, 6vw, 66px); font-weight: 600; letter-spacing: -0.05em; color: #fff; line-height: 1; }
.pricing-card-was { font-size: 15px; color: rgba(255, 255, 255, 0.64); }
.pricing-card-pills { display: flex; flex-wrap: wrap; gap: 7px; }
.pricing-card-pills .pill { font-size: 9.5px; padding: 7px 11px; border-color: rgba(255, 255, 255, 0.18); color: rgba(255, 255, 255, 0.62); }

.btn-light { color: var(--color-text); background: #fff; }
.btn-light:hover { background: var(--color-accent-teal-bright); color: var(--color-text); }
```

- [ ] **Step 3: Add pricing pill render to `script.js`**

```js
function renderPricingPills() {
  const wrap = document.getElementById('pricing-pills');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map((s) => `<span class="pill">${s.slug}</span>`).join('');
}
```

Update the bottom listener:

```js
document.addEventListener('DOMContentLoaded', () => {
  initDemoChapters();
  initSuite();
  renderPricingPills();
});
```

- [ ] **Step 4: Manual verification**

Open `index.html`, scroll to Pricing. Expected: price card shows €199/€297, 10 slug pills, "Get
it on Tebex" button. No console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add pricing section"
```

---

### Task 7: Global nav-scroll + scroll-reveal behavior, cleanup, final verification

**Files:**
- Modify: `script.js` (add `initNavScroll()`, `initScrollReveal()`)
- Modify: `index.html` (add `reveal` class to remaining section-level cards if missing)
- Delete: nothing tracked depends on `support.js` (it was already absent — confirm no stray
  references remain)

**Interfaces:**
- Consumes: `#nav` id from Task 1, `.reveal` class from Task 1.
- Produces: fully working page — no further tasks depend on this one.

- [ ] **Step 1: Add `initNavScroll()` and `initScrollReveal()` to `script.js`**

```js
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
```

Update the bottom listener to its final form:

```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initDemoChapters();
  initSuite();
  renderPricingPills();
  initScrollReveal();
});
```

- [ ] **Step 2: Add `reveal` class to the demo video block if not already present**

Confirm `<div class="demo-video reveal">` from Task 3 already has the class (it does per Task 3
Step 1) — no change needed, this step is a check, not an edit.

- [ ] **Step 3: Repo-wide cleanup check**

Run:

```bash
grep -rn "x-dc\|sc-for\|support.js\|data-dc-script" --include="*.html" --include="*.js" .
```

Expected: no matches. If any remain, remove them.

- [ ] **Step 4: Full manual verification pass**

- Open `index.html` in a browser: scroll past 30px — nav background/blur should fade in.
- Resize to mobile width (~375px), tablet (~768px), desktop (~1440px) — layout should reflow
  without horizontal scrollbars or overlapping text.
- Enable "reduce motion" in OS accessibility settings (or use browser devtools rendering
  emulation for `prefers-reduced-motion: reduce`) — reveal animations should be skipped
  (elements visible immediately, no slide-in).
- Open devtools console — expect zero errors/warnings on load and on every interaction (nav
  scroll, chapter click, suite row click).
- Confirm every placeholder link (`data-placeholder="true"`) is visually normal (not broken)
  and confirm the support-stats TODO comment is present in source.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: wire nav scroll and scroll-reveal behavior; final cleanup pass"
```

---

## Post-plan note

`support.js` was never tracked in git, so no deletion step is needed for it. The old `x-dc`
markup is fully replaced by Task 1's rewrite of `index.html`, so no separate removal task is
required.
