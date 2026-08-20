export function position_popup(target: HTMLElement): void {
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

export function close_popup(target: HTMLElement): void {
  target.setAttribute('data-popup-open', 'false');
}
