# shabbatonchoir.com

The website for the Shabbaton Choir, a London Jewish a cappella and choral charity: https://www.shabbatonchoir.com

It is a small, fully static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com) 4. There is no backend. The pages are Home, Music, Leadership, History and Contact.

- [Running it locally](#running-it-locally)
- [Where things live](#where-things-live)
- [Making a content change](#making-a-content-change)
- [Releasing](#releasing)
- [Rolling back](#rolling-back)
- [Hosting, DNS and email](#hosting-dns-and-email)

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

The git hooks format and lint staged files on commit, and run `lint`, `format:check` and `check` on push. CI runs all of those plus the build and `npm test` on every pull request.

## Where things live

Most of the text and data is in `src/content/`, so a content change is a file edit rather than a code change.

| What                                           | Where                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Albums (Music page)                            | `src/content/albums/`: one `.yaml` file per album, with its cover image beside it |
| Home, History and Leadership text              | `src/content/pages/`: one Markdown file per page                                  |
| Contact page                                   | `src/pages/contact.astro` (not yet moved into content)                            |
| The fields each content file needs             | `src/content.config.ts`                                                           |
| Pages and layouts                              | `src/pages/`, `src/layouts/`                                                      |
| Shared components                              | `src/components/`                                                                 |
| Icons (inline SVG path data)                   | `src/icons.ts`                                                                    |
| Theme colours and fonts                        | the `@theme` block in `src/styles/global.css`                                     |
| Files served as they are (logo, favicon, hero) | `public/`                                                                         |
| Browser tests                                  | `tests/e2e/`                                                                      |
| CI and deploy workflows                        | `.github/workflows/`                                                              |

If a content file is missing a field, or a field has the wrong type, the build fails with an error that names the file and the field.

### Adding an album

1. Resize and compress the cover to no more than about 2000px wide, and put it in `src/content/albums/`, for example `new-album.jpeg`.
2. Add `src/content/albums/new-album.yaml` beside it:

   ```yaml
   name: New Album
   year: 2027
   cover: ./new-album.jpeg
   description: >-
     Optional. One or two sentences, exactly as the committee supplied them.
   spotify: https://open.spotify.com/album/...
   apple: https://music.apple.com/...
   amazon: https://music.amazon.co.uk/albums/...
   ```

   `name`, `year`, `cover` and the three links are required, and the links must be full URLs. The Music page sorts albums by `year`, newest first.

3. Run `npm run dev` and check the Music page.

### Editing page text

The Home, History and Leadership pages are Markdown files in `src/content/pages/`. The `title` in the front matter at the top sets the page heading, and the rest is the page body. Use `##` for headings within the page, since the page title is already the `h1`.

## Making a content change

Content comes from the choir committee. Copy their text as written, and raise anything that looks wrong as a question on the issue rather than fixing it. The repository is public, so never add personal email addresses or phone numbers: use role addresses such as `info@shabbatonchoir.com`.

1. Branch from an up-to-date `main` with a short, descriptive name of 28 characters or fewer, such as `new-album`. The branch name becomes the preview address.
2. Make the change and commit it with a [gitmoji](https://gitmoji.dev) message, for example `💬 Update the History page`.
3. Push and open a pull request. Give it a gitmoji title (it becomes the commit on `main`), add `Closes #N`, and fill in the template.
4. Follow the [release flow](#releasing) below.

See `CONTRIBUTING.md` for the fuller workflow and `CLAUDE.md` for the project conventions.

## Releasing

Nothing goes live without the committee's visual sign-off.

1. **Pull request preview.** Every pull request runs the checks and deploys a preview to `https://<branch>.shabbatonchoir.pages.dev`. The PR shows a "View deployment" link. Review the change there.
2. **Staging.** Squash-merge the PR. The checks run again on `main` and, if they pass, the site deploys to staging at https://staging.shabbatonchoir.pages.dev. A failing check means staging is not updated.
3. **Client sign-off.** Share the staging link with the committee and get their approval. Note it on the issue or PR.
4. **Production.** Stuart runs the manual **Deploy to production** workflow in GitHub Actions for the approved commit. Merging never deploys to production by itself.

> [!NOTE]
> The production workflow is still to be built (#9), and the live site is still the old Next.js build on Vercel, which is frozen. Until the cut-over (#10), steps 1 to 3 work as described, and nothing reaches the live site.

## Rolling back

- **Staging:** revert the PR on GitHub (the PR page has a "Revert" button), and merge the revert PR. Staging redeploys without the change. For an immediate fix, open the `shabbatonchoir` project under Workers & Pages in the Cloudflare dashboard, find the previous staging deployment, and choose **Rollback to this deployment**.
- **Production:** run **Deploy to production** again for the last good commit. Cloudflare's **Rollback to this deployment** on a previous production deployment also works and is the quickest option. Then revert the bad change on `main`, so the next release doesn't bring it back.

## Hosting, DNS and email

- **Hosting:** Cloudflare Pages, project `shabbatonchoir`, as a Direct Upload project. GitHub Actions builds the site and deploys it with `wrangler pages deploy`. Cloudflare does not build from the repository itself. The workflows need the `CLOUDFLARE_API_TOKEN` secret and the `CLOUDFLARE_ACCOUNT_ID` variable in the repository's Actions settings.
- **Old hosting:** production is still on Vercel until the cut-over (#10). Its builds are switched off, so pushing to `main` doesn't change the live site.
- **Domain and DNS:** registered and managed at Squarespace. The cut-over changes only the `www` CNAME to point at Cloudflare Pages. Don't change the nameservers or MX records.
- **Email:** the `@shabbatonchoir.com` addresses are forwards set up in Squarespace, and depend on its nameservers and MX records. Moving the domain and email to Cloudflare is a separate, later job (#39).
