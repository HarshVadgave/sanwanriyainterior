/* =========================================================
   Sanwariya Interior · Core Interaction Layer
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pl = $('.preloader');
    if (pl) setTimeout(() => pl.classList.add('done'), 700);
  });

  /* ---------- Header scroll state ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const toTop = $('.float-btn.top');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = Math.min(100, (y / h) * 100) + '%';
    }
    if (toTop) toTop.classList.toggle('show', y > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = $('.nav__toggle');
  const navLinks = $('.nav__links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });
    $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }));
  }

  /* ---------- Active nav highlight ---------- */
  const path = location.pathname.split('/').pop() || 'home.html';
  $$('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href === path) a.classList.add('active');
  });

  /* ---------- Theme toggle ---------- */
  const themeBtn = $('.theme-toggle');
  const setTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('sw-theme', t); } catch(e){}
    if (themeBtn) themeBtn.innerHTML = t === 'dark' ? '☀' : '☾';
  };
  try {
    const saved = localStorage.getItem('sw-theme');
    if (saved) setTheme(saved);
    else if (themeBtn) themeBtn.innerHTML = '☾';
  } catch(e){}
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(cur);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const dur = 1600;
      const start = performance.now();
      const suffix = el.dataset.suffix || '';
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.floor(target * eased);
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => counterIO.observe(el));

  /* ---------- Testimonial slider ---------- */
  const slider = $('.slider');
  if (slider) {
    const track = $('.slider__track', slider);
    const slides = $$('.slider__slide', slider);
    const dotsWrap = $('.slider__nav', slider);
    let idx = 0;
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'slider__dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = $$('.slider__dot', slider);
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    };
    setInterval(() => go(idx + 1), 6000);
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq__item').forEach(item => {
    const q = $('.faq__q', item);
    const a = $('.faq__a', item);
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Ripple ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--rx', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--ry', (e.clientY - r.top) + 'px');
    btn.classList.remove('ripple');
    void btn.offsetWidth;
    btn.classList.add('ripple');
  });

  /* ---------- Custom cursor ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor';
    ring.className = 'cursor ring';
    document.body.append(dot, ring);
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .card, .masonry__item, .service-card')) ring.classList.add('grow');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .card, .masonry__item, .service-card')) ring.classList.remove('grow');
    });
  }

  /* ---------- Newsletter (footer) ---------- */
  const news = $('.footer__news');
  if (news) news.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you for subscribing — welcome to Sanwariya.', 'success');
    news.reset();
  });

  /* ---------- Before/After slider ---------- */
  const ba = $('.ba');
  if (ba) {
    const handle = $('.ba__handle', ba);
    const after = $('.after', ba);
    let dragging = false;
    const move = (x) => {
      const r = ba.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
      handle.style.left = pct + '%';
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    };
    const down = (e) => { dragging = true; e.preventDefault(); };
    const up = () => dragging = false;
    ba.addEventListener('mousedown', down);
    ba.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    window.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (dragging && e.touches[0]) move(e.touches[0].clientX); }, { passive: true });
  }

  /* ---------- Cost calculator ---------- */
  const calc = $('#calc');
  if (calc) {
    const rates = { basic: 1200, premium: 1900, luxury: 2800 };
    const compute = () => {
      const area = Math.max(0, +calc.querySelector('#calc-area').value || 0);
      const tier = calc.querySelector('#calc-tier').value;
      const total = area * (rates[tier] || 0);
      calc.querySelector('#calc-out').textContent = '₹ ' + total.toLocaleString('en-IN');
    };
    calc.addEventListener('input', compute);
    compute();
  }

  /* ---------- Toast helper (exposed) ---------- */
  function showToast(msg, kind = 'success') {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.className = 'toast ' + kind;
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => t.classList.remove('show'), 3600);
  }
  window.SW = window.SW || {};
  window.SW.toast = showToast;

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

  /* ---------- Smooth in-page anchors ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

})();
