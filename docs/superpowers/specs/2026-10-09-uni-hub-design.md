# Uni hub on silentnille.github.io: design

Date: 2026-10-09 · Status: approved in brainstorming, awaiting spec review

## Goal

A small personal site at `https://silentnille.github.io/` that shows what I'm doing in my first semester of the M.Sc. Medieninformatik. It covers two courses: Generative Gestaltung and Wissen als Ressource. It should look like a hand-written school notebook, not like a generic template, and hide a few Easter eggs.

## Constraints

- Plain HTML, CSS, and JS. No framework, no build step, no npm, no GitHub Actions.
- Content is written directly in HTML. No Markdown.
- GitHub Pages deploys from branch `main`, folder `/` (root).
- All visible text is German and goes through the humanizer-de skill.
- Keep code minimal. No dependencies except p5.js (CDN, only on sketch pages).
- No login or password.

## Files

```
index.html                                        start page: splash, semester weeks, course notes
generative-gestaltung/index.html                  course page: intro + task list
generative-gestaltung/01-perlin-noise/index.html  task page ("Spielwiese")
generative-gestaltung/01-perlin-noise/sketch.js   p5 sketch incl. its own sliders
wissen-als-ressource/index.html                   course page, topic still open
404.html                                          "Fang die Seite" mini game
style.css                                         one stylesheet, both themes
main.js                                           theme, splash, weeks, Easter eggs, noise
fonts/ReenieBeanie.woff2 + fonts/OFL.txt          self-hosted font + its license
.nojekyll                                         empty; Pages serves files as-is
```

Header markup is repeated in every HTML file. With five pages and no build step, copying beats any include mechanism.

## Visual design: "Karoheft"

Light mode is a school notebook. Dark mode, "Blaupause", is the same notebook with the light switched off.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fdfdfb` | `#13294b` |
| `--grid` (18 px squares) | `#bcd3ea` | `#ffffff1c` |
| `--ink` | `#1f3a93` | `#e6eefc` |
| `--margin` (red left rule) | `#e8474c` | `#ff8a8a` |
| `--mark` (highlighter) | `#fff27a` | `#f5d76e66` |
| `--note` / `--note2` (sticky notes) | `#fff7a8` / `#c9f0ff` | `#f5d76e` / `#9fd8ef` |
| `--stamp` (stamps sit on the notes) | `#b3202a` | `#b3202a` |
| grey stamp `BALD` | `#555` | `#555` |

- Font: Reenie Beanie everywhere, set through one variable `--hand`. If long texts read badly, swapping the body font is one line.
- Grid paper is two `linear-gradient`s on `body`. The red margin rule is a fixed pseudo-element.
- Course cards are rotated sticky notes with a semi-transparent tape strip.
- Status is a round, rotated stamp: `LÄUFT`, `BALD`, `FERTIG`.
- Headings get a highlighter stripe (gradient background), not an underline.
- Icons are inline SVG using `currentColor`, so they follow the theme.

Reference mockup: `.superpowers/brainstorm/*/content/final.html` (not committed).

## Behaviour (main.js)

### Theme toggle: desk lamp
- An SVG desk lamp sits top right in a `<button aria-label="Licht an/aus">`. In light mode it shines (light cone with a soft pulse). In dark mode the head tilts and the cone is gone.
- The state lives on `<html data-theme="light|dark">` and in `localStorage.theme`. Without a saved value it follows `prefers-color-scheme`.
- A three-line inline script in every `<head>` sets `data-theme` before first paint, so the page never flashes.

### Splash (start page only)
- First visit only: a full-screen grid-paper overlay where 4 to 6 ink lines draw themselves along noise curves (SVG paths, `stroke-dashoffset`). After about 2.5 s it fades out. No interaction.
- `localStorage.splashSeen = "1"` once it has played. The inline head script sets `data-splash` only when the flag is missing and `prefers-reduced-motion` is not set. CSS shows the overlay only under `[data-splash]`, so returning visitors never see it flash.
- Curves come from `noise()` in main.js, so they look slightly different every time.

### Semester weeks
- `START = 2026-10-01`, `END = 2027-03-31`, 26 boxes.
- `week = clamp(floor((today − START) / 7 days) + 1, 0, 26)`, and 0 before START. The first `week` boxes are crossed out.
- Label: "{week} von 26 Wochen abgehakt · M.Sc. Medieninformatik".
- Boxes get crossed one after another on load (staggered CSS animation, off with reduced motion).

### noise()
- Small 1D value noise (hashed grid points, smoothstep interpolation), about 15 lines. Used by the splash and the ink brush. p5 is never loaded on the start page.

