import { strip_line_comments } from '@/core/popup/comment_parser';

interface PopupClientEntry {
  title?: string;
  language?: string;
  content: string;
}

interface PopupOptions {
  popup_nocomment: boolean;
  side_nocomment: boolean;
}

interface NoteEntry {
  id: string;
  title: string;
  language?: string;
  content: string;
}

interface CreateNoteOptions {
  update_url: boolean;
  show_created_status: boolean;
  toggle_existing: boolean;
}

interface HighlightableCode {
  language?: string;
  content: string;
}

const notes_container = document.querySelector<HTMLElement>('[data_notes_container]');
const notes_status = document.querySelector<HTMLElement>('[data_notes_status]');
const clear_button = document.querySelector<HTMLButtonElement>('[data_clear_notes]');
const persisted_note_ids_key = 'archidoxa.side_note_ids';
let notes_status_timeout: number | undefined;

function get_note_targets(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data_note_id]'));
}

function read_popup_index(): Record<string, PopupClientEntry> {
  const element = document.querySelector<HTMLScriptElement>('#article_popup_index');

  if (!element?.textContent) {
    return {};
  }

  try {
    return JSON.parse(element.textContent) as Record<string, PopupClientEntry>;
  } catch {
    return {};
  }
}

const popup_index = read_popup_index();

function to_popup_reference(href: string): string | null {
  if (!href.startsWith('popup:')) {
    return null;
  }

  return decodeURIComponent(href.slice('popup:'.length).split('?')[0] ?? '');
}

function to_popup_options(href: string): PopupOptions {
  const query = href.split('?')[1] ?? '';
  const params = new URLSearchParams(query);
  const nocomment = params.has('nocomment');

  return {
    popup_nocomment: nocomment || params.has('popup_nocomment'),
    side_nocomment: nocomment || params.has('side_nocomment'),
  };
}

function to_note_id(reference: string, options: PopupOptions): string {
  const option_suffixes = [];

  if (options.side_nocomment) {
    option_suffixes.push('side_nocomment');
  }

  return option_suffixes.length > 0 ? `${reference}?${option_suffixes.join('&')}` : reference;
}

function to_display_entry(entry: PopupClientEntry, nocomment: boolean): PopupClientEntry {
  return {
    title: entry.title,
    language: entry.language,
    content: nocomment
      ? strip_line_comments({
          language: entry.language,
          content: entry.content,
        })
      : entry.content,
  };
}

function make_popup_target(link: HTMLAnchorElement): void {
  const href = link.getAttribute('href') ?? '';
  const reference = to_popup_reference(href);

  if (!reference) {
    return;
  }

  const entry = popup_index[reference];
  if (!entry) {
    link.setAttribute('data_missing_popup_reference', reference);
    return;
  }

  const popup_options = to_popup_options(href);
  const popup_entry = to_display_entry(entry, popup_options.popup_nocomment);
  const side_entry = to_display_entry(entry, popup_options.side_nocomment);
  const note_id = to_note_id(reference, popup_options);

  link.classList.add('annotation_target');
  link.setAttribute('role', 'button');
  link.setAttribute('tabindex', '0');
  link.setAttribute('href', `#popup-${reference.replace(/[^a-zA-Z0-9_-]+/g, '-')}`);
  link.setAttribute('data_note_id', note_id);
  link.setAttribute('data_note_title', side_entry.title ?? reference);
  link.setAttribute('data_note_content', side_entry.content);
  if (side_entry.language) {
    link.setAttribute('data_note_language', side_entry.language);
  }

  if (!link.querySelector('.annotation_popup')) {
    const popup = document.createElement('span');
    popup.className = 'annotation_popup';
    popup.setAttribute('role', 'tooltip');
    const code = document.createElement('code');
    append_highlighted_code(code, popup_entry);
    popup.append(code);
    link.append(popup);
  }
}

function to_note_entries_from_url(): string[] {
  const params = new URLSearchParams(window.location.search);
  return params.getAll('note');
}

