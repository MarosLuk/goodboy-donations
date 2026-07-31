# GoodBoy Donations

Donation form for the GoodBoy Foundation, which supports Slovak dog shelters.
Built with Next.js (App Router) and TypeScript.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` — every variable is documented there. They are
parsed once on startup and the app refuses to boot on a missing or malformed value.

| Variable                   | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the assignment API                      |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site URL, used as `metadataBase` for `og` |

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
