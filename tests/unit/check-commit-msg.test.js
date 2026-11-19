import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const script = new URL('../../scripts/check-commit-msg.js', import.meta.url)
  .pathname;

const run = (args, input) =>
  spawnSync(process.execPath, [script, ...args], { input, encoding: 'utf8' });

const messageFile = (text) => {
  const file = join(mkdtempSync(join(tmpdir(), 'msg-')), 'COMMIT_EDITMSG');
  writeFileSync(file, text);
  return file;
};

describe('check-commit-msg', () => {
  it('passes a good message file (the commit-msg hook)', () => {
    const result = run([messageFile('✨ Add events page\n')]);
    assert.equal(result.status, 0);
  });

  it('fails a bad message file and says why', () => {
    const result = run([messageFile('Add events page\n')]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /gitmoji/);
  });

  it('reads the message from stdin when given no file (the PR title check)', () => {
    assert.equal(run([], '🐛 Fix the menu').status, 0);
    assert.equal(run([], 'Fix the menu').status, 1);
  });
});
