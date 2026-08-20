import assert from 'node:assert/strict';
import test from 'node:test';

import { create_content_page_service } from '../../src/application/content/content_page_service.ts';

function make_entry(id, data) {
  return {
    id,
    data: {
      description: null,
      status: 'public',
      tags: [],
      ...data,
    },
  };
}

function make_repository(entries_by_section) {
  return {
    async list_entries(section_name) {
      return entries_by_section[section_name] ?? [];
    },
    async get_entry(section_name, entry_id) {
      return entries_by_section[section_name]?.find((entry) => entry.id === entry_id) ?? null;
    },
  };
}

test('content page service builds collection view models without depending on Astro content', async () => {
  const service = create_content_page_service({
    build_time: new Date('2026-08-21T00:00:00Z'),
    repository: make_repository({
      sample: [
        make_entry('older', {
          title: 'Older entry',
          pub_date: new Date('2026-08-19T00:00:00Z'),
          tags: ['reference'],
        }),
        make_entry('newer', {
          title: 'Newer entry',
          description: 'Visible entry',
          pub_date: new Date('2026-08-20T00:00:00Z'),
          tags: ['popup'],
        }),
        make_entry('future', {
          title: 'Future entry',
          pub_date: new Date('2026-08-22T00:00:00Z'),
          tags: ['hidden'],
        }),
      ],
    }),
  });

  const page = await service.get_collection_page({ section_name: 'sample', page: 1 });

  assert.equal(page.section.name, 'sample');
  assert.deepEqual(
    page.entries.map((entry) => entry.title),
    ['Newer entry', 'Older entry'],
  );
  assert.deepEqual(
    page.search_entries.map((entry) => entry.title),
    ['Newer entry', 'Older entry'],
  );
  assert.equal(page.entries[0].href, '/sample/newer/');
  assert.equal(page.entries[0].tags[0].href, '/all/1/?q=%23popup');
});

test('content page service rejects entries that are not public at build time', async () => {
  const service = create_content_page_service({
    build_time: new Date('2026-08-21T00:00:00Z'),
    repository: make_repository({
      sample: [
        make_entry('future', {
          title: 'Future entry',
          pub_date: new Date('2026-08-22T00:00:00Z'),
        }),
      ],
    }),
  });

  await assert.rejects(
    () => service.get_entry_page({ section_name: 'sample', entry_id: 'future' }),
    /Unknown public entry: sample\/future/,
  );
});
