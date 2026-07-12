/* Parallax + hero background */
(function () {
  const heros = document.querySelectorAll('.hero__bg[data-parallax]');
  if (!heros.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heros.forEach(el => { el.style.transform = `translateY(${y * 0.25}px) scale(1.05)`; });
  }, { passive: true });
})();
