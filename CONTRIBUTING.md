# Contributing

Thanks for helping with the Shabbaton Choir website. This is a small volunteer-run site, so the process is lightweight. Please follow it, though, because the choir's committee signs off every change before it goes live.

## Before you start

1. Find or open an issue. Everything planned is tracked in the roadmap, issue #1.
2. Comment on the issue to say you're picking it up.
3. If the issue is labelled `needs client`, check that the client's answer is recorded on it before building anything that depends on it.

## Making a change

```bash
git checkout main && git pull
git checkout -b <short-description>   # e.g. fix-mobile-menu
yarn install
yarn dev                              # http://localhost:3000
```

Before pushing:

```bash
yarn lint
yarn build
```

> After the Astro port (#2), these commands will change. The README will have the current ones.

## Commits

- **Small and atomic.** One logical change per commit, and the build stays green. Multiple commits per PR are welcome.
- **Test first.** For behaviour or logic, use red → green → refactor: commit a failing test, then the fix, then any tidy-up.
- **Gitmoji style:** `<emoji> <imperative summary>`, for example:
  - `✨ Add events page`
  - `🐛 Fix mobile menu focus`
  - `📝 Update README`

  See `CLAUDE.md` for the common emoji, or https://gitmoji.dev for the full list.

## Pull requests

- Never commit directly to `main`. Every change goes through a PR.
- One issue per PR, with `Closes #N` in the description.
- **The PR title must be gitmoji style.** PRs are squash-merged, so the title becomes the commit message on `main`.
- Fill in the PR template.
- For anything visual, add before/after screenshots at desktop and mobile widths.
- Wait for CI to pass and check your change on the PR's preview link.
- A maintainer reviews and merges. Merging deploys to **staging**, not to the live site.

## Releasing

Production deploys are manual and happen only after the client has approved staging. See `CLAUDE.md` for the full release flow.

## Content

- Copy, names, dates and facts come from the choir. Don't rewrite them. Raise questions on the issue instead.
- Use British English.
- Images should be web-sized (no more than about 2000px wide, compressed) and have meaningful alt text.
- Don't publish photos of under-18s without confirmed written parental consent.

## Privacy

This repository is public. Never commit or post personal phone numbers, personal email addresses or email-forwarding destinations. Use the choir's role addresses (e.g. `md@shabbatonchoir.com`) on the site.
