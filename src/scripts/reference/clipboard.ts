async function write_clipboard_text(text: string): Promise<void> {
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
}

export async function copy_text(text: string, button: HTMLButtonElement): Promise<void> {
  const original_label = button.textContent ?? 'copy';

  await write_clipboard_text(text);

  button.textContent = 'copied';
  window.setTimeout(() => {
    button.textContent = original_label;
  }, 900);
}

export async function copy_code_text(text: string, button: HTMLButtonElement): Promise<void> {
  await write_clipboard_text(text);

  button.setAttribute('data-copy-state', 'copied');
  button.setAttribute('aria-label', 'コピーしました');
  window.setTimeout(() => {
    button.removeAttribute('data-copy-state');
    button.setAttribute('aria-label', 'コードをコピー');
  }, 900);
}
