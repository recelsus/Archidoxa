export interface StripLineCommentOptions {
  language: string | null | undefined;
  content: string;
}

function is_hash_comment_language(language: string | null | undefined): boolean {
  return ['bash', 'sh', 'shell', 'zsh'].includes((language ?? '').toLowerCase());
}

function strip_hash_comment_from_line(line: string): string {
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === '\\') {
      escaped = true;
      continue;
    }

    if (quote !== null) {
      if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '#') {
      return line.slice(0, index).trimEnd();
    }
  }

  return line;
}

export function strip_line_comments(options: StripLineCommentOptions): string {
  if (!is_hash_comment_language(options.language)) {
    return options.content;
  }

  return options.content
    .split(/\r?\n/)
    .map((line) => strip_hash_comment_from_line(line))
    .join('\n')
    .trimEnd();
}
