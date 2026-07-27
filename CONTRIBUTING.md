# Contributing

Thanks for considering a contribution. This is a small project, so the
process is intentionally lightweight.

## Setup

```bash
git clone <this-repo>
cd <this-repo>
npm install
npm run build
python3 -m http.server 8000
# open http://localhost:8000/ru.html or /en.html
```

See [README.md](README.md) for the full local-dev, testing, and deployment
instructions. This file only covers the contribution workflow itself.

## Before opening a pull request

Run the full check suite locally — the same commands run in CI, so this
avoids a round-trip through GitHub Actions:

```bash
npm run lint    # typecheck + ESLint + html-validate
npm test         # build + unit tests + Playwright e2e tests
```

For `npm test` you'll need Chromium for Playwright once:

```bash
npx playwright install --with-deps chromium
```

A PR that fails `lint` or `test` in CI won't be merged, so please make sure
both pass locally first.

## Kinds of contributions

**Fixing or adding a sound (most common contribution).** See the "Adding or
editing a sound" section in [README.md](README.md). Please add or update the
relevant tests in `tests/unit/data.test.mjs` if you change a domain fact
(e.g. which initial a final's tongue placement matches).

**Adding a new language.** Copy `src/data.en.ts` to `src/data.<lang>.ts`,
translate every string, keep every `id`/`marker`/`top`/`noContact`/`velum`
value identical to the English version (only text should differ), add
`<lang>.html` modeled on `ru.html`/`en.html`, and add the new file to the
language switcher list in `src/engine.ts`. `data.test.mjs` currently assumes
exactly two languages (`ru`, `en`) are compared 1:1 — if you add a third,
generalize that comparison rather than duplicating it pairwise.

**Fixing a bug in the diagram itself (geometry, layout, rendering).** Please
add a regression test if at all possible — most of the existing test suite
exists specifically because a real bug was found and fixed during
development (see "Implementation notes" in the README). If you can write a
failing test that reproduces the bug before fixing it, that's the ideal PR
shape.

**Everything else** (docs, CI, refactors) — a normal PR is fine, just keep
`npm run lint` and `npm test` green.

## Code style

- TypeScript, `strict: true`. No `any` unless there's genuinely no better
  option — ESLint will flag it.
- `engine.ts` must stay free of user-facing text. If you're tempted to hardcode
  a string there, it almost certainly belongs in `data.*.ts` / `AppData`
  instead.
- Keep `src/geometry.ts` pure (no DOM access) so it stays cheaply unit-testable.
- SVG elements that use a palette color (`var(--tongue)`, `var(--amber)`,
  etc.) must get that color from a CSS class, never an inline `fill=`/`stroke=`
  attribute — see the Safari note in the README's "Implementation notes".

## Reporting a bug

Open an issue with: which page (`ru.html`/`en.html`), which sound (if
relevant), browser + OS, and ideally a screenshot. If it's a rendering issue
specific to one browser, please say so explicitly — some of the bugs this
project has hit only reproduce in Safari and won't show up in a Chromium-only
test run.

## License

By contributing, you agree that your contribution will be licensed under
the project's [MIT license](LICENSE).
