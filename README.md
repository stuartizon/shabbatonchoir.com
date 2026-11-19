# shabbatonchoir.com

The website for the Shabbaton Choir, a London Jewish a cappella and choral charity: https://www.shabbatonchoir.com

It is a small, fully static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com) 4, and hosted on [Cloudflare Pages](https://pages.cloudflare.com).

## Running it locally

You need Node 22. With [nvm](https://github.com/nvm-sh/nvm), `nvm use` picks the version up from `.nvmrc`.

```bash
npm install                          # also sets up the git hooks
npx playwright install chromium      # once, for the browser tests
npm run dev                          # dev server at http://localhost:4321
```

The other scripts:

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `npm run build`   | Builds the static site into `dist/`                                  |
| `npm run preview` | Serves `dist/` locally                                               |
| `npm test`        | Builds, then runs the Playwright smoke, accessibility and link tests |
| `npm run check`   | Type-checks the Astro files                                          |
| `npm run lint`    | ESLint, including accessibility rules                                |
| `npm run format`  | Formats everything with Prettier (`format:check` only checks)        |

## Project structure

```text
src/
├── content/
│   ├── albums/         # one YAML file per album, with its cover beside it
│   └── pages/          # Home, History and Leadership text, in Markdown
├── content.config.ts   # the fields each content file needs
├── pages/              # one file per route
├── layouts/
├── components/
└── styles/global.css   # Tailwind theme
public/                 # files served as they are
tests/e2e/              # Playwright tests
.github/workflows/      # CI and deploys
```

## Environments

- **Preview:** each pull request is deployed to `https://<branch>.shabbatonchoir.pages.dev`.
- **Staging:** each merge to `main` that passes the checks is deployed to https://staging.shabbatonchoir.pages.dev.
- **Production:** deployed by hand with a "Deploy to production" workflow, once the committee has signed off on staging. This workflow is still to come (#9).

See `CONTRIBUTING.md` for the workflow and `CLAUDE.md` for project context and conventions.
