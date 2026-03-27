# Contributing to ngx-dual-rangepicker

Thank you for your interest in contributing! This guide covers the local development setup, coding conventions, and the pull request process.

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Chrome (for Karma unit tests)

---

## Project structure

```
ngx-dual-rangepicker/
├── projects/
│   ├── ngx-dual-rangepicker/   # The library
│   │   └── src/lib/
│   │       ├── tests/          # Jasmine specs
│   │       └── *.ts / *.html / *.scss
│   └── demo/                   # Angular demo application
├── build/                      # ng-packagr output (git-ignored)
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## Getting started

```bash
git clone https://github.com/olivierpetitjean/ngx-dual-rangepicker.git
cd ngx-dual-rangepicker
npm install
```

### Run the demo

```bash
npm run dev
```

Opens `http://localhost:4200` with live-reload.

### Run tests

```bash
npm test              # single run + coverage
npm run test:watch    # watch mode
```

### Build the library

```bash
npm run build:lib
```

The distributable is written to `build/ngx-dual-rangepicker/`.

### Dry-run publish

```bash
npm run publish:lib:dry
```

---

## Coding conventions

- **Angular 20 standalone components** — no NgModule
- **Signals** (`signal`, `computed`, `input`, `output`, `model`) — avoid `@Input`/`@Output` decorators
- **`ChangeDetectionStrategy.OnPush`** on every component
- **CSS class prefix `drp-`** for all library styles
- **`ViewEncapsulation.None`** + `drp-` prefix scope (no Shadow DOM)
- All public-facing text (labels, comments, commit messages, test descriptions) must be in **English**
- Prettier config is in the root `package.json` (`printWidth: 100`, `singleQuote: true`)

---

## Submitting a pull request

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes and add tests.

3. Ensure the full suite passes:
   ```bash
   npm test
   npm run build:lib
   ```

4. Push and open a PR against `main`.

5. Use a concise PR title and describe what changed and why.

---

## Reporting bugs

Open an issue on GitHub with:
- Angular and Angular Material versions
- A minimal reproduction (StackBlitz preferred)
- Expected vs. actual behaviour

---

## License

By contributing you agree that your changes will be released under the [MIT license](LICENSE).
