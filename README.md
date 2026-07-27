# Mandarin Tongue Placement Diagram

*[Читать на русском](README.ru.md)*

An interactive sagittal (side) cross-section of the mouth, showing where the
tongue goes for Mandarin initials (consonants) and finals (endings).
Available in Russian (`ru.html`) and English (`en.html`). Written in
TypeScript.

## Repository structure

```
index.html              → redirects to ru.html (repo-root entry for GitHub Pages)
ru.html                 → Russian page (thin HTML shell)
en.html                 → English page (thin HTML shell)
assets/
  style.css              → shared styles (identical for both languages)
src/
  types.ts               → shared types: Point, SoundGroup, AppData, etc.
  geometry.ts             → pure tongue/velum geometry functions (no DOM)
  engine.ts               → rendering + animation; takes AppData as a parameter, no text inside
  data.ru.ts               → all Russian text + sound coordinates, typed as AppData
  data.en.ts               → the same in English
  main.ru.ts / main.en.ts   → entry points, just call mount(data)
tests/
  unit/
    geometry.test.mjs       → geometry tests (node --test, no browser)
    data.test.mjs            → ru/en data-consistency tests
  e2e/
    app.spec.ts               → Playwright: real browser, both languages, every sound
dist/                     → compiled JS (built from src/, not committed)
.github/workflows/
  lint.yml                 → typecheck + ESLint + html-validate on every push/PR
  test.yml                  → unit + e2e tests on every push/PR
  deploy.yml                 → build + unit tests + deploy to GitHub Pages on push to main
tsconfig.json               → build config for src/
tsconfig.tests.json          → separate config for type-checking tests/e2e
playwright.config.ts
eslint.config.js
.htmlvalidate.json
package.json
CONTRIBUTING.md
LICENSE
```

`engine.ts` contains no user-facing text at all — everything lives in
`data.ru.ts` / `data.en.ts` and is typed against the `AppData` interface in
`types.ts`. If one language file gains a new field and the other doesn't,
TypeScript will refuse to build until you fix both.

## Adding or editing a sound

Each entry in `initials` / `finals` (in `data.*.ts`) is an object:

```ts
{
  id: 'alveolar',
  pinyin: 'd · t · n · l',
  name: 'Alveolar',
  marker: { x: 133, y: 138 },   // where the amber contact-point dot sits
  noContact: false,              // true → dot becomes a dashed ring (no closure, like -r)
  velum: true,                    // true → soft palate opens (nasal sounds: -n, -ng)
  top: [                           // exactly 6 points: [tip, blade, frontDorsum, midDorsum, backDorsum, root]
    { x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 },
    { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }
  ],
  title: '...',
  body: '...',                     // <b>...</b> is allowed
  example: 'pīnyīn → 汉字 "translation"'
}
```

Coordinates are in the SVG `viewBox="0 0 640 440"` system. If `top` doesn't
have exactly 6 points, TypeScript will refuse to build — `TongueTop` is a
fixed-length tuple type. The easiest way to add a sound is to copy the
coordinates from a similar articulation, nudge them by eye, then rebuild
(`npm run build`) and check in a browser — the build takes under a second.

## Running locally

Requires Node.js **^22.22.0 or >=24.8.0** (see `engines` in `package.json`) —
`html-validate` won't run on older versions, so `npm install` will warn (and
CI will fail) below that. The app is built as real browser ES modules
(`<script type="module">`), so double-clicking the HTML file (`file://`)
won't work — browsers block module scripts under CORS for `file://`. You
need a local server:

```bash
npm install
npm run build          # compiles src/*.ts → dist/*.js
python3 -m http.server 8000
# then open http://localhost:8000/ru.html
```

While editing, it's convenient to keep the compiler watching:

```bash
npx tsc --watch
```

## Checks (types + linters)

```bash
npm run typecheck   # tsc --noEmit
npm run lint:ts      # ESLint over src/**/*.ts
npm run lint:html    # html-validate over *.html
npm run lint          # all of the above
```

