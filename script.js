// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
//
// tebexPackageId: the package's numeric ID in the Tebex store (Packages list
// in the Tebex Control Panel). Only set for scripts that are actually for
// sale - undefined renders a disabled "Coming Soon" state instead of a Buy
// button, matching the [Work In Progress] labels above.
//
// category: which products-page filter tab the script sits under. Scripts
// are sold individually, not as a suite - this is purely a browsing aid.
const CATEGORIES = [
  { id: 'core', label: 'Core' },
  { id: 'economy', label: 'Economy' },
  { id: 'safety', label: 'Public Safety' },
  { id: 'utility', label: 'Utility' },
  { id: 'admin', label: 'Admin' },
];

const SYSTEMS = [
  { slug: 'va-inventory', name: 'Inventory', price: '€35', fw: ['ESX', 'QBCore', 'Qbox'], category: 'core',
    body: 'Grid-slot inventory with real weight, stashes, shops and trunks. [Work In Progress]' },
  { slug: 'va-phone', name: 'Phone', price: '€45', fw: ['ESX', 'QBCore', 'Qbox'], category: 'core',
    body: 'Multi-app phone sharing accounts and inventory with the rest of the suite. [Work In Progress]' },
  { slug: 'va-housing', name: 'Housing', price: '€40', fw: ['ESX', 'QBCore', 'Qbox'], category: 'core',
    body: 'Buy, rent, furnish, hand over keys, persistent interiors. [Work In Progress]' },
  { slug: 'va-banking', name: 'Banking', price: '€30', fw: ['ESX', 'QBCore', 'Qbox'], category: 'economy',
    body: 'Accounts, transfers, business ledgers and ATMs. [Work In Progress]',
    tebexPackageId: '7627622' },
  { slug: 'va-dispatch', name: 'Dispatch', price: '€32', fw: ['ESX', 'QBCore', 'Qbox'], category: 'safety',
    body: 'MDT, unit status and a live map for police and EMS. [Work In Progress]' },
  { slug: 'va-jobs', name: 'Jobs', price: '€28', fw: ['ESX', 'QBCore', 'Qbox'], category: 'economy',
    body: 'Shifts, payroll and per-grade permissions shared across the suite. [Work In Progress]' },
  { slug: 'va-garage', name: 'Garage', price: '€25', fw: ['ESX', 'QBCore', 'Qbox'], category: 'utility',
    body: 'Persistent vehicle storage with insurance and impound. [Work In Progress]' },
  { slug: 'va-admin', name: 'Admin', price: '€22', fw: ['ESX', 'QBCore', 'Qbox', 'Standalone'], category: 'admin',
    body: 'One menu across the whole suite: inventory, properties, accounts, tickets. [Work In Progress]' },
  { slug: 'va-crafting', name: 'Crafting', price: '€18', fw: ['ESX', 'QBCore', 'Qbox', 'Standalone'], category: 'economy',
    body: 'Blueprint crafting with skill levels, benches and durability. [Work In Progress]' },
  { slug: 'va-fuel', name: 'Fuel', price: '€12', fw: ['ESX', 'QBCore', 'Qbox', 'Standalone'], category: 'utility',
    body: 'Stations, jerrycans, electric charging and per-vehicle consumption. [Work In Progress]' }
];

const FLAGSHIP_SLUGS = ['va-banking', 'va-phone', 'va-housing', 'va-dispatch'];

// Tebex Headless API: our storefront is this page, Tebex only handles the
// actual checkout/payment. The public token identifies the store and is
// safe to ship client-side (unlike the store's private key, which never
// belongs in frontend code). See https://creator.tebex.io/developers/api-keys.
const TEBEX_PUBLIC_TOKEN = '148lv-00fe39bf66eebb4de4bd960cef52ad1936dc0167';
const TEBEX_API_BASE = `https://headless.tebex.io/api/accounts/${TEBEX_PUBLIC_TOKEN}`;

async function buyOnTebex(packageId) {
  const basketRes = await fetch(`${TEBEX_API_BASE}/baskets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      complete_url: window.location.href,
      cancel_url: window.location.href,
    }),
  });
  if (!basketRes.ok) return;
  const basket = (await basketRes.json()).data;

  const addRes = await fetch(`${TEBEX_API_BASE}/baskets/${basket.ident}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package_id: packageId, quantity: 1 }),
  });
  if (!addRes.ok) return;

  Tebex.checkout.init({ ident: basket.ident, theme: 'auto' });
  Tebex.checkout.launch();
}

function buyButtonHtml(system) {
  if (!system.tebexPackageId) {
    return '<span class="btn btn-secondary btn-disabled">Coming Soon</span>';
  }
  return `<button type="button" class="btn btn-secondary" data-buy-package="${system.tebexPackageId}">Buy on Tebex</button>`;
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-buy-package]');
  if (!btn) return;
  buyOnTebex(btn.dataset.buyPackage);
});

