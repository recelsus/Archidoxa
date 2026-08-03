export const layout_defaults = {
  list_layout: 'card',
} as const;

export const list_layout_keys = ['card', 'compact'] as const;

export const list_layout_registry = Object.fromEntries(list_layout_keys.map((key) => [key, true]));
