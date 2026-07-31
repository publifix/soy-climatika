(() => {
  const videoCta = document.getElementById('videoCta');
  const ctaVideo = document.getElementById('ctaVideo');
  const videoStage = document.getElementById('videoStage');
  const stageClose = document.getElementById('stageClose');
  if (!videoCta || !ctaVideo || !videoStage || !stageClose) return;

  const ctaScrim = videoCta.querySelector('.cta-scrim');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PREVIEW: solo los primeros 10s en loop dentro de la card ---------- */
  const PREVIEW_LOOP_SECONDS = 10;
  let previewMode = true;

  ctaVideo.addEventListener('timeupdate', () => {
    if (previewMode && ctaVideo.currentTime >= PREVIEW_LOOP_SECONDS){
      ctaVideo.currentTime = 0;
    }
  });

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
    window.SoyClimatikaNav?.closeNav();

    const rect = videoCta.getBoundingClientRect();
    const cardRadius = getComputedStyle(videoCta).borderRadius;

    previewMode = false;
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
      previewMode = true;
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

  window.SoyClimatikaVideoStage = { close: closeVideoStage };
})();
