import assert from 'node:assert/strict';
import test from 'node:test';

import {
  is_valid_popup_reference,
  parse_popup_definitions,
} from '../../src/core/popup/popup_definition.ts';

test('is_valid_popup_reference accepts only domain and two-part entry path', () => {
  assert.equal(is_valid_popup_reference('bash#command.ls'), true);
  assert.equal(is_valid_popup_reference('bash#command.ls_la'), true);
  assert.equal(is_valid_popup_reference('bash#command.ls.la'), false);
  assert.equal(is_valid_popup_reference('bash#command'), false);
});

test('parse_popup_definitions allows title to be omitted', () => {
  const result = parse_popup_definitions({
    file_path: 'src/content/sample/example.md',
    source_type: 'article',
    content: [
      '<!-- @popup bash#command.ls -->',
      '```bash',
      'ls -la',
      '```',
    ].join('\n'),
  });

  assert.equal(result.invalid_definitions.length, 0);
  assert.equal(result.definitions.length, 1);
  assert.equal(result.definitions[0].reference, 'bash#command.ls');
  assert.equal(result.definitions[0].title, undefined);
  assert.equal(result.definitions[0].language, 'bash');
  assert.equal(result.definitions[0].source.line, 1);
});

test('parse_popup_definitions skips invalid deep references without throwing', () => {
  const result = parse_popup_definitions({
    file_path: 'src/content/sample/example.md',
    source_type: 'article',
    content: [
      '<!-- @popup bash#command.ls.la title="Too deep" -->',
      '```bash',
      'ls -la',
      '```',
    ].join('\n'),
  });

  assert.equal(result.definitions.length, 0);
  assert.equal(result.invalid_definitions.length, 1);
  assert.equal(result.invalid_definitions[0].reason, 'invalid_reference_format');
});
