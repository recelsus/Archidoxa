import { strip_line_comments } from '../../core/popup/comment_parser.ts';
import type { PopupClientEntry, PopupOptions } from './types.ts';

export function to_popup_reference(href: string): string | null {
  if (!href.startsWith('popup:')) {
    return null;
  }

  return decodeURIComponent(href.slice('popup:'.length).split('?')[0] ?? '');
}

export function to_popup_options(href: string): PopupOptions {
  const query = href.split('?')[1] ?? '';
  const params = new URLSearchParams(query);
  const nocomment = params.has('nocomment');

  return {
    popup_nocomment: nocomment || params.has('popup_nocomment'),
    side_nocomment: nocomment || params.has('side_nocomment'),
  };
}

export function to_note_id(reference: string, options: PopupOptions): string {
  const option_suffixes = [];

  if (options.side_nocomment) {
    option_suffixes.push('side_nocomment');
  }

  return option_suffixes.length > 0 ? `${reference}?${option_suffixes.join('&')}` : reference;
}

export function to_display_entry(entry: PopupClientEntry, nocomment: boolean): PopupClientEntry {
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