### Easter eggs
1. Ink brush: clicking the logo 7 times turns on a canvas overlay. The cursor leaves a wobbly ink line (noise offset) that fades after about 1 s. Clicking 7 more times turns it off.
2. Console: on load, `console.log` prints a small ASCII notebook and „Na, neugierig? Schön, dass du reinschaust."
3. Lamp spam: 5 toggles within 2 s show a sticky-note toast for 3 s: „Licht an, Licht aus. Entscheide dich mal."
4. 404 game: see below.

### 404: "Fang die Seite"
- Headline „404. Diese Seite ist abgehauen." and below it „Ein paar andere auch. Fang so viele, wie du kannst."
- A button „Los" starts a round, and a round lasts 30 s. Small paper pages pop up at random spots, each stays about 1 s, and click or tap catches it (+1). Score and timer show as handwriting.
- At the end: „{n} Seiten gefangen." The best score is kept in `localStorage.pagesHighscore` and shown as „Rekord: {n}". Buttons: „Nochmal" and „Zurück zum Heft" (links to `/`).
- The 404 page is served for any missing sub-path, so relative asset paths would break there. That's why every page uses root-absolute paths (`/style.css`, `/main.js`, `/fonts/…`).

## Pages and copy

### Start page `/`
- Logo: „silentnille", plus the lamp.
- H1: „Mein <mark>erstes Semester</mark> im Master"
- Week boxes and label (see above).
- Note 1, linking to `/generative-gestaltung/`: „Generative Gestaltung" / „HA 1: drei Ebenen Perlin Noise, übereinander geblendet." / stamp `LÄUFT`.
- Note 2, linking to `/wissen-als-ressource/`: „Wissen als Ressource" / „Thema? Noch offen. Wahrscheinlich NotebookLM." / stamp `BALD`.

### Generative Gestaltung `/generative-gestaltung/`
- H1: „Generative Gestaltung"
- Intro: „Wir arbeiten mit p5.js. Hier sammle ich meine Hausaufgaben, jede mit einem Sketch zum Rumspielen."
- Task list as a handwritten list with stamps: „HA 1 · Drei Ebenen Perlin Noise" → `LÄUFT`, linked.

### Task page `/generative-gestaltung/01-perlin-noise/`
- Breadcrumb: „silentnille / generative gestaltung / HA 1"
- H1: „Drei Ebenen Perlin Noise"
- A live p5 canvas inside a slightly rotated paper frame. The sliders (scale per layer), the blend-mode dropdown and the re-roll button come from `sketch.js` itself (`createSlider`, `createSelect`, `createButton`). The page only gives them a container and styles them as handwriting.
- Sections: „Aufgabe" with „Perlin Noise selbst umsetzen und drei Ebenen mit einem Blend-Modus übereinanderlegen.", plus „Was ich gemacht habe" and „Was ich gelernt habe", both starting as „Kommt, sobald der Sketch fertig ist."
- `sketch.js` starts as a placeholder: one noise layer and a note in the canvas („Hier kommt meine Lösung hin"). The homework itself is mine to write; the site only gives it a home.
- p5 loads from jsDelivr with an exact version pinned at implementation time.

### Wissen als Ressource `/wissen-als-ressource/`
- H1: „Wissen als Ressource"
- Text: „In dem Kurs geht es darum, wie ich mein eigenes Wissen sammle und ordne. Ein Thema habe ich noch nicht. Ausprobieren will ich NotebookLM, weil ich mit Gemini bisher kaum gearbeitet habe."
- Stamp `BALD`.

## Adding content later

New homework: copy `01-perlin-noise/` to `02-…/`, swap `sketch.js` and the texts, add a line to the task list, update the note on the start page. No tooling involved.

## Accessibility

- Every animation (splash, lamp pulse, week stagger, ink brush) is off under `prefers-reduced-motion`.
- The lamp is a real `<button>` with an `aria-label` and a visible focus ring.
- Sticky notes are plain `<a>` elements and keyboard-reachable.
- Text contrast is at least 4.5:1 in both themes, including dark ink on yellow notes in dark mode.

## Verification

There's no test framework because the logic is too small to need one. I'll check manually with `python3 -m http.server`:

- [ ] Both themes, toggled with the lamp, survive a reload, and there's no flash on load
- [ ] With no saved theme, the system setting wins
- [ ] Splash plays on the first visit only (clear localStorage to repeat it) and never with reduced motion
- [ ] Week count is correct for today. Temporarily faking `today` before START and after END gives 0 and 26
- [ ] 7 logo clicks turn the brush on, 7 more turn it off
- [ ] Console greeting appears
- [ ] 5 fast lamp toggles show the toast
- [ ] `/gibtsnicht` shows the 404 game with styles, the round ends after 30 s, and the highscore survives a reload
- [ ] p5 sketch runs and its controls work
- [ ] Layout holds at 375 px width
- [ ] After pushing: Pages is set to "Deploy from branch main /", and the live URL works

## Out of scope

Login and password, Markdown, build tools, other courses, analytics, comments, Obsidian or NotebookLM integration.
