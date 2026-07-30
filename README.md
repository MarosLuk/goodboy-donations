# GoodBoy Donations

Donation form for the GoodBoy Foundation, which supports Slovak dog shelters.
Built with Next.js (App Router) and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Scripts

| Script                 | What it does               |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server with Turbopack  |
| `npm run build`        | Production build           |
| `npm run start`        | Serve the production build |
| `npm run lint`         | ESLint (flat config)       |
| `npm run format`       | Prettier — write           |
| `npm run format:check` | Prettier — check only      |
| `npm run typecheck`    | `tsc --noEmit`             |
| `npm test`             | Vitest                     |
| `npm run validate`     | Typecheck + lint + tests   |

## Quality gates

`husky` runs `lint-staged` (ESLint + Prettier) before every commit and `commitlint`
on every commit message — the history follows
[Conventional Commits](https://www.conventionalcommits.org/).
GitHub Actions runs typecheck, lint, format check, tests and a production build on
every push and pull request.
