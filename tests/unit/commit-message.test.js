import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkCommitMessage } from '../../scripts/commit-message.js';

const ok = (message) => assert.equal(checkCommitMessage(message), null);
const fails = (message, pattern) =>
  assert.match(checkCommitMessage(message) ?? '', pattern);

describe('checkCommitMessage', () => {
  it('accepts an emoji, a space and a summary', () => {
    ok('✨ Add events page');
  });

  it('accepts emoji with a variation selector', () => {
    ok('♻️ Port site from Next.js to Astro');
    ok('⬆️ Upgrade Prettier');
  });

  it('only checks the first line', () => {
    ok(
      '🐛 Fix the menu\n\nA body that can be as long as it likes, and has no emoji.',
    );
  });

  it('ignores git comment lines', () => {
    ok('# Please enter the commit message\n💄 Tidy the footer\n# comment');
  });

  it('accepts messages that git writes itself', () => {
    ok("Merge branch 'main' into mobile-menu");
    ok('Revert "✨ Add events page"');
    ok('fixup! ✨ Add events page');
    ok('squash! ✨ Add events page');
    ok('amend! ✨ Add events page');
  });

  it('rejects a message with no emoji', () => {
    fails('Add events page', /start with a gitmoji/);
  });

  it('rejects the :code: form and suggests the Unicode emoji', () => {
    fails(':sparkles: Add events page', /Unicode emoji/);
  });

  it('rejects an emoji with no space after it', () => {
    fails('✨Add events page', /space/);
  });

  it('rejects an emoji with no summary', () => {
    fails('✨ ', /summary/);
    fails('✨', /summary/);
  });

  it('rejects an empty message', () => {
    fails('', /empty/);
    fails('# only a comment\n', /empty/);
  });

  it('rejects a summary longer than 72 characters', () => {
    const summary = 'a'.repeat(71);
    ok(`✨ ${'a'.repeat(70)}`);
    fails(`✨ ${summary}`, /72/);
  });
});
