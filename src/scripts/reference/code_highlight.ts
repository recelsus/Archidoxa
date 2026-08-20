import type { HighlightableCode } from './types.ts';

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

export function append_highlighted_code(container: HTMLElement, entry: HighlightableCode): void {
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