The same checks run automatically in GitHub Actions on every push and pull
request (`.github/workflows/lint.yml`).

## Tests

Two layers, both of which actually run in this repository:

```bash
npm run build          # tests need a built dist/
npm run test:unit       # node --test — tongue geometry + ru/en data consistency
npx playwright install --with-deps chromium   # once, for e2e
npm run test:e2e         # Playwright — real browser, both languages, all 9 sounds
npm test                  # build + unit + e2e in one command
```

**Unit tests** (`tests/unit/`, no browser):
- `geometry.test.mjs` — that `tongueD`/`velumD` build a well-formed path;
  includes a dedicated regression test for a "tongue thickness inverts into
  a self-crossing loop" bug that was found and fixed during development —
  now locked down against several real point configurations.
- `data.test.mjs` — that `data.ru.ts` and `data.en.ts` never drift apart in
  which sounds they cover, that `top` always has exactly 6 in-bounds points,
  and that the underlying phonetics are encoded correctly: `-n` shares tongue
  placement with `d/t/n/l`, `-ng` with `g/k/h`, `-r` has no contact and no
  nasalization, and no initial opens the velum.

**E2E tests** (`tests/e2e/app.spec.ts`, Playwright, real Chromium):
- the page loads with no console errors, in both languages
- clicking every one of the 6 initials and 3 finals never throws a JS error
  and always leaves a non-empty tongue path
- the tongue's color comes from the `.tongue-shape` CSS class, never an
  inline attribute — a direct regression test for a real Safari bug (CSS
  custom properties don't reliably resolve in SVG presentation attributes)
- `-n`/`-ng` turn on the dashed nasal-airflow line, other sounds don't
- anatomy labels never overlap at any of three screen widths (320/700/1080px)
  — an automated version of a `getBBox()` check that was previously done by
  hand after labels were found overlapping on small screens

The same run (`build` → `test:unit` → install browser → `test:e2e`) executes
in GitHub Actions on every push/PR (`.github/workflows/test.yml`). Deploy
(`deploy.yml`) additionally runs `test:unit` as a fast gate before publishing
(no e2e there, to avoid slowing the deploy down with a browser install).

## Deploying to GitHub Pages

Deployment is fully automatic via `.github/workflows/deploy.yml`: on every
push to `main` it installs dependencies, type-checks, runs unit tests,
builds the TypeScript (`npm run build`), and publishes via the official
`actions/upload-pages-artifact` + `actions/deploy-pages`.

One-time setup:

1. Push the repository to `main` on GitHub
2. Settings → Pages → Source → select **GitHub Actions** (not "Deploy from a
   branch" — the build now happens in CI, `dist/` isn't committed)
3. After the first workflow run, the site will be live at
   `https://<your-username>.github.io/<repo>/`
4. That link is safe to share anywhere, including Telegram — it's a real web
   page, not a file, so JS and interactivity work in mobile browsers
   (including Telegram's in-app browser).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE).

## Acknowledgments

Special thanks to ZhuHeng 朱恒 <zhuheng0627@qq.com> for verification.

## Implementation notes

- The tongue's fill/stroke color is set via the `.tongue-shape` CSS class,
  not inline attributes like `fill="var(--tongue)"` — CSS custom properties
  don't reliably resolve in SVG presentation attributes on some Safari
  versions, which made the tongue invisible. If you add new SVG elements
  that use a palette color, style them the same way — through a class, not
  an attribute.
- Anatomy labels in the SVG are deliberately staggered across two rows (see
  the comment in `engine.ts`) — the spacing was verified with `getBBox()` so
  the text never overlaps at any screen size. Check the same thing if you
  add new labels.
- The tongue's underside shape in `geometry.ts` is computed relative to the
  top points (`tip.y + 36`, etc.), not fixed coordinates — this guarantees
  the tongue's thickness can never "invert" into a self-crossing loop at
  extreme positions (verified by rendering all 9 sounds, and locked down by
  `tests/unit/geometry.test.mjs`).
