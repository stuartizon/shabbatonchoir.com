// The pre-push hook's branch check. git passes the refs on stdin.
import { readFileSync } from 'node:fs';
import { checkPush } from './push-check.js';

const errors = checkPush(readFileSync(0, 'utf8'));

if (errors.length > 0) {
  for (const error of errors) console.error(`✖ ${error}`);
  console.error('In an emergency, bypass the hooks with git push --no-verify.');
  process.exit(1);
}