function to_note_entries_from_storage(): string[] {
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

function to_unique_note_ids(note_ids: string[]): string[] {
  return [...new Set(note_ids.filter((note_id) => note_id.length > 0))];
}

function save_note_entries_to_storage(note_ids: string[]): void {
  try {
    window.localStorage.setItem(persisted_note_ids_key, JSON.stringify(to_unique_note_ids(note_ids)));
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}

function replace_note_url(note_ids: string[]): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('note');
  note_ids.forEach((id) => url.searchParams.append('note', id));
  window.history.replaceState({}, '', url);
}

function current_note_ids(): string[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data_side_note_id]')).map(
    (note) => note.getAttribute('data_side_note_id') ?? '',
  );
}

function update_notes_controls(): void {
  if (!notes_container) {
    return;
  }

  if (clear_button) {
    clear_button.hidden = notes_container.childElementCount === 0;
  }
}

function show_notes_status(message: string): void {
  if (!notes_status) {
    return;
  }

  notes_status.textContent = message;
  notes_status.hidden = false;

  window.clearTimeout(notes_status_timeout);
  notes_status_timeout = window.setTimeout(() => {
    notes_status.hidden = true;
    notes_status.textContent = '';
  }, 1600);
}

async function copy_text(text: string, button: HTMLButtonElement): Promise<void> {
  const original_label = button.textContent ?? 'copy';

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  button.textContent = 'copied';
  window.setTimeout(() => {
    button.textContent = original_label;
  }, 900);
}

async function copy_code_text(text: string, button: HTMLButtonElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  button.setAttribute('data-copy-state', 'copied');
  button.setAttribute('aria-label', 'コピーしました');
  window.setTimeout(() => {
    button.removeAttribute('data-copy-state');
    button.setAttribute('aria-label', 'コードをコピー');
  }, 900);
}

