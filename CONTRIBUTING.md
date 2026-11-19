# Contributing

This site is maintained by Stuart, with Claude doing much of the implementation. This file holds the practical workflow. `CLAUDE.md` holds the project context and the conventions (commits, TDD, privacy and so on), and `README.md` covers what the project is and how to run it.

## Who does what

- **Claude** picks up issues from the roadmap (#1), works on a branch and opens PRs. It raises questions on the issue rather than guessing.
- **Stuart** reviews and squash-merges PRs, liaises with the choir committee, and runs the production deploy.
- **The choir committee** supplies content and visually signs off on staging before anything goes live. They don't work in GitHub. Their answers get recorded on the relevant issue (labelled `needs client`).

## Workflow

1. **Pick an issue** from the roadmap, in phase order. If it's labelled `needs client`, check the answer is on the issue first.
2. **Branch** from an up-to-date `main`.
3. **Work in small commits**, test-first where there's behaviour to test. Use gitmoji messages (see `CLAUDE.md`).
4. **Run the checks** before pushing. For now that's `yarn lint` and `yarn build`. After the Astro port (#2) and the tooling work (#41), the README will list the commands and a pre-push hook will run them.
5. **Open a PR:**
   - Give it a gitmoji title, because that becomes the commit on `main`.
   - Add `Closes #N` and fill in the template.
   - Include screenshots for anything visual.
6. **Review on the PR preview link**, then squash-merge. Merging deploys to **staging**, not to the live site.

## Releasing

1. Share the staging link with the committee and get their OK (by email or WhatsApp is fine).
2. Note the approval on the issue or PR.
3. Run the **"Deploy to production"** workflow for the approved commit (#9).

Until the cut-over (#10), production is the frozen Vercel deployment and none of this reaches it.

## Handling content from the committee

- Save the original text and files outside the repo, and summarise what changed on the issue. Leave out personal contact details.
- Copy their text as written. Spot inconsistencies and put them back to them as questions, rather than fixing them silently.
- Resize and compress images before committing them, to no more than about 2000px wide.
- Don't publish photos of under-18s until written parental consent is confirmed.
