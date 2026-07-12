/* Portfolio filters + lightbox */
(function () {
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* Filters */
  const filters = $$('.filter');
  const items = $$('.masonry__item');
  if (filters.length) {
    filters.forEach(f => f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.filter;
      items.forEach(it => {
        const show = cat === 'all' || it.dataset.cat === cat;
        it.style.display = show ? '' : 'none';
      });
    }));
  }

  /* Lightbox */
  if (!items.length) return;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Close">✕</button>
    <button class="lightbox__nav prev" aria-label="Previous">‹</button>
    <img alt="Project view" />
    <button class="lightbox__nav next" aria-label="Next">›</button>`;
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const close = box.querySelector('.lightbox__close');
  const prev = box.querySelector('.prev');
  const next = box.querySelector('.next');
  let i = 0;
  const visible = () => items.filter(it => it.style.display !== 'none');
  const open = (idx) => {
    const vs = visible(); if (!vs.length) return;
    i = (idx + vs.length) % vs.length;
    img.src = vs[i].dataset.full || vs[i].querySelector('img').src;
    box.classList.add('open');
  };
  items.forEach((it, k) => it.addEventListener('click', () => open(visible().indexOf(it))));
  close.addEventListener('click', () => box.classList.remove('open'));
  box.addEventListener('click', (e) => { if (e.target === box) box.classList.remove('open'); });
  prev.addEventListener('click', () => open(i - 1));
  next.addEventListener('click', () => open(i + 1));
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') box.classList.remove('open');
    if (e.key === 'ArrowLeft') open(i - 1);
    if (e.key === 'ArrowRight') open(i + 1);
  });
})();
