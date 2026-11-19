import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkPush } from '../../scripts/push-check.js';

const SHA = 'a'.repeat(40);
const ZERO = '0'.repeat(40);
// git gives the pre-push hook one line per ref being pushed.
const line = (remoteRef, localSha = SHA) =>
  `refs/heads/local ${localSha} ${remoteRef} ${ZERO}`;

describe('checkPush', () => {
  it('allows pushing a descriptive branch', () => {
    assert.deepEqual(checkPush(line('refs/heads/mobile-menu')), []);
  });

  it('allows pushing nothing', () => {
    assert.deepEqual(checkPush(''), []);
  });

  it('blocks pushing to main', () => {
    const [error] = checkPush(line('refs/heads/main'));
    assert.match(error, /main/);
    assert.match(error, /pull request/);
  });

  it('blocks deleting main', () => {
    assert.equal(checkPush(line('refs/heads/main', ZERO)).length, 1);
  });

  it('blocks pushing to staging, which is reserved for the release flow', () => {
    assert.match(checkPush(line('refs/heads/staging'))[0], /staging/);
  });

  it('blocks branch names longer than 28 characters', () => {
    assert.deepEqual(checkPush(line(`refs/heads/${'a'.repeat(28)}`)), []);
    assert.match(checkPush(line(`refs/heads/${'a'.repeat(29)}`))[0], /28/);
  });

  it('ignores tags', () => {
    assert.deepEqual(checkPush(line(`refs/tags/v${'1'.repeat(40)}`)), []);
  });

  it('checks every ref in the push', () => {
    const input = [line('refs/heads/ok'), line('refs/heads/main')].join('\n');
    assert.equal(checkPush(input).length, 1);
  });
});
