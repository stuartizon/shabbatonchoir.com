// Usage:
//   node scripts/check-commit-msg.js <file>   (the commit-msg hook)
//   echo "$TITLE" | node scripts/check-commit-msg.js   (the PR title check)
import { readFileSync } from 'node:fs';
import { checkCommitMessage } from './commit-message.js';

const [file] = process.argv.slice(2);
const message = readFileSync(file ?? 0, 'utf8');
const error = checkCommitMessage(message);

if (error) {
  console.error(`✖ ${error}`);
  process.exit(1);
}
