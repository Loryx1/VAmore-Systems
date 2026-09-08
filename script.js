/* VAmore Systems — console behaviour
   Data below is the real lineup. Two resources are purchasable, two are in
   development; nothing here may claim otherwise. */

const RESOURCES = [
  {
    slug: 'vamore_configpanel',
    name: 'Config Manager',
    price: 'free',
    priceNote: '€0',
    status: 'running',
    category: 'core',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    line: 'One ACE-gated panel, one tab per registered script.',
    verbose: 'Sliders and inputs replace config.lua. Changes apply live. Any script registers its schema with a single export.',
    tebexPackageId: '7627638',
    detailUrl: 'products/configpanel.html',
  },
  {
    slug: 'vamore_banking',
    name: 'Banking',
    price: '€40',
    status: 'running',
    category: 'economy',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    line: 'IBAN accounts, savings, credit, markets, faction payroll.',
    verbose: 'PIN-protected accounts, ATM and branch handling, compounding savings with goals, event-based credit, 10 stocks and 5 coins on live pricing engines, grade-gated faction accounts, fraud dashboard with Discord alerts.',
    tebexPackageId: '7627622',
    detailUrl: 'products/banking.html',
  },
  {
    slug: 'vamore_invoices',
    name: 'Invoices',
    price: '€25',
    status: 'building',
    category: 'economy',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    line: 'Standalone billing, split out of Banking.',
    verbose: 'Issue, pay and chase invoices without running the full Banking resource.',
    detailUrl: 'products/invoices.html',
  },
  {
    slug: 'vamore_restaurants',
    name: 'Restaurants',
    price: 'tbd',
    status: 'building',
    category: 'economy',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    line: 'Recipes, prep stations, staff roles, supplier stock.',
    verbose: 'Owner terminal for recipes, staffing, stock ordering and station placement; cooking runs as timed prep minigames.',
  },
];

const STATUS_LABEL = { running: 'running', building: 'building' };

/* --- Tebex --------------------------------------------------------------- */
// The public token identifies the store and is safe client-side; the store's
// private key never belongs in frontend code.
const TEBEX_PUBLIC_TOKEN = '148lv-00fe39bf66eebb4de4bd960cef52ad1936dc0167';
const TEBEX_API_BASE = `https://headless.tebex.io/api/accounts/${TEBEX_PUBLIC_TOKEN}`;

async function buyOnTebex(packageId, button) {
  const original = button ? button.textContent : '';
  if (button) {
    button.disabled = true;
    button.textContent = 'opening checkout…';
  }
  try {
    const basketRes = await fetch(`${TEBEX_API_BASE}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete_url: window.location.href, cancel_url: window.location.href }),
    });
    if (!basketRes.ok) throw new Error('basket');
    const basket = (await basketRes.json()).data;

    const addRes = await fetch(`${TEBEX_API_BASE}/baskets/${basket.ident}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package_id: packageId, quantity: 1 }),
    });
    if (!addRes.ok) throw new Error('package');

    Tebex.checkout.init({ ident: basket.ident, theme: 'auto' });
    Tebex.checkout.launch();
    if (button) { button.disabled = false; button.textContent = original; }
  } catch (err) {
    if (button) {
      button.disabled = false;
      button.textContent = 'checkout unavailable — retry';
    }
  }
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-buy-package]');
  if (!btn) return;
  buyOnTebex(btn.dataset.buyPackage, btn);
});

/* --- resource table ------------------------------------------------------ */

const dotSvg = (color) =>
  `<svg class="dot" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="3.25" fill="${color}"/></svg>`;

