import assert from 'node:assert/strict';
import test from 'node:test';

import { to_entry_href, to_site_href, to_tag_href } from '../../src/core/routes.ts';

test('to_tag_href builds all search links for tags', () => {
  assert.equal(to_tag_href('popup'), '/all/1/?q=%23popup');
});

test('to_tag_href encodes tags for URLs', () => {
  assert.equal(to_tag_href('long title'), '/all/1/?q=%23long%20title');
});

test('route helpers prefix configured base path', () => {
  const original_base_path = process.env.PUBLIC_BASE_PATH;
  process.env.PUBLIC_BASE_PATH = '/Archidoxa/';

  try {
    assert.equal(to_site_href('/about/'), '/Archidoxa/about/');
    assert.equal(to_entry_href('sample', 'welcome'), '/Archidoxa/sample/welcome/');
    assert.equal(to_tag_href('popup'), '/Archidoxa/all/1/?q=%23popup');
  } finally {
    if (original_base_path === undefined) {
      delete process.env.PUBLIC_BASE_PATH;
    } else {
      process.env.PUBLIC_BASE_PATH = original_base_path;
    }
  }
});
