import assert from 'node:assert/strict';
import test from 'node:test';

import { strip_line_comments } from '../../src/core/popup/comment_parser.ts';

test('strip_line_comments removes bash hash comments', () => {
  assert.equal(
    strip_line_comments({
      language: 'bash',
      content: 'ls # list directory contents',
    }),
    'ls',
  );
});

test('strip_line_comments keeps hashes inside quoted strings', () => {
  assert.equal(
    strip_line_comments({
      language: 'bash',
      content: 'printf "# not a comment" # comment',
    }),
    'printf "# not a comment"',
  );
});

test('strip_line_comments leaves unsupported languages unchanged', () => {
  assert.equal(
    strip_line_comments({
      language: 'text',
      content: 'value # not parsed',
    }),
    'value # not parsed',
  );
});
