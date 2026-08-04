(() => {
  const root = document.querySelector('.card-aquavita');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.project-slide'));
  const dots = Array.from(root.querySelectorAll('.project-dots .dot'));
  if (!slides.length || !dots.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = 6000;
  let activeIndex = 0;
  let timer = null;

  function setActive(index) {
    activeIndex = index;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === index ? 'true' : 'false'));
  }

  function next() {
    setActive((activeIndex + 1) % slides.length);
  }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = setInterval(next, INTERVAL);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      setActive(i);
      startAutoplay();
    });
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) startAutoplay();
  });

  setActive(0);
  startAutoplay();
})();
