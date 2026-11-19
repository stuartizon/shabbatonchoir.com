// Checks that a commit message (or PR title) follows the gitmoji style in
// CLAUDE.md: "<emoji> <imperative summary>", 72 characters or fewer.

const MAX_LENGTH = 72;

// Messages that git writes itself, which shouldn't need an emoji.
const GIT_GENERATED = /^(Merge |Revert "|fixup! |squash! |amend! )/;

// One emoji: a pictograph, optionally with a variation selector or skin
// tone, and optionally joined to more pictographs with a ZWJ.
const EMOJI =
  /^\p{Extended_Pictographic}[\u{FE0F}\p{Emoji_Modifier}]*(\u{200D}\p{Extended_Pictographic}[\u{FE0F}\p{Emoji_Modifier}]*)*/u;

const graphemes = (text) =>
  [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)]
    .length;

/**
 * Returns null if the message is fine, or an error explaining what's wrong.
 * @param {string} message
 * @returns {string | null}
 */
export function checkCommitMessage(message) {
  const summary = message
    .split('\n')
    .find((line) => !line.startsWith('#') && line.trim() !== '');

  if (summary === undefined) return 'The commit message is empty.';
  if (GIT_GENERATED.test(summary)) return null;

  if (/^:[a-z0-9_+-]+:/.test(summary)) {
    return 'Use the Unicode emoji (e.g. ✨), not the :code: form.';
  }

  const emoji = summary.match(EMOJI)?.[0];
  if (emoji === undefined) {
    return 'The summary must start with a gitmoji, e.g. "✨ Add events page". See https://gitmoji.dev';
  }

  const rest = summary.slice(emoji.length);
  if (rest.trim() === '') return 'Add a summary after the emoji.';
  if (!rest.startsWith(' ')) return 'Put a space after the emoji.';

  if (graphemes(summary) > MAX_LENGTH) {
    return `Keep the summary to ${MAX_LENGTH} characters or fewer (it's ${graphemes(summary)}).`;
  }

  return null;
}