function bind_article_code_copy_buttons(): void {
  document.querySelectorAll<HTMLPreElement>('.article_content pre').forEach((pre) => {
    if (pre.querySelector('[data_copy_code]')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code_copy_button';
    button.setAttribute('data_copy_code', '');
    button.setAttribute('aria-label', 'コードをコピー');
    button.title = 'copy';
    button.textContent = '⧉';
    button.addEventListener('click', () => {
      void copy_code_text(pre.querySelector('code')?.textContent ?? pre.textContent ?? '', button);
    });

    pre.append(button);
  });
}

function make_note_entry(target: HTMLElement): NoteEntry {
  return {
    id: target.getAttribute('data_note_id') ?? '',
    title: target.getAttribute('data_note_title') ?? target.textContent?.trim() ?? 'Note',
    language: target.getAttribute('data_note_language') ?? undefined,
    content: target.getAttribute('data_note_content') ?? '',
  };
}

function make_note_entry_from_id(note_id: string): NoteEntry | null {
  const [reference, query = ''] = note_id.split('?');
  const entry = popup_index[reference];

  if (!entry) {
    return null;
  }

  const params = new URLSearchParams(query);
  const display_entry = to_display_entry(entry, params.has('side_nocomment'));

  return {
    id: note_id,
    title: display_entry.title ?? reference,
    language: display_entry.language,
    content: display_entry.content,
  };
}

function append_highlighted_bash_line(container: HTMLElement, line: string): void {
  const comment_index = line.indexOf('#');
  const command_part = comment_index >= 0 ? line.slice(0, comment_index) : line;
  const comment_part = comment_index >= 0 ? line.slice(comment_index) : '';
  const command_match = /^(\s*)([^\s]+)/.exec(command_part);

  if (!command_match) {
    container.append(document.createTextNode(command_part));
  } else {
    const [, leading_space, command] = command_match;
    container.append(document.createTextNode(leading_space));

    const command_span = document.createElement('span');
    command_span.className = 'syntax_command';
    command_span.textContent = command;
    container.append(command_span, document.createTextNode(command_part.slice(leading_space.length + command.length)));
  }

  if (comment_part.length > 0) {
    const comment_span = document.createElement('span');
    comment_span.className = 'syntax_comment';
    comment_span.textContent = comment_part;
    container.append(comment_span);
  }
}

function append_highlighted_code(container: HTMLElement, entry: HighlightableCode): void {
  const language = (entry.language ?? '').toLowerCase();

  if (!['bash', 'sh', 'shell', 'zsh'].includes(language)) {
    container.textContent = entry.content;
    return;
  }

  entry.content.split('\n').forEach((line, index) => {
    if (index > 0) {
      container.append(document.createTextNode('\n'));
    }
    append_highlighted_bash_line(container, line);
  });
}

function set_target_pinned(note_id: string, pinned: boolean): void {
  document.querySelectorAll<HTMLElement>(`[data_note_id="${CSS.escape(note_id)}"]`).forEach((target) => {
    target.setAttribute('data_is_pinned', pinned ? 'true' : 'false');
  });
}

function remove_note(note_id: string): void {
  document.querySelector<HTMLElement>(`[data_side_note_id="${CSS.escape(note_id)}"]`)?.remove();
  set_target_pinned(note_id, false);
  replace_note_url(current_note_ids());
  save_note_entries_to_storage(current_note_ids());
  update_notes_controls();
}

function bind_note_drag(note: HTMLElement, header: HTMLElement): void {
  header.setAttribute('draggable', 'true');
  header.setAttribute('aria-label', 'ドラッグしてサイドノートを並べ替え');

  header.addEventListener('dragstart', (event) => {
    note.setAttribute('data_dragging', 'true');
    event.dataTransfer?.setData('text/plain', note.getAttribute('data_side_note_id') ?? '');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  });

  header.addEventListener('dragend', () => {
    note.setAttribute('data_dragging', 'false');
    document.querySelectorAll<HTMLElement>('[data_drop_position]').forEach((item) => {
      item.removeAttribute('data_drop_position');
    });
    replace_note_url(current_note_ids());
    save_note_entries_to_storage(current_note_ids());
  });

  note.addEventListener('dragover', (event) => {
    const dragging_note = document.querySelector<HTMLElement>('[data_dragging="true"]');
    if (!dragging_note || dragging_note === note) {
      return;
    }

    event.preventDefault();
    const rect = note.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    note.setAttribute('data_drop_position', position);
  });

  note.addEventListener('dragleave', () => {
    note.removeAttribute('data_drop_position');
  });

  note.addEventListener('drop', (event) => {
    const dragging_note = document.querySelector<HTMLElement>('[data_dragging="true"]');
    if (!dragging_note || dragging_note === note || !notes_container) {
      return;
    }

    event.preventDefault();
    const rect = note.getBoundingClientRect();
    const should_insert_before = event.clientY < rect.top + rect.height / 2;
    notes_container.insertBefore(dragging_note, should_insert_before ? note : note.nextSibling);
    note.removeAttribute('data_drop_position');
    replace_note_url(current_note_ids());
    save_note_entries_to_storage(current_note_ids());
  });
}

function create_note(entry: NoteEntry, options: CreateNoteOptions): void {
  if (!notes_container || entry.id.length === 0) {
    return;
  }

  const existing_note = document.querySelector<HTMLElement>(`[data_side_note_id="${CSS.escape(entry.id)}"]`);
  if (existing_note) {
    if (options.toggle_existing) {
      remove_note(entry.id);
      show_notes_status('Removed from side notes');
      return;
    }

    existing_note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }

  const note = document.createElement('section');
  note.className = 'side_note';
  note.setAttribute('data_side_note_id', entry.id);

  const header = document.createElement('header');
  header.className = 'side_note_header';

  const title = document.createElement('span');
  title.className = 'side_note_title';
  title.textContent = entry.title;

  const actions = document.createElement('div');
  actions.className = 'side_note_actions';

  const copy_button = document.createElement('button');
  copy_button.type = 'button';
  copy_button.className = 'side_note_button';
  copy_button.textContent = 'copy';
  copy_button.setAttribute('aria-label', `${entry.title}をコピー`);
  copy_button.addEventListener('click', () => {
    void copy_text(entry.content, copy_button);
  });

  const close_button = document.createElement('button');
  close_button.type = 'button';
  close_button.className = 'side_note_button';
  close_button.textContent = 'x';
  close_button.setAttribute('aria-label', `${entry.title}を削除`);
  close_button.addEventListener('click', () => remove_note(entry.id));

  const content = document.createElement('pre');
  content.className = 'side_note_content';
  if (entry.language) {
    content.setAttribute('data-language', entry.language);
  }

  const code = document.createElement('code');
  append_highlighted_code(code, entry);
  content.append(code);

  actions.append(copy_button, close_button);
  header.append(title, actions);
  note.append(header, content);
  bind_note_drag(note, header);
  notes_container.append(note);
  set_target_pinned(entry.id, true);

  if (options.update_url) {
    replace_note_url(current_note_ids());
  }
  save_note_entries_to_storage(current_note_ids());

  update_notes_controls();
  note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  if (options.show_created_status) {
    show_notes_status('Pinned to side notes');
  }
}

function position_popup(target: HTMLElement): void {
  const popup = target.querySelector<HTMLElement>('.annotation_popup');
  if (!popup) {
    return;
  }

  target.setAttribute('data-popup-open', 'false');
  const target_rect = target.getBoundingClientRect();
  const viewport_gap = 10;
  const target_gap = 5;
  popup.style.maxWidth = `${Math.max(220, window.innerWidth - viewport_gap * 2)}px`;

  const popup_rect = popup.getBoundingClientRect();
  let left = target_rect.left;
  let top = target_rect.bottom + target_gap;

  if (left + popup_rect.width > window.innerWidth - viewport_gap) {
    left = window.innerWidth - popup_rect.width - viewport_gap;
  }

  if (left < viewport_gap) {
    left = viewport_gap;
  }

  if (top + popup_rect.height > window.innerHeight - viewport_gap) {
    top = target_rect.top - popup_rect.height - target_gap;
  }

  if (top < viewport_gap) {
    top = viewport_gap;
  }

  popup.style.left = `${Math.round(left)}px`;
  popup.style.top = `${Math.round(top)}px`;
  target.setAttribute('data-popup-open', 'true');
}

function close_popup(target: HTMLElement): void {
  target.setAttribute('data-popup-open', 'false');
}

bind_article_code_copy_buttons();
document.querySelectorAll<HTMLAnchorElement>('a[href^="popup:"]').forEach(make_popup_target);

get_note_targets().forEach((target) => {
  target.addEventListener('mouseenter', () => position_popup(target));
  target.addEventListener('focusin', () => position_popup(target));
  target.addEventListener('mouseleave', () => close_popup(target));
  target.addEventListener('focusout', () => close_popup(target));

  target.addEventListener('click', (event) => {
    if (window.getSelection()?.toString()) {
      return;
    }

    event.preventDefault();
    create_note(make_note_entry(target), {
      update_url: true,
      show_created_status: true,
      toggle_existing: true,
    });
  });

  target.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    create_note(make_note_entry(target), {
      update_url: true,
      show_created_status: true,
      toggle_existing: true,
    });
  });
});

