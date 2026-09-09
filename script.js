/* VAmore Systems — site behaviour
   The data below is the real lineup. Two scripts are purchasable, two are in
   development; nothing here may claim otherwise. */

const RESOURCES = [
  {
    slug: 'vamore_banking',
    name: 'Banking',
    price: '€40',
    status: 'available',
    line: 'IBAN accounts, savings and credit, live markets, faction payroll, fraud dashboard.',
    tebexPackageId: '7627622',
    detailUrl: 'products/banking.html',
  },
  {
    slug: 'vamore_configpanel',
    name: 'Config Manager',
    price: 'Free',
    status: 'available',
    line: 'One in-game panel with a tab per script. Settings apply live, no config.lua editing.',
    tebexPackageId: '7627638',
    detailUrl: 'products/configpanel.html',
  },
  {
    slug: 'vamore_invoices',
    name: 'Invoices',
    price: '€25',
    status: 'development',
    line: 'Standalone billing, split out of Banking for servers that do not need the full economy.',
    detailUrl: 'products/invoices.html',
  },
  {
    slug: 'vamore_restaurants',
    name: 'Restaurants',
    price: 'Price to be announced',
    status: 'development',
    line: 'Recipes, prep stations, staff roles, supplier stock and an in-game owner terminal.',
  },
];

/* --- Tebex ---------------------------------------------------------------- */
// The public token identifies the store and is safe client-side; the store's
// private key never belongs in frontend code.
const TEBEX_PUBLIC_TOKEN = '148lv-00fe39bf66eebb4de4bd960cef52ad1936dc0167';
const TEBEX_API_BASE = `https://headless.tebex.io/api/accounts/${TEBEX_PUBLIC_TOKEN}`;

async function buyOnTebex(packageId, button) {
  const original = button ? button.textContent : '';
  if (button) {
    button.disabled = true;
    button.textContent = 'Opening checkout…';
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
      button.textContent = 'Checkout unavailable, try again';
    }
  }
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-buy-package]');
  if (!btn) return;
  buyOnTebex(btn.dataset.buyPackage, btn);
});

/* --- catalogue ------------------------------------------------------------ */

const arrowSvg =
  '<svg class="arrow" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
  '<path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="1.5" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

function itemMarkup(r) {
  const available = r.status === 'available';
  const status = available
    ? '<span class="status"><span class="dot"></span>Available now</span>'
    : '<span class="status is-soon"><span class="dot"></span>In development</span>';
  const inner = `
    <div class="item-title">
      <h3>${r.name}</h3>
      ${status}
    </div>
    <p class="item-desc">${r.line}</p>
    <div class="item-side">
      <span class="item-price${available ? '' : ' is-soon'}">${r.price}</span>
      ${r.detailUrl ? arrowSvg : ''}
    </div>`;

  return r.detailUrl
    ? `<a class="item" href="${r.detailUrl}">${inner}</a>`
    : `<div class="item">${inner}</div>`;
}

function renderCatalog() {
  const wrap = document.getElementById('catalog');
  if (!wrap) return;
  wrap.innerHTML = RESOURCES.map(itemMarkup).join('');
}

/* --- hero typewriter ------------------------------------------------------ */
// The one authored motion moment: the wordmark writes itself, the positioning
// line follows, then the card takes up its rotation.

function initTypewriter() {
  const headline = document.getElementById('type-headline');
  const sub = document.getElementById('type-sub');
  const cursor = document.getElementById('type-cursor');
  const model = document.querySelector('.stage model-viewer');
  if (!headline) return;

  const startModel = () => {
    if (cursor) cursor.remove();
    if (model) model.setAttribute('auto-rotate', '');
  };

  // Reduced motion gets the finished headline and a card that holds still.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (cursor) cursor.remove();
    return;
  }

  const headlineText = headline.textContent.trim();
  const subText = sub ? sub.textContent.trim() : '';
  headline.textContent = '';
  if (sub) sub.style.visibility = 'hidden';

  const type = (el, text, speed, done) => {
    let i = 0;
    const step = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) window.setTimeout(step, speed);
      else if (done) window.setTimeout(done, 260);
    };
    step();
  };

  const startSub = () => {
    if (!sub) return startModel();
    sub.style.visibility = 'visible';
    sub.textContent = '';
    type(sub, subText, 22, startModel);
  };

  window.setTimeout(() => type(headline, headlineText, 58, startSub), 220);
}

/* --- 3D models ------------------------------------------------------------ */
// On the home page the hero card starts turning when the typewriter hands over.
// Everywhere else it starts on its own, and under reduced motion it holds still.

function initModels() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('model-viewer').forEach((model) => {
    if (model.closest('.stage')) return;
    model.setAttribute('auto-rotate', '');
  });
}

/* --- media reveal --------------------------------------------------------- */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));

  // Safety net: nothing on this site may stay invisible because an observer
  // never fired (print, headless capture, a browser that throttles it).
  window.setTimeout(() => {
    targets.forEach((el) => el.classList.add('is-in'));
  }, 2500);
}

/* --- video start frame ---------------------------------------------------- */
// The demo clip opens on an ATM exterior; the panel itself is a few seconds in,
// so every use of it starts (and loops back) at the frame that proves the claim.

function initVideoStart() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('video[data-start]').forEach((video) => {
    const start = parseFloat(video.dataset.start);
    if (!Number.isFinite(start)) return;

    const seek = () => {
      if (video.duration && start < video.duration) video.currentTime = start;
    };

    // Reduced motion gets the frame that makes the point, held still.
    if (reduce) {
      video.removeAttribute('autoplay');
      video.removeAttribute('loop');
      video.controls = true;
      const hold = () => { seek(); video.pause(); };
      if (video.readyState >= 1) hold();
      else video.addEventListener('loadedmetadata', hold, { once: true });
      return;
    }

    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, { once: true });

    video.addEventListener('timeupdate', () => {
      if (video.currentTime < start - 0.3) seek();
    });
  });
}

/* --- misc ----------------------------------------------------------------- */

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initTypewriter();
  initModels();
  initReveal();
  initVideoStart();
  initYear();
});
