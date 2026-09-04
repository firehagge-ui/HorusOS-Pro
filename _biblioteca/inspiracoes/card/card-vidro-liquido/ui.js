// ============================================================
//  ui.js — menu fullscreen deslizante
// ============================================================

const menu     = document.getElementById('menu');
const openBtn  = document.getElementById('menu-open');
const closeBtn = document.getElementById('menu-close');
const backdrop = document.getElementById('menu-backdrop');
const links    = menu.querySelectorAll('.menu__link');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    closeBtn.focus({ preventScroll: true });
  } else {
    openBtn.focus({ preventScroll: true });
  }
}

openBtn.addEventListener('click', () => setMenu(true));
closeBtn.addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));
links.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
});
