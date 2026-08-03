(() => {
  const menuBtn = document.getElementById('menuBtn');
  const navPanel = document.getElementById('navPanel');
  const scrim = document.getElementById('scrim');
  if (!menuBtn || !navPanel || !scrim) return;

  let navOpen = false;

  function openNav(){
    window.SoyClimatikaVideoStage?.close();
    navPanel.hidden = false;
    requestAnimationFrame(() => navPanel.classList.add('open'));
    scrim.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
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
    menuBtn.setAttribute('aria-label', 'Abrir menú');
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

  window.SoyClimatikaNav = { openNav, closeNav, isOpen: () => navOpen };
})();
