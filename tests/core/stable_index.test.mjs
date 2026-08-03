import assert from 'node:assert/strict';
import test from 'node:test';

import { to_stable_index, to_stable_number } from '../../src/core/stable_index.ts';

test('to_stable_index returns the same index for the same value', () => {
  assert.equal(to_stable_index('/sample/welcome/', 10), to_stable_index('/sample/welcome/', 10));
});

test('to_stable_index keeps the value inside the requested range', () => {
  const index = to_stable_index('/guides/navigation-flow/', 10);

  assert.equal(Number.isInteger(index), true);
  assert.equal(index >= 0, true);
  assert.equal(index < 10, true);
});

test('to_stable_index rejects an empty image set', () => {
  assert.throws(() => to_stable_index('/sample/welcome/', 0), /positive integer/);
});

test('to_stable_number changes when the source value changes', () => {
  assert.notEqual(to_stable_number('/sample/welcome/'), to_stable_number('/sample/memo/'));
});
