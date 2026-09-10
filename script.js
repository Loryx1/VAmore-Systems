/* VAmore Systems — site behaviour
   The lineup below is the real one. Two scripts are purchasable, two are in
   development; nothing on this site may claim otherwise. */

const RESOURCES = [
  {
    name: 'Banking',
    price: '€40',
    status: 'available',
    line: 'IBAN accounts, savings and credit, live markets, faction payroll, fraud dashboard.',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    cover: { type: 'model', src: 'assets/glb/creditcard.glb', alt: 'A rotating VAmore bank card' },
    detailUrl: 'products/banking.html',
  },
  {
    name: 'Config Manager',
    price: 'Free',
    status: 'available',
    line: 'One in-game panel with a tab per script. Settings apply live, no config.lua editing.',
    frameworks: ['ESX', 'QBCore', 'Qbox', 'Standalone'],
    cover: { type: 'blank' },
    detailUrl: 'products/configpanel.html',
  },
  {
    name: 'Invoices',
    price: '€25',
    status: 'development',
    line: 'Standalone billing, split out of Banking for servers that do not need the full economy.',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    cover: { type: 'blank' },
    detailUrl: 'products/invoices.html',
  },
  {
    name: 'Restaurants',
    price: 'To be announced',
    status: 'development',
    line: 'Recipes, prep stations, staff roles, supplier stock and an in-game owner terminal.',
    frameworks: ['ESX', 'QBCore', 'Qbox'],
    cover: { type: 'blank' },
  },
];

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* --- product cards -------------------------------------------------------- */

const markSvg = (id) =>
  `<svg width="72" height="72" viewBox="0 0 128 128" fill="none" aria-hidden="true">
     <defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="14" y1="104" x2="110" y2="20">
       <stop offset="0%" stop-color="#1450c8"></stop><stop offset="100%" stop-color="#25c9b0"></stop>
     </linearGradient></defs>
     <path d="M14 24 L27 54" stroke="url(#${id})" stroke-width="15"></path>
     <path d="M30.5 62 L46 98 L78 24 L110 98" stroke="url(#${id})" stroke-width="15" stroke-linejoin="miter"></path>
     <path d="M50 74 H107" stroke="url(#${id})" stroke-width="15"></path>
   </svg>`;

function coverMarkup(r, base, index) {
  if (r.cover && r.cover.type === 'model') {
    return `<model-viewer src="${base}${r.cover.src}" alt="${r.cover.alt}"
              orientation="90deg 30deg 0deg" rotation-per-second="16deg" auto-rotate-delay="0"
              disable-zoom interaction-prompt="none" shadow-intensity="1"
              field-of-view="24deg" exposure="1.05"></model-viewer>`;
  }
  if (r.cover && r.cover.type === 'image') {
    return `<img src="${base}${r.cover.src}" alt="${r.cover.alt}" loading="lazy">`;
  }
  return `${markSvg(`cardMark${index}`)}<span class="cover-note">Preview coming soon</span>`;
}

