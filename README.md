# shabbatonchoir.com

The website for the Shabbaton Choir, built with [Astro](https://astro.build) and Tailwind CSS. It is a fully static site.

## Getting started

Use Node 22 (`nvm use` picks it up from `.nvmrc`), then:

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run check    # type-check the Astro files
npm run build    # static site in dist/
npm run preview  # serve dist/ locally
```

Pages live in `src/pages/`, shared components in `src/components/` and the page shell in `src/layouts/Layout.astro`. Images and other static files are in `public/`.

See `CONTRIBUTING.md` for the workflow and `CLAUDE.md` for project context and conventions. A fuller README is planned in #13.
