// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
const SYSTEMS = [
  { slug: 'va-inventory', name: 'Inventory', price: '€35', fw: ['ESX', 'QBCore', 'Qbox'],
    body: 'Grid-slot inventory with real weight, stashes, shops and trunks. (placeholder)' },
  { slug: 'va-phone', name: 'Phone', price: '€45', fw: ['ESX', 'QBCore', 'Qbox'],
    body: 'Multi-app phone sharing accounts and inventory with the rest of the suite. (placeholder)' },
  { slug: 'va-housing', name: 'Housing', price: '€40', fw: ['QBCore', 'Qbox'],
    body: 'Buy, rent, furnish, hand over keys, persistent interiors. (placeholder)' },
  { slug: 'va-banking', name: 'Banking', price: '€30', fw: ['ESX', 'QBCore'],
    body: 'Accounts, transfers, business ledgers and ATMs. (placeholder)' },
  { slug: 'va-dispatch', name: 'Dispatch', price: '€32', fw: ['ESX', 'QBCore'],
    body: 'MDT, unit status and a live map for police and EMS. (placeholder)' },
  { slug: 'va-jobs', name: 'Jobs', price: '€28', fw: ['ESX', 'QBCore'],
    body: 'Shifts, payroll and per-grade permissions shared across the suite. (placeholder)' },
  { slug: 'va-garage', name: 'Garage', price: '€25', fw: ['ESX', 'QBCore'],
    body: 'Persistent vehicle storage with insurance and impound. (placeholder)' },
  { slug: 'va-admin', name: 'Admin', price: '€22', fw: ['ESX', 'QBCore', 'Standalone'],
    body: 'One menu across the whole suite: inventory, properties, accounts, tickets. (placeholder)' },
  { slug: 'va-crafting', name: 'Crafting', price: '€18', fw: ['ESX', 'QBCore', 'Standalone'],
    body: 'Blueprint crafting with skill levels, benches and durability. (placeholder)' },
  { slug: 'va-fuel', name: 'Fuel', price: '€12', fw: ['Standalone'],
    body: 'Stations, jerrycans, electric charging and per-vehicle consumption. (placeholder)' }
];

const FLAGSHIP_SLUGS = ['va-inventory', 'va-phone', 'va-housing', 'va-dispatch'];

// NOTE: "product shot placeholder" labels below stand in for real PNG screenshots — replace before launch.
function renderFlagshipPanels() {
  const wrap = document.getElementById('flagship-list');
  if (!wrap) return;
  wrap.innerHTML = FLAGSHIP_SLUGS.map((slug, i) => {
    const s = SYSTEMS.find((sys) => sys.slug === slug);
    if (!s) return '';
    const reversed = i % 2 === 1;
    const image = s.slug === 'va-inventory'
      ? `<model-viewer src="assets/glb/creditcard.glb" alt="${s.name} 3D model" orientation="90deg 30deg 0deg" auto-rotate rotation-per-second="8deg" auto-rotate-delay="0" camera-controls disable-zoom interaction-prompt="none" shadow-intensity="1"></model-viewer>`
      : `<span>${s.slug} · product shot placeholder</span>`;
    return `
    <div class="flagship-panel${reversed ? ' flagship-panel-reverse' : ''} reveal">
      <div class="flagship-image">${image}</div>
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
      <a href="#" class="btn btn-secondary" data-placeholder="true">Buy on Tebex</a>
    </div>`).join('');
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
  renderFlagshipPanels();
  initDemoChapters();
  initScrollReveal();
});