// Ratings are drawn from real reviews only. Nothing has been reviewed yet, so
// every product shows an empty five-star row and a count of zero. The day
// reviews exist, `reviews` carries the average and the total.
function starsMarkup(reviews) {
  const total = reviews ? reviews.count : 0;
  const score = reviews ? reviews.average : 0;
  const star = (i) => {
    const filled = score >= i;
    return `<svg width="13" height="13" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" aria-hidden="true">
      <path d="m12 3.6 2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85L12 3.6Z"
            stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  };
  const label = total === 1 ? '1 review' : `${total} reviews`;
  return `<span class="stars" role="img" aria-label="${label}">
    ${[1, 2, 3, 4, 5].map(star).join('')}<span class="count">(${total})</span>
  </span>`;
}

const arrowSvg =
  '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
  '<path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="1.6" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

function cardMarkup(r, base, index) {
  const available = r.status === 'available';
  const status = available
    ? '<span class="status"><span class="dot"></span>Available now</span>'
    : '<span class="status is-soon"><span class="dot"></span>In development</span>';
  const chips = (r.frameworks || []).map((f) => `<span class="chip">${f}</span>`).join('');
  const action = r.detailUrl
    ? `<a class="btn btn-primary" href="${base}${r.detailUrl}">View details${arrowSvg}</a>`
    : '<span class="btn is-disabled">Details soon</span>';

  return `
    <article class="card">
      <div class="card-cover">${coverMarkup(r, base, index)}</div>
      <div class="card-body">
        <div class="card-title">
          <h3>${r.name}</h3>
          ${starsMarkup(r.reviews)}
        </div>
        ${status}
        <p>${r.line}</p>
        <div class="chips">${chips}</div>
        <div class="card-foot">
          <span class="card-price${available ? '' : ' is-soon'}">${r.price}</span>
          ${action}
        </div>
      </div>
    </article>`;
}

function renderCards() {
  const wrap = document.getElementById('product-cards');
  if (!wrap) return;
  const base = wrap.dataset.base || '';
  wrap.innerHTML = RESOURCES.map((r, i) => cardMarkup(r, base, i)).join('');
}

/* --- hero aurora ---------------------------------------------------------- */
// A small WebGL field in the brand axis: warped noise bands, no library. The
// CSS behind it already paints a usable ground, so any failure is invisible.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 res;
uniform float t;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / res;
  vec2 q = vec2(uv.x * 1.7, uv.y);

  // Domain warp: the curtains drift and fold instead of sliding as one sheet.
  float warp = fbm(q * 1.7 + vec2(t * 0.030, t * 0.014));
  float curtain = fbm(q * vec2(2.9, 1.25) + vec2(warp * 1.6, -t * 0.045));
  float veil = fbm(q * vec2(1.3, 0.8) + vec2(-t * 0.02, t * 0.01));

  vec3 blue = vec3(0.078, 0.314, 0.784);
  vec3 cyan = vec3(0.090, 0.635, 0.788);
  vec3 teal = vec3(0.145, 0.788, 0.690);

  vec3 col = mix(blue, cyan, smoothstep(0.24, 0.70, curtain));
  col = mix(col, teal, smoothstep(0.52, 0.96, curtain + warp * 0.30));

  // The light hangs over most of the frame and thins out at both ends, so it
  // reads as weather rather than as a bar drawn across the page.
  float height = smoothstep(0.02, 0.44, uv.y) * smoothstep(1.10, 0.52, uv.y);
  float shape = smoothstep(0.30, 1.05, curtain) * (0.45 + 0.75 * veil);
  float edge = smoothstep(0.0, 0.46, uv.x) * smoothstep(1.0, 0.54, uv.x);

  float alpha = shape * height * edge * 0.62;
  gl_FragColor = vec4(col * alpha, alpha);
}`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function initAurora() {
  const host = document.querySelector('.aurora');
  if (!host || reduceMotion()) return;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'res');
  const uTime = gl.getUniformLocation(program, 't');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  host.appendChild(canvas);

  const resize = () => {
    // Half resolution is invisible on a soft field and keeps the cost near zero.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    canvas.width = Math.max(1, Math.round(host.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(host.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let running = true;
  let frame = 0;
  const start = performance.now();

  const draw = () => {
    if (!running) return;
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (frame === 0) canvas.classList.add('is-live');
    frame += 1;
    requestAnimationFrame(draw);
  };
  draw();

  // Stop the loop when the hero is off screen or the tab is hidden.
  const hero = host.closest('.hero') || host;
  const visible = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && !document.hidden;
    if (running) draw();
  }, { threshold: 0 });
  visible.observe(hero);

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden && hero.getBoundingClientRect().bottom > 0;
    if (running) draw();
  });

  gl.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; });
}

/* --- hero typewriter ------------------------------------------------------ */
// The one authored moment: the wordmark writes itself, the line follows, then
// the card takes up its rotation.

function initTypewriter() {
  const headline = document.getElementById('type-headline');
  const sub = document.getElementById('type-sub');
  const cursor = document.getElementById('type-cursor');
  const model = document.querySelector('.stage model-viewer');
  if (!headline) return;

  const handOver = () => {
    if (cursor) cursor.remove();
    if (model) model.setAttribute('auto-rotate', '');
  };

  // Reduced motion gets the finished headline and a card that holds still.
  if (reduceMotion()) {
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
      else if (done) window.setTimeout(done, 240);
    };
    step();
  };

  const startSub = () => {
    if (!sub) return handOver();
    sub.style.visibility = 'visible';
    sub.textContent = '';
    type(sub, subText, 20, handOver);
  };

  window.setTimeout(() => type(headline, headlineText, 56, startSub), 200);
}

/* --- 3D models ------------------------------------------------------------ */

function initModels() {
  if (reduceMotion()) return;
  document.querySelectorAll('model-viewer').forEach((model) => {
    if (model.closest('.stage')) return; // the hero card waits for the typewriter
    model.setAttribute('auto-rotate', '');
  });
}

/* --- reveal --------------------------------------------------------------- */

function initReveal() {
  const targets = document.querySelectorAll('.reveal, .feature');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || reduceMotion()) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  targets.forEach((el) => observer.observe(el));

  // Safety net: nothing may stay invisible because an observer never fired.
  window.setTimeout(() => targets.forEach((el) => el.classList.add('is-in')), 3000);
}

/* --- drawn glyphs --------------------------------------------------------- */
// Each feature icon draws itself once, in stroke order, when its block arrives.

function initGlyphs() {
  document.querySelectorAll('.feature .glyph').forEach((glyph) => {
    glyph.querySelectorAll('[data-draw]').forEach((path, i) => {
      const len = Math.ceil(path.getTotalLength ? path.getTotalLength() : 120);
      path.style.setProperty('--len', len);
      path.style.setProperty('--delay', `${i * 110}ms`);
    });
  });
}

/* --- video player --------------------------------------------------------- */
// The clip is heavy, so nothing loads until the poster is on screen and the
// visitor (or the viewport) asks for it.

