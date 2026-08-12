// TODO: slugs, names, prices and bodies below are placeholder content for a
// still-fictional lineup — replace every entry with the real suite before launch.
// NOTE: every "ui shot · WxH" label rendered from this data (flagship panels,
// suite panel) is a placeholder mockup dimension, not a real screenshot.
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

const FLAGSHIP_SLUGS = ['va-inventory', 'va-phone', 'va-housing', 'va-dispatch'];
const FLAGSHIP_SYSTEMS = FLAGSHIP_SLUGS.map((slug) => SYSTEMS.find((sys) => sys.slug === slug)).filter(Boolean);

function systemDetailMarkup(s) {
  return `
    <div class="suite-facts">
      ${s.facts.map((f) => `<div class="suite-fact"><span class="suite-fact-key">${f.k}</span><span class="suite-fact-val">${f.v}</span></div>`).join('')}
    </div>
    <div class="suite-fw">
      ${s.fw.map((f) => `<span class="pill">${f}</span>`).join('')}
    </div>
    <a href="#" class="btn btn-primary" data-placeholder="true">Buy ${s.name} on Tebex</a>`;
}

function renderFlagshipPanels() {
  const wrap = document.getElementById('flagship-list');
  if (!wrap) return;
  wrap.innerHTML = FLAGSHIP_SYSTEMS.map((s, i) => {
    const reversed = i % 2 === 1;
    const glow = i % 2 === 0 ? 'flagship-glow-blue' : 'flagship-glow-teal';
    return `
    <div class="flagship-panel${reversed ? ' flagship-panel-reverse' : ''} reveal">
      <div class="flagship-image"><span>${s.slug} · ui shot · 1600×900</span></div>
      <div class="flagship-copy ${glow}">
        <div class="flagship-copy-head"><h3>${s.name}</h3><span>${s.price}</span></div>
        <p>${s.body}</p>
        ${systemDetailMarkup(s)}
      </div>
    </div>`;
  }).join('');
}

function renderHeroPills() {
  const wrap = document.getElementById('hero-pills');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map((s) => `<span class="pill">${s.slug}</span>`).join('');
}

function renderSuitePanel(list, index) {
  const panel = document.getElementById('suite-panel');
  if (!panel) return;
  const s = list[index];
  panel.innerHTML = `
    <div class="suite-panel-image"><span>${s.slug} · ui shot · 1600×900</span></div>
    <div class="suite-panel-body">
      <div class="suite-panel-title"><h3>${s.name}</h3><span>${s.price}</span></div>
      <p>${s.body}</p>
      ${systemDetailMarkup(s)}
    </div>`;
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

function initSuite() {
  const list = document.getElementById('suite-list');
  if (!list) return;
  const rest = SYSTEMS.filter((s) => !FLAGSHIP_SYSTEMS.includes(s));
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

function renderPricingPills() {
  const wrap = document.getElementById('pricing-pills');
  if (!wrap) return;
  wrap.innerHTML = SYSTEMS.map((s) => `<span class="pill">${s.slug}</span>`).join('');
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
  renderHeroPills();
  renderFlagshipPanels();
  initDemoChapters();
  initSuite();
  renderPricingPills();
  initScrollReveal();
});
