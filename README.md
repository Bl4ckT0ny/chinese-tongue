# Mandarin Tongue Placement Diagram

*[Русская версия](README.ru.md) · [简体中文](README.zh-CN.md)*

An interactive midsagittal view of the vocal tract that shows tongue placement, places of articulation, and velum position for selected Mandarin initials, nasal codas, and erhua.

Available in three languages:

- English: `en.html`
- Russian: `ru.html`
- Simplified Chinese: `zh-CN.html`

The project is written in TypeScript. User-facing copy and pronunciation guidance live in language-specific data files, while rendering and geometry are shared across all versions.

## Repository structure

```text
index.html                 → GitHub Pages entry point; redirects to the Russian page
ru.html                    → Russian page
en.html                    → English page
zh-CN.html                 → Simplified Chinese page
assets/
  style.css                → shared styles
src/
  types.ts                 → shared Point, SoundGroup, and AppData types
  geometry.ts              → tongue and velum geometry; no DOM dependencies
  engine.ts                → rendering and animation; contains no user-facing copy
  data.ru.ts               → Russian interface and pronunciation data
  data.en.ts               → English interface and pronunciation data
  data.zh-CN.ts            → Simplified Chinese interface and pronunciation data
  main.ru.ts               → Russian entry point
  main.en.ts               → English entry point
  main.zh-CN.ts            → Simplified Chinese entry point
tests/
  unit/                    → geometry and data-consistency tests
  e2e/                     → Playwright browser tests
dist/                      → compiled JavaScript; not committed
.github/workflows/         → lint, test, and GitHub Pages workflows
```

`engine.ts` contains no user-facing text. Each locale supplies an `AppData` object from its own `data.*.ts` file, and TypeScript checks that every file follows the same structure.

## Pronunciation terminology

The English version uses standard phonetic terminology where it helps, while keeping explanations accessible to learners:

- bilabial and labiodental sounds
- alveolar consonants
- dental sibilants
- retroflex consonants
- alveolo-palatal consonants
- velar consonants
- alveolar and velar nasal codas
- erhua (rhotacization)

The interface distinguishes Pinyin spelling from the actual articulatory gesture. For example, `j/q/x` are described as alveolo-palatal rather than equated with similarly spelled English consonants.

## Adding or editing a sound group

Each item in `initials` or `finals` follows this structure:

```ts
{
  id: 'alveolar',
  pinyin: 'd · t · n · l',
  name: 'Alveolar',
  marker: { x: 133, y: 138 },
  noContact: false,
  velum: false,
  top: [
    { x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 },
    { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }
  ],
  title: 'Tongue tip at the alveolar ridge',
  body: '...',
  example: 'nǐ hǎo → 你好 “hello”'
}
```

Coordinates use the SVG `viewBox="0 0 640 440"` coordinate system. `top` must contain exactly six points, representing the tip, blade, front dorsum, mid dorsum, back dorsum, and root of the tongue.

When changing the structure or geometry for one locale, check the other language files as well. Sound-group IDs, coordinates, contact state, and velum state should remain consistent unless the underlying articulation genuinely differs.

## Running locally

Requires Node.js **^22.22.0 or >=24.8.0**.

```bash
npm install
npm run build
python3 -m http.server 8000
```

Then open one of the language pages, for example:

```text
http://localhost:8000/en.html
```

The pages use browser ES modules, so they must be served over HTTP rather than opened directly with `file://`.

For continuous compilation during development:

```bash
npx tsc --watch
```

## Checks

```bash
npm run typecheck
npm run lint:ts
npm run lint:html
npm run lint
```

The same checks run in GitHub Actions for every push and pull request.

## Tests

```bash
npm run build
npm run test:unit
npx playwright install --with-deps chromium
npm run test:e2e
npm test
```

Unit tests cover tongue geometry, coordinate bounds, cross-language data consistency, and key articulation properties such as nasal velum state and shared tongue positions. Playwright tests exercise the pages in Chromium, click through every sound group, verify nasal-airflow behavior, and check the anatomy-label layout at several viewport widths.

## Deploying to GitHub Pages

Pushes to `main` trigger `.github/workflows/deploy.yml`, which installs dependencies, type-checks the project, runs unit tests, builds the TypeScript sources, and publishes the site through GitHub Pages.

For the initial setup, select:

```text
Settings → Pages → Source → GitHub Actions
```

The deployed language pages are available at paths such as:

```text
https://<username>.github.io/<repository>/en.html
https://<username>.github.io/<repository>/ru.html
https://<username>.github.io/<repository>/zh-CN.html
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

When editing pronunciation terminology, prefer established phonetic usage and clear learner-facing explanations over literal translation from another locale.

## License

[MIT](LICENSE).

## Acknowledgments

Special thanks to ZhuHeng 朱恒 `<zhuheng0627@qq.com>` for reviewing the project content.
