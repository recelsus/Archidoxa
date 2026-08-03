import assert from 'node:assert/strict';
import test from 'node:test';

import { resolve_layout } from '../../src/core/resolve_layout.ts';

test('resolve_layout falls back when requested layout is blank', () => {
  assert.deepEqual(resolve_layout(' ', 'card', { card: true }), {
    requested_layout: null,
    resolved_layout: 'card',
    used_fallback: true,
  });
});

test('resolve_layout rejects an unregistered default layout', () => {
  assert.throws(() => resolve_layout('unknown', 'card', {}), /Default layout is not registered/);
});
