import assert from 'node:assert/strict';
import test from 'node:test';

import { to_tag_href } from '../../src/core/routes.ts';

test('to_tag_href builds all search links for tags', () => {
  assert.equal(to_tag_href('popup'), '/all/1/?q=%23popup');
});

test('to_tag_href encodes tags for URLs', () => {
  assert.equal(to_tag_href('long title'), '/all/1/?q=%23long%20title');
});
