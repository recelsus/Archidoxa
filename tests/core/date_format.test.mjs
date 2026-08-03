import assert from 'node:assert/strict';
import test from 'node:test';

import { to_yyyy_mm_dd } from '../../src/core/date_format.ts';

test('formats dates with zero padded month and day', () => {
  assert.equal(to_yyyy_mm_dd(new Date('2026-08-02T00:00:00.000Z')), '2026/08/02');
});
