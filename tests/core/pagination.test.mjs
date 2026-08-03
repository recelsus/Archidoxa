import assert from 'node:assert/strict';
import test from 'node:test';

import { make_pagination } from '../../src/core/pagination.ts';

test('make_pagination shows first last and current sibling pages', () => {
  const model = make_pagination({
    current_page: 5,
    total_items: 100,
    page_size: 10,
    sibling_count: 1,
    make_href: (page) => `/sample/${page}/`,
  });

  assert.deepEqual(
    model.items.map((item) => (item.type === 'page' ? item.page : '...')),
    [1, '...', 4, 5, 6, '...', 10],
  );
});
