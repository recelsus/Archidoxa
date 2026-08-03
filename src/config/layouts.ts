export const layout_defaults = {
  list_layout: 'card',
  entry_layout: 'article',
} as const;

export const list_layout_keys = ['card', 'compact'] as const;
export const entry_layout_keys = ['article', 'memo'] as const;

export const list_layout_registry = Object.fromEntries(list_layout_keys.map((key) => [key, true]));
export const entry_layout_registry = Object.fromEntries(entry_layout_keys.map((key) => [key, true]));
