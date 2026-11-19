# CLAUDE.md

Context and conventions for working on this repo, which is maintained by Stuart with Claude. Read this before starting any issue. For the step-by-step workflow, see `CONTRIBUTING.md`.

## What this is

The website for the Shabbaton Choir, a London Jewish a cappella/choral charity: https://www.shabbatonchoir.com

It is a small, fully static brochure site with no backend. Its pages are Home, Music (albums), Leadership, History and Contact.

The client is the choir's committee. They supply content and must **visually sign off** changes before they go live.

## Where things stand (Nov 2026)

- **Current stack:** Astro 7 (static output to `dist/`), Tailwind 3 via PostCSS and Font Awesome 5 rendered to inline SVG at build time. ESLint, Prettier and Playwright for checks and tests. Content lives in `src/content/`: one YAML file per album (with its cover beside it) in `albums/`, and the Home, History and Leadership text as Markdown in `pages/`. The schemas are in `src/content.config.ts`. Contact is still hard-coded in `src/pages/contact.astro`. Node 22 is pinned in `.nvmrc`.
- **Planned:** inline SVG icons (#5), Tailwind 4 (#44) and `astro:assets` for images (#14).
- **Hosting:** production is on **Vercel and is frozen**. Its Ignored Build Step is set to "Don't build anything" (#38), so pushing to `main` does **not** change the live site.
- **Target hosting:** Cloudflare Pages, as a Direct Upload project deployed by GitHub Actions with `wrangler pages deploy` (#7–#9).
- **Domain, DNS and email:** all stay at **Squarespace**. The cut-over (#10) changes only the `www` CNAME. Do not touch nameservers, MX records or email forwarding. Moving those is a separate, later job (#39).

The roadmap and phase order are in issue **#1**. Work through it in phase order unless told otherwise.

## Release flow

1. Open a PR. CI checks run and a Cloudflare preview URL is posted.
2. Merge to `main`. The checks run again and, if they pass, it auto-deploys to **staging**.
3. The client reviews staging and approves.
4. Stuart runs the manual **"Deploy to production"** workflow for a chosen commit.

Nothing reaches production without client sign-off. Never add an automatic production deploy.

## Ways of working

- **Pull requests only.** Branch from `main` and open a PR. Never commit or push directly to `main`. A ruleset on `main` enforces this (#6).
- **Descriptive branch names:** a short, lowercase, hyphenated slug describing the work, for example `astro-port`, `mobile-menu`, `events-page` or `client-content`.
  - Don't add a type prefix or issue number. The PR links the issue.
  - Keep it to 28 characters or fewer. The branch name becomes the PR preview address (`mobile-menu.shabbatonchoir.pages.dev`), and Cloudflare truncates longer names.
  - Never use `main` or `staging`. Those aliases are reserved for the release flow.
  - This applies to AI sessions too: create a descriptive branch for the work instead of using an auto-generated session branch name.
- **One issue per PR.** Keep PRs small, link the issue (`Closes #N`), and fill in the PR template.
- **Small, atomic commits.** Each commit should do one thing and leave the build green. Several commits on a PR is fine and encouraged, because it makes review easier. Don't mix refactors, formatting and behaviour changes in one commit.
- **TDD, red → green → refactor.** For anything with behaviour or logic, write a failing test first (commit it), make it pass with the simplest change (commit), then refactor with the tests green (commit). Playwright browser tests (smoke, axe accessibility and link checks against the built site) live in `tests/e2e/`. Pure content or copy changes don't need a new test, but must not break the existing ones.
- **Gitmoji commit messages.** Format: `<emoji> <imperative summary>`, e.g. `✨ Add events page`. Use the Unicode emoji, not the `:code:`. Keep the summary to 72 characters or fewer, and add a body explaining _why_ when it isn't obvious. Common ones:
  - ✨ new feature
  - 🐛 bug fix
  - ♻️ refactor
  - ✅ add or update tests
  - 📝 docs
  - 💄 UI or styles
  - ♿️ accessibility
  - ⚡️ performance
  - 🔍️ SEO
  - 🍱 assets or images
  - 💬 copy or text content
  - 🔧 config
  - 👷 CI
  - 🚀 deploy
  - ⬆️ upgrade dependencies
  - 🔥 remove code or files
  - 🚚 move or rename
  - 🙈 .gitignore

  Full list: https://gitmoji.dev

- **Squash merge only.** PRs are merged with "Squash and merge", so `main` gets one commit per PR. The **PR title becomes that commit's message**, so write PR titles in gitmoji style too, e.g. `♻️ Port site from Next.js to Astro (#2)`. The individual commits stay visible on the PR for review.
- **Visual changes** need before/after screenshots at desktop and mobile widths in the PR, so Stuart and the client can review without running the site.
- **Content** comes from the client. Don't invent or "improve" copy, names, dates or facts. If something looks wrong or inconsistent, flag it on the issue with the `needs client` label rather than guessing. Issue #28 tracks the current batch of client content.
- **Keep it static and simple.** No servers, databases, client-side frameworks or tracking unless an issue explicitly calls for them. Prefer zero or minimal JavaScript.
- **Responsive, mobile-first.** Many visitors arrive on phones from social links, so every page must work well from 320px up to wide desktop. Build mobile-first with Tailwind breakpoints, and check at about 375px, 768px and 1280px. Avoid horizontal scrolling and fixed-width layouts, keep tap targets at least 44px, and avoid hover-only interactions.
- **Accessibility and performance are requirements, not extras:**
  - Semantic HTML, with one `h1` per page.
  - `lang="en-GB"`.
  - Keyboard-operable navigation.
  - Labelled icon links.
  - Images that are resized, compressed and given dimensions and alt text.
- **British English** in copy and docs.
- **Checks and hooks.** `npm install` sets up git hooks: pre-commit formats and lints staged files, and pre-push runs `lint`, `format:check` and `check`. CI runs those plus the build and `npm test` on every PR. Commit, branch and PR title conventions aren't checked automatically, so follow them by habit. Run `npm test` before pushing anything visual. Bypass the hooks with `--no-verify` only in an emergency.
- **Known accessibility failures** are listed in `tests/e2e/accessibility.spec.ts` with the issue that fixes each. Remove the entry in the PR that fixes it.

## Privacy: this repo is PUBLIC

- **Never** commit, or put in issues or PRs:
  - personal email addresses or phone numbers
  - email-forwarding destinations
  - the safeguarding leads' contact details
- Use role addresses on the site only (e.g. `md@`, `chairman@`, `info@` @shabbatonchoir.com).
- Photos of anyone under 18 need written parental consent before publishing, as the choir's safeguarding policy requires. Don't add such photos unless the issue confirms consent.
- Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) live only in GitHub Actions secrets.

## Labels

`migration`, `deploy`, `performance`, `seo`, `accessibility`, `design`, `content`, `product`, `chore`, `quick win`, `needs client`.
