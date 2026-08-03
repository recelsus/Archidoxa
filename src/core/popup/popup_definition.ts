export interface PopupDefinition {
  reference: string;
  index_name: string;
  entry_path: string;
  title?: string;
  language?: string;
  content: string;
  source: {
    file_path: string;
    line: number;
    source_type: 'article' | 'definition';
  };
}

export interface InvalidPopupDefinition {
  reference: string | null;
  reason: string;
  source: {
    file_path: string;
    line: number;
    source_type: 'article' | 'definition';
  };
}

export interface PopupDefinitionParseResult {
  definitions: PopupDefinition[];
  invalid_definitions: InvalidPopupDefinition[];
}

export interface ParsePopupDefinitionsOptions {
  file_path: string;
  source_type: 'article' | 'definition';
  content: string;
}

interface PopupComment {
  reference: string;
  title?: string;
}

const popup_comment_pattern = /^<!--\s*@popup\s+([^\s]+)(.*?)\s*-->$/;
const fence_start_pattern = /^(```+|~~~+)\s*([^\s`]*)?.*$/;

export function is_valid_popup_reference(reference: string): boolean {
  return /^[a-z][a-z0-9_]*#[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/.test(reference);
}

function to_popup_reference_parts(reference: string): {
  index_name: string;
  entry_path: string;
} {
  const [index_name, entry_path] = reference.split('#');

  return {
    index_name,
    entry_path,
  };
}

function parse_popup_comment(line: string): PopupComment | null {
  const match = popup_comment_pattern.exec(line.trim());

  if (!match) {
    return null;
  }

  const [, reference, raw_attributes] = match;
  const title_match = /\btitle="([^"]*)"/.exec(raw_attributes);

  return {
    reference,
    ...(title_match ? { title: title_match[1] } : {}),
  };
}

function find_code_fence(lines: string[], start_index: number): {
  line_index: number;
  marker: string;
  language?: string;
} | null {
  for (let index = start_index; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.trim().length === 0) {
      continue;
    }

    const match = fence_start_pattern.exec(line);
    if (!match) {
      return null;
    }

    return {
      line_index: index,
      marker: match[1],
      ...(match[2] ? { language: match[2] } : {}),
    };
  }

  return null;
}

function read_fenced_code(lines: string[], fence: { line_index: number; marker: string }): {
  content: string;
  line_end: number;
} | null {
  const close_pattern = new RegExp(`^${fence.marker[0].repeat(fence.marker.length)}\\s*$`);
  const code_lines: string[] = [];

  for (let index = fence.line_index + 1; index < lines.length; index += 1) {
    if (close_pattern.test(lines[index])) {
      return {
        content: code_lines.join('\n'),
        line_end: index + 1,
      };
    }

    code_lines.push(lines[index]);
  }

  return null;
}

export function parse_popup_definitions(options: ParsePopupDefinitionsOptions): PopupDefinitionParseResult {
  const lines = options.content.split(/\r?\n/);
  const definitions: PopupDefinition[] = [];
  const invalid_definitions: InvalidPopupDefinition[] = [];

  lines.forEach((line, index) => {
    const comment = parse_popup_comment(line);
    if (!comment) {
      return;
    }

    const source = {
      file_path: options.file_path,
      line: index + 1,
      source_type: options.source_type,
    };

    if (!is_valid_popup_reference(comment.reference)) {
      invalid_definitions.push({
        reference: comment.reference,
        reason: 'invalid_reference_format',
        source,
      });
      return;
    }

    const fence = find_code_fence(lines, index + 1);
    if (!fence) {
      invalid_definitions.push({
        reference: comment.reference,
        reason: 'missing_code_fence',
        source,
      });
      return;
    }

    const code = read_fenced_code(lines, fence);
    if (!code || code.content.trim().length === 0) {
      invalid_definitions.push({
        reference: comment.reference,
        reason: 'empty_or_unclosed_code_fence',
        source,
      });
      return;
    }

    const parts = to_popup_reference_parts(comment.reference);
    definitions.push({
      reference: comment.reference,
      index_name: parts.index_name,
      entry_path: parts.entry_path,
      ...(comment.title ? { title: comment.title } : {}),
      ...(fence.language ? { language: fence.language } : {}),
      content: code.content,
      source,
    });
  });

  return {
    definitions,
    invalid_definitions,
  };
}