function initPlayers() {
  document.querySelectorAll('.player').forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('.play');
    if (!video) return;

    const play = () => {
      player.classList.add('is-playing');
      video.play().catch(() => { player.classList.remove('is-playing'); });
    };

    if (button) {
      button.addEventListener('click', () => {
        if (player.classList.contains('is-playing')) {
          video.pause();
          player.classList.remove('is-playing');
        } else {
          play();
        }
      });
    }

    if (reduceMotion()) {
      video.controls = true;
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(player);
    }
  });
}

/* --- entrance ------------------------------------------------------------- */
// The first screen rises into place on load, one element after the next. It
// also buys the models and images a moment to decode before they are seen.

const RISE_MS = 1200; // keep in step with .rise.is-up in style.css

const ENTRANCE_SELECTORS = [
  '.hero h1',
  '.hero .hero-sub',
  '.hero .btn-row',
  '.stage',
  '.scroll-cue',
  '.trust .tag',
  'main > section:first-of-type .head',
  '.detail-top .back',
  '.detail-top .gallery',
  '.detail-top .buy-card',
  '#product-cards .card',
];

function initEntrance() {
  // The page head already hid these before the first paint; releasing that flag
  // is this function's job, whatever else happens below.
  const release = () => document.documentElement.classList.remove('js-entrance');

  if (reduceMotion()) {
    release();
    return;
  }

  const seen = new Set();
  const targets = [];

  ENTRANCE_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el) || el.closest('.reveal')) return;
      seen.add(el);
      targets.push(el);
    });
  });

  if (!targets.length) {
    release();
    return;
  }

  // Document order, so the stagger follows the eye rather than the selector list.
  targets.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  let last = 0;
  targets.forEach((el, i) => {
    last = Math.min(160 + i * 110, 1000);
    el.classList.add('rise');
    el.style.setProperty("--rise-delay", `${last}ms`);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => targets.forEach((el) => el.classList.add('is-up')));
  });

  // Nothing may stay invisible if a frame never arrives.
  window.setTimeout(() => targets.forEach((el) => el.classList.add('is-up')), 2200);

  // Once everyone has arrived, drop the class so nothing holds a compositor
  // layer for the rest of the visit.
  window.setTimeout(() => {
    release();
    targets.forEach((el) => {
      el.classList.remove('rise');
      el.classList.remove('is-up');
      el.style.removeProperty("--rise-delay");
    });
  }, 2200 + last + RISE_MS);
}

/* --- product gallery ------------------------------------------------------ */
// Arrows, thumbnails and keyboard control over whatever media a product has.
// A product with a single item shows the frame without the chrome.

function initGallery() {
  document.querySelectorAll('.gallery').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('.slide'));
    const thumbs = Array.from(gallery.querySelectorAll('.thumb'));
    const prev = gallery.querySelector('.gal-nav.prev');
    const next = gallery.querySelector('.gal-nav.next');
    if (slides.length < 2) {
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      return;
    }

    let index = slides.findIndex((s) => s.hasAttribute('data-active'));
    if (index < 0) index = 0;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => {
        slide.toggleAttribute('data-active', n === index);
        const video = slide.querySelector('video');
        if (video && n !== index) video.pause();
      });
      thumbs.forEach((thumb, n) => thumb.setAttribute('aria-current', String(n === index)));
    };

    show(index);
    if (prev) prev.addEventListener('click', () => show(index - 1));
    if (next) next.addEventListener('click', () => show(index + 1));
    thumbs.forEach((thumb, n) => thumb.addEventListener('click', () => show(n)));

    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { show(index - 1); event.preventDefault(); }
      if (event.key === 'ArrowRight') { show(index + 1); event.preventDefault(); }
    });
  });
}

/* --- object parallax ------------------------------------------------------ */
// The showcase objects drift a little slower than the page, so scrolling has
// depth instead of sliding as one flat sheet.

function initParallax() {
  const objects = Array.from(document.querySelectorAll('.is-object'));
  if (!objects.length || reduceMotion()) return;

  let visible = [];
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!visible.includes(entry.target)) visible.push(entry.target);
      } else {
        visible = visible.filter((el) => el !== entry.target);
        entry.target.style.removeProperty('--shift');
      }
    });
  }, { rootMargin: '20% 0px' });

  objects.forEach((el) => watcher.observe(el));

  let ticking = false;
  const update = () => {
    const middle = window.innerHeight / 2;
    visible.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - middle) / middle;
      el.style.setProperty('--shift', `${(offset * -22).toFixed(1)}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* --- scroll progress ------------------------------------------------------ */

function initProgress() {
  const bar = document.querySelector('.nav-progress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* --- misc ----------------------------------------------------------------- */

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  initEntrance();
  initAurora();
  initTypewriter();
  initModels();
  initGlyphs();
  initGallery();
  initReveal();
  initPlayers();
  initParallax();
  initProgress();
  initYear();
});
