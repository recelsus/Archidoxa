export interface PopupClientEntry {
  title?: string;
  language?: string;
  content: string;
}

export interface PopupOptions {
  popup_nocomment: boolean;
  side_nocomment: boolean;
}

export interface NoteEntry {
  id: string;
  title: string;
  language?: string;
  content: string;
}

export interface CreateNoteOptions {
  update_url: boolean;
  show_created_status: boolean;
  toggle_existing: boolean;
}

export interface HighlightableCode {
  language?: string;
  content: string;
}
