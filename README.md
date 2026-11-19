# shabbatonchoir.com

The website for the Shabbaton Choir, built with [Astro](https://astro.build) and Tailwind CSS. It is a fully static site.

## Getting started

Use Node 22 (`nvm use` picks it up from `.nvmrc`), then:

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run check    # type-check the Astro files
npm run lint     # ESLint, including accessibility rules
npm run format   # format everything with Prettier
npm test         # build, then run the Playwright tests
npm run build    # static site in dist/
npm run preview  # serve dist/ locally
```

The first time, install the browser for the Playwright tests with `npx playwright install chromium`. `npm install` also sets up git hooks that check formatting, lint and types.

Pages live in `src/pages/`, shared components in `src/components/` and the page shell in `src/layouts/Layout.astro`. Static files that are served as they are, such as the logo and favicon, are in `public/`.

Most of the site's text and data is in `src/content/`, so content changes are file edits rather than code changes:

- **Albums:** one YAML file per album in `src/content/albums/`, with its cover image beside it. To add an album, add a `.yaml` file and its image. The Music page lists albums newest first.
- **Page text:** the Home, History and Leadership pages are Markdown files in `src/content/pages/`. Front matter sets the page heading.

The fields each file needs are defined in `src/content.config.ts`, and the build fails with a clear error if one is missing or wrong.

See `CONTRIBUTING.md` for the workflow and `CLAUDE.md` for project context and conventions. A fuller README is planned in #13.