function resourceRow(r) {
  const running = r.status === 'running';
  const action = r.detailUrl
    ? `<a class="cmd cmd-ghost" href="${r.detailUrl}"><span class="caret">&gt;</span>open</a>`
    : `<span class="cmd is-pending"><span class="caret">&gt;</span>no page yet</span>`;
  return `
  <div class="res-row ${running ? 'is-running' : 'is-building'}" data-status="${r.status}">
    <a class="res-name" href="${r.detailUrl || '#'}"${r.detailUrl ? '' : ' aria-disabled="true" tabindex="-1"'}>
      ${dotSvg(running ? 'var(--ok)' : 'var(--build)')}${r.slug}
    </a>
    <span class="res-status">[ ${STATUS_LABEL[r.status]} ]</span>
    <span class="res-desc">${r.line}</span>
    <span class="res-price">${r.price}</span>
    ${action}
    <span class="res-desc verbose-only" style="grid-column:1/-1">${r.verbose} · ${r.frameworks.join(' / ')}</span>
  </div>`;
}

function renderResources() {
  const wrap = document.getElementById('resource-table');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="res-head">
      <span>resource</span><span>status</span><span>summary</span><span>price</span><span></span>
    </div>
    ${RESOURCES.map(resourceRow).join('')}`;
}

function initFilters() {
  const wrap = document.getElementById('filters');
  if (!wrap) return;
  wrap.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter');
    if (!btn) return;
    wrap.querySelectorAll('.filter').forEach((b) => b.classList.toggle('is-on', b === btn));
    const want = btn.dataset.filter;
    document.querySelectorAll('#resource-table .res-row').forEach((row) => {
      row.classList.toggle('is-filtered-out', want !== 'all' && row.dataset.status !== want);
    });
  });
}

/* --- verbose ------------------------------------------------------------- */

function initVerbose() {
  const button = document.getElementById('verbose-toggle');
  if (!button) return;

  const apply = (on) => {
    document.body.classList.toggle('is-verbose', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  };

  apply(localStorage.getItem('vamore-verbose') === '1');

  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true';
    apply(on);
    localStorage.setItem('vamore-verbose', on ? '1' : '0');
  });
}

/* --- video start frame ---------------------------------------------------- */
// The demo clip opens on an ATM exterior; the panel itself is a few seconds in,
// so every use of it starts (and loops back) at the frame that proves the claim.

function initVideoStart() {
  document.querySelectorAll('video[data-start]').forEach((video) => {
    const start = parseFloat(video.dataset.start);
    if (!Number.isFinite(start)) return;

    const seek = () => {
      if (video.duration && start < video.duration) video.currentTime = start;
    };

    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, { once: true });

    video.addEventListener('timeupdate', () => {
      if (video.currentTime < start - 0.3) seek();
    });
  });
}

/* --- boot log ------------------------------------------------------------ */
// The one authored motion moment on the site: the first viewport prints
// itself the way a resource start does.

function initBootLog() {
  const headline = document.getElementById('boot-headline');
  const sub = document.getElementById('boot-sub');
  const lines = Array.from(document.querySelectorAll('#boot-log .log-line[data-print]'));
  const cursor = document.getElementById('boot-cursor');
  if (!headline) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headlineText = headline.textContent.trim();
  const subText = sub ? sub.textContent.trim() : '';

  if (reduce) {
    lines.forEach((l) => { l.style.visibility = 'visible'; });
    return;
  }

  headline.textContent = '';
  if (sub) sub.textContent = '';
  lines.forEach((l) => { l.style.visibility = 'hidden'; });

  const type = (el, text, speed, done) => {
    let i = 0;
    const step = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) window.setTimeout(step, speed);
      else if (done) window.setTimeout(done, 220);
    };
    step();
  };

  const printLines = () => {
    if (cursor) cursor.remove();
    lines.forEach((line, i) => {
      window.setTimeout(() => { line.style.visibility = 'visible'; }, i * 90);
    });
  };

  const startSub = () => {
    if (!sub) return printLines();
    type(sub, subText, 26, printLines);
  };

  window.setTimeout(() => type(headline, headlineText, 42, startSub), 260);
}

/* --- misc ---------------------------------------------------------------- */

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderResources();
  initFilters();
  initVerbose();
  initBootLog();
  initVideoStart();
  initYear();
});
