// Checks the branches a push is about to update, following CLAUDE.md:
// never push to main or staging, and keep branch names to 28 characters
// so the Cloudflare preview address isn't truncated.

const RESERVED = {
  main: 'Changes reach main only through a pull request.',
  staging: 'staging is reserved for the release flow.',
};
const MAX_LENGTH = 28;

/**
 * @param {string} input what git passes the pre-push hook on stdin: one
 *   "<local ref> <local sha> <remote ref> <remote sha>" line per ref
 * @returns {string[]} one error for each ref that can't be pushed
 */
export function checkPush(input) {
  return input
    .split('\n')
    .map((line) => line.trim().split(/\s+/)[2])
    .filter((ref) => ref?.startsWith('refs/heads/'))
    .map((ref) => ref.slice('refs/heads/'.length))
    .flatMap((branch) => {
      if (Object.hasOwn(RESERVED, branch)) {
        return [`Don't push to ${branch}. ${RESERVED[branch]}`];
      }
      if (branch.length > MAX_LENGTH) {
        return [
          `Branch "${branch}" is ${branch.length} characters. Keep it to ${MAX_LENGTH} or fewer.`,
        ];
      }
      return [];
    });
}
