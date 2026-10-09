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

// Semester weeks: 01.10.2026 to 31.03.2027 = 26 weeks.
const SEMESTER_WEEKS = 26;

// UTC day math, so daylight saving changes can't shift the count.
function weeksDone(today) {
  const days = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(2026, 9, 1)) / 864e5;
  return days < 0 ? 0 : Math.min(SEMESTER_WEEKS, Math.floor(days / 7) + 1);
}

const weeks = document.querySelector('.weeks');
if (weeks) {
  const done = weeksDone(new Date());
  for (let i = 0; i < SEMESTER_WEEKS; i++) {
    const box = document.createElement('li');
    if (i < done) {
      box.className = 'done';
      box.style.setProperty('--i', i);
    }
    weeks.append(box);
  }
  document.getElementById('weeks-label').textContent = `${done} von ${SEMESTER_WEEKS} Wochen abgehakt · M.Sc. Medieninformatik`;
}
