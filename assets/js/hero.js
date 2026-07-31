(() => {
  const menuBtn = document.getElementById('menuBtn');
  const navPanel = document.getElementById('navPanel');
  const videoCta = document.getElementById('videoCta');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const scrim = document.getElementById('scrim');

  let activePanel = null;
  let lastTrigger = null;

  function openPanel(panel, trigger){
    closePanel();
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('open'));
    scrim.classList.add('open');
    activePanel = panel;
    lastTrigger = trigger;
    if (trigger === menuBtn){
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    const focusable = panel.querySelector('a, button');
    if (focusable) focusable.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closePanel(){
    if (!activePanel) return;
    activePanel.classList.remove('open');
    scrim.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    const panelToHide = activePanel;
    setTimeout(() => { panelToHide.hidden = true; }, 300);
    if (lastTrigger) lastTrigger.focus();
    activePanel = null;
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e){
    if (e.key === 'Escape') closePanel();
  }

  menuBtn.addEventListener('click', () => {
    if (activePanel === navPanel){ closePanel(); }
    else { openPanel(navPanel, menuBtn); }
  });

  videoCta.addEventListener('click', () => openPanel(videoModal, videoCta));
  videoModalClose.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);
})();
