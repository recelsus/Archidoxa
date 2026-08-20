const persisted_note_ids_key = 'archidoxa.side_note_ids';

export function to_note_entries_from_url(): string[] {
  const params = new URLSearchParams(window.location.search);
  return params.getAll('note');
}

export function to_note_entries_from_storage(): string[] {
  try {
    const value = window.localStorage.getItem(persisted_note_ids_key);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function to_unique_note_ids(note_ids: string[]): string[] {
  return [...new Set(note_ids.filter((note_id) => note_id.length > 0))];
}

export function save_note_entries_to_storage(note_ids: string[]): void {
  try {
    window.localStorage.setItem(persisted_note_ids_key, JSON.stringify(to_unique_note_ids(note_ids)));
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}

export function replace_note_url(note_ids: string[]): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('note');
  note_ids.forEach((id) => url.searchParams.append('note', id));
  window.history.replaceState({}, '', url);
}
