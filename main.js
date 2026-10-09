// Shared behaviour for every page. Loaded with `defer`, so the DOM is ready.

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function toast(text) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 3000);
}

// Theme lamp. The inline <head> script already set data-theme before paint.
let lampClicks = [];
document.querySelector('.lamp').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.theme = next;

  const now = Date.now();
  lampClicks = lampClicks.filter((t) => now - t < 2000).concat(now);
  if (lampClicks.length >= 5) {
    lampClicks = [];
    toast('Licht an, Licht aus. Entscheide dich mal.');
  }
});