// NOTE: "product shot placeholder" labels below stand in for real PNG screenshots — replace before launch.
function renderFlagshipPanels() {
  const wrap = document.getElementById('flagship-list');
  if (!wrap) return;
  wrap.innerHTML = FLAGSHIP_SLUGS.map((slug, i) => {
    const s = SYSTEMS.find((sys) => sys.slug === slug);
    if (!s) return '';
    const reversed = i % 2 === 1;
    const image = s.slug === 'va-banking'
      ? `<model-viewer src="assets/glb/creditcard.glb" alt="${s.name} 3D model" orientation="90deg 30deg 0deg" auto-rotate rotation-per-second="8deg" auto-rotate-delay="0" camera-controls disable-zoom interaction-prompt="none" shadow-intensity="1"></model-viewer>`
      : `<span>${s.slug} · product shot [Work In Progress]</span>`;
    return `
    <div class="flagship-panel${reversed ? ' flagship-panel-reverse' : ''} reveal">
      <div class="flagship-image">${image}</div>
      <div class="flagship-copy">
        <h3>${s.name}</h3>
        <p>${s.body}</p>
        <div class="flagship-meta">
          <span class="flagship-price">${s.price}</span>
          ${buyButtonHtml(s)}
        </div>
      </div>
    </div>`;
  }).join('');
}

// The [Work In Progress] tag stays in the raw body text (used on the
// homepage flagship panels too) - the product grid has its own status
// badge instead, so it's stripped here only to avoid saying it twice.
function stripWipTag(text) {
  return text.replace(/\s*\[Work In Progress\]$/, '');
}

function productCardHtml(s) {
  const available = !!s.tebexPackageId;
  return `
    <div class="product-card reveal" data-category="${s.category}">
      <div class="product-card-media">
        <span>${s.slug} · product shot [Work In Progress]</span>
        <span class="product-card-status ${available ? 'is-available' : 'is-soon'}">${available ? 'Available Now' : 'Coming Soon'}</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-head">
          <h3>${s.name}</h3>
          <span class="product-card-price">${s.price}</span>
        </div>
        <p>${stripWipTag(s.body)}</p>
        <div class="product-card-fw">
          ${s.fw.map((f) => `<span class="pill">${f}</span>`).join('')}
        </div>
      </div>
      <div class="product-card-foot">
        ${buyButtonHtml(s)}
      </div>
    </div>`;
}

function renderCategoryTabs() {
  const wrap = document.getElementById('category-tabs');
  if (!wrap) return;
  wrap.innerHTML = [
    '<button type="button" class="category-tab is-active" data-category="all">All</button>',
    ...CATEGORIES.map((c) => `<button type="button" class="category-tab" data-category="${c.id}">${c.label}</button>`),
  ].join('');

  wrap.addEventListener('click', (event) => {
    const btn = event.target.closest('.category-tab');
    if (!btn) return;
    wrap.querySelectorAll('.category-tab').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const category = btn.dataset.category;
    document.querySelectorAll('#product-grid .product-card').forEach((card) => {
      card.classList.toggle('is-filtered-out', category !== 'all' && card.dataset.category !== category);
    });
  });
}

function renderProductGrid() {
  const wrap = document.getElementById('product-grid');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map(productCardHtml).join('');
}

// NOTE: "2400×1240" in the label below is a placeholder resolution, not a real recording — see the <!-- TODO --> above the demo section in index.html.
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

function initHeroTypewriter() {
  const h1El = document.getElementById('hero-type-text');
  const subEl = document.getElementById('hero-type-subtext');
  const cursor1 = document.getElementById('hero-cursor-1');
  const cursor2 = document.getElementById('hero-cursor-2');
  if (!h1El) return;
  const fullH1 = h1El.textContent;
  const fullSub = subEl ? subEl.textContent : '';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (cursor1) cursor1.style.display = 'none';
    return;
  }
  h1El.textContent = '';
  if (subEl) subEl.textContent = '';
  if (cursor2) cursor2.style.display = 'none';

  const typeSub = () => {
    let j = 0;
    const step = () => {
      j += 1;
      subEl.textContent = fullSub.slice(0, j);
      if (j < fullSub.length) window.setTimeout(step, 38);
    };
    step();
  };

  const startSub = () => {
    if (cursor1) cursor1.style.display = 'none';
    if (cursor2) cursor2.style.display = '';
    if (subEl) typeSub();
  };

  let i = 0;
  const typeH1 = () => {
    i += 1;
    h1El.textContent = fullH1.slice(0, i);
    if (i < fullH1.length) { window.setTimeout(typeH1, 38); return; }
    window.setTimeout(startSub, 250);
  };
  window.setTimeout(typeH1, 300);
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
  initHeroTypewriter();
  initNavScroll();
  renderProductGrid();
  renderCategoryTabs();
  renderFlagshipPanels();
  initDemoChapters();
  initScrollReveal();
});