document.addEventListener('pointerover', (event) => {
  const target = (event.target as Element | null)?.closest<HTMLElement>('[data_note_id]');
  if (target) {
    position_popup(target);
  }
});

document.addEventListener('click', (event) => {
  const target = (event.target as Element | null)?.closest<HTMLElement>('[data_note_id]');
  if (!target || event.defaultPrevented || window.getSelection()?.toString()) {
    return;
  }

  event.preventDefault();
  create_note(make_note_entry(target), {
    update_url: true,
    show_created_status: true,
    toggle_existing: true,
  });
});

clear_button?.addEventListener('click', () => {
  notes_container?.replaceChildren();
  get_note_targets().forEach((target) => {
    target.setAttribute('data_is_pinned', 'false');
  });
  replace_note_url([]);
  save_note_entries_to_storage([]);
  update_notes_controls();
});

to_unique_note_ids([...to_note_entries_from_storage(), ...to_note_entries_from_url()]).forEach((note_id) => {
  const target = document.querySelector<HTMLElement>(`[data_note_id="${CSS.escape(note_id)}"]`);
  const note_entry = target ? make_note_entry(target) : make_note_entry_from_id(note_id);

  if (note_entry) {
    create_note(note_entry, {
      update_url: false,
      show_created_status: false,
      toggle_existing: false,
    });
  }
});

save_note_entries_to_storage(current_note_ids());

window.addEventListener('resize', () => {
  const active_target = document.querySelector<HTMLElement>('.annotation_target:hover, .annotation_target:focus-within');
  if (active_target) {
    position_popup(active_target);
  }
});

update_notes_controls();
