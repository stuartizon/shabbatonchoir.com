# CLAUDE.md

Context and ways of working for anyone (human or AI) picking up work on this repo. Read this before starting any issue.

## What this is

The website for the Shabbaton Choir, a London Jewish a cappella/choral charity: https://www.shabbatonchoir.com

It is a small, fully static brochure site with no backend. Its pages are Home, Music (albums), Leadership, History and Contact.

The client is the choir's committee. They supply content and must **visually sign off** changes before they go live.

## Where things stand (Nov 2026)

- **Current stack:** Next.js 12 (Pages Router), React 17, Tailwind 3 and Font Awesome 5. Content is hard-coded in JSX under `pages/` and `components/`.
- **Planned stack:** Astro, using content collections for albums, Markdown for page text and `astro:assets` for images (#2–#5).
- **Hosting:** production is on **Vercel and is frozen**. Its Ignored Build Step is set to "Don't build anything" (#38), so pushing to `main` does **not** change the live site.
- **Target hosting:** Cloudflare Pages, as a Direct Upload project deployed by GitHub Actions with `wrangler pages deploy` (#7–#9).
- **Domain, DNS and email:** all stay at **Squarespace**. The cut-over (#10) changes only the `www` CNAME. Do not touch nameservers, MX records or email forwarding. Moving those is a separate, later job (#39).

The roadmap and phase order are in issue **#1**. Work through it in phase order unless told otherwise.

## Release flow

1. Open a PR. CI checks run and a Cloudflare preview URL is posted.
2. Merge to `main`, which auto-deploys to **staging**.
3. The client reviews staging and approves.
4. A maintainer runs the manual **"Deploy to production"** workflow for a chosen commit.

Nothing reaches production without client sign-off. Never add an automatic production deploy.

## Ways of working

- **One issue per PR.** Keep PRs small and atomic, link the issue (`Closes #N`), and fill in the PR template.
- **Branch from `main`.** Never push directly to `main`.
- **Visual changes** need before/after screenshots at desktop and mobile widths in the PR, so the client and maintainer can review without running the site.
- **Content** comes from the client. Don't invent or "improve" copy, names, dates or facts. If something looks wrong or inconsistent, flag it on the issue with the `needs client` label rather than guessing. Issue #28 tracks the current batch of client content.
- **Keep it static and simple.** No servers, databases, client-side frameworks or tracking unless an issue explicitly calls for them. Prefer zero or minimal JavaScript.
- **Accessibility and performance are requirements, not extras:**
  - Semantic HTML, with one `h1` per page.
  - `lang="en-GB"`.
  - Keyboard-operable navigation.
  - Labelled icon links.
  - Images that are resized, compressed and given dimensions and alt text.
- **British English** in copy and docs.
- Run lint and build locally before pushing (`yarn lint`, `yarn build`). After the Astro port this becomes `npm run check && npm run build`, and the README will be updated.

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
