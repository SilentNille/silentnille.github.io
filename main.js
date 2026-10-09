// Shared behaviour for every page. Loaded with `defer`, so the DOM is ready.

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1D value noise: hashed integer points, smoothstep in between. Returns 0..1.
// ponytail: value noise, not true Perlin; enough for wobbly ink lines.
function noise(x) {
  const hash = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const i = Math.floor(x);
  const f = x - i;
  const t = f * f * (3 - 2 * f);
  return hash(i) + (hash(i + 1) - hash(i)) * t;
}

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

// Splash: the <head> script sets data-splash only on a first visit without reduced motion.
const splash = document.getElementById('splash');
if (splash && 'splash' in root.dataset) {
  localStorage.splashSeen = '1';
  const svg = splash.querySelector('svg');
  const w = innerWidth;
  const h = innerHeight;
  const seed = Math.random() * 1000;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  let paths = '';
  for (let line = 0; line < 5; line++) {
    let d = '';
    for (let x = 0; x <= w; x += 8) {
      const y = h * (0.3 + line * 0.1) + (noise(seed + line * 7 + x / 150) - 0.5) * h * 0.3;
      d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`;
    }
    paths += `<path pathLength="1" style="animation-delay:${line * 0.12}s" d="${d}"/>`;
  }
  svg.innerHTML = paths;
  setTimeout(() => delete root.dataset.splash, 3100);
}
