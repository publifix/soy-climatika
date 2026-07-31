(() => {
  const menuBtn = document.getElementById('menuBtn');
  const navPanel = document.getElementById('navPanel');
  const scrim = document.getElementById('scrim');

  const videoCta = document.getElementById('videoCta');
  const ctaVideo = document.getElementById('ctaVideo');
  const ctaScrim = videoCta.querySelector('.cta-scrim');
  const videoStage = document.getElementById('videoStage');
  const stageClose = document.getElementById('stageClose');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV PANEL (disclosure simple, con scrim) ---------- */
  let navOpen = false;

  function openNav(){
    closeVideoStage();
    navPanel.hidden = false;
    requestAnimationFrame(() => navPanel.classList.add('open'));
    scrim.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    navOpen = true;
    const firstLink = navPanel.querySelector('a');
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', onNavKeydown);
  }

  function closeNav(){
    if (!navOpen) return;
    navPanel.classList.remove('open');
    scrim.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { navPanel.hidden = true; }, 300);
    menuBtn.focus();
    navOpen = false;
    document.removeEventListener('keydown', onNavKeydown);
  }

  function onNavKeydown(e){
    if (e.key === 'Escape') closeNav();
  }

  menuBtn.addEventListener('click', () => {
    if (navOpen) closeNav();
    else openNav();
  });
  scrim.addEventListener('click', closeNav);

  /* ---------- VIDEO STAGE (FLIP: del cuadrante a pantalla completa) ---------- */
  let stageOpen = false;

  function flipTransform(rect){
    const scaleX = rect.width / window.innerWidth;
    const scaleY = rect.height / window.innerHeight;
    const translateX = rect.left + rect.width / 2 - window.innerWidth / 2;
    const translateY = rect.top + rect.height / 2 - window.innerHeight / 2;
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  }

  function openVideoStage(){
    if (stageOpen) return;
    closeNav();

    const rect = videoCta.getBoundingClientRect();
    const cardRadius = getComputedStyle(videoCta).borderRadius;

    videoStage.insertBefore(ctaVideo, stageClose);
    ctaVideo.muted = false;
    ctaVideo.controls = true;
    ctaVideo.play().catch(() => {});

    videoStage.hidden = false;
    if (prefersReducedMotion){
      videoStage.style.transform = 'none';
      videoStage.style.borderRadius = '0px';
    } else {
      videoStage.style.transition = 'none';
      videoStage.style.transform = flipTransform(rect);
      videoStage.style.borderRadius = cardRadius;
      // eslint-disable-next-line no-unused-expressions
      videoStage.offsetWidth; // fuerza reflow
      videoStage.style.transition = '';
      requestAnimationFrame(() => {
        videoStage.style.transform = 'translate(0, 0) scale(1, 1)';
        videoStage.style.borderRadius = '0px';
      });
    }

    videoStage.classList.add('open');
    stageOpen = true;
    stageClose.focus();
    document.addEventListener('keydown', onStageKeydown);
  }

  function closeVideoStage(){
    if (!stageOpen) return;
    const rect = videoCta.getBoundingClientRect();
    const cardRadius = getComputedStyle(videoCta).borderRadius;

    videoStage.classList.remove('open');

    const finish = () => {
      videoStage.hidden = true;
      videoStage.style.transform = '';
      videoStage.style.borderRadius = '';
      videoCta.insertBefore(ctaVideo, ctaScrim);
      ctaVideo.muted = true;
      ctaVideo.controls = false;
      ctaVideo.play().catch(() => {});
    };

    if (prefersReducedMotion){
      finish();
    } else {
      videoStage.style.transform = flipTransform(rect);
      videoStage.style.borderRadius = cardRadius;
      videoStage.addEventListener('transitionend', finish, { once: true });
    }

    stageOpen = false;
    videoCta.focus();
    document.removeEventListener('keydown', onStageKeydown);
  }

  function onStageKeydown(e){
    if (e.key === 'Escape') closeVideoStage();
  }

  videoCta.addEventListener('click', openVideoStage);
  stageClose.addEventListener('click', closeVideoStage);
})();
