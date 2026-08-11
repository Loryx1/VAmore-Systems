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

document.addEventListener('DOMContentLoaded', () => {
  initDemoChapters();
  // Later tasks add initNavScroll(), initSuitePicker(),
  // initScrollReveal() here.
});
