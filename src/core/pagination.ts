export type PaginationItem =
  | {
      type: 'page';
      page: number;
      href: string;
      current: boolean;
    }
  | {
      type: 'ellipsis';
      key: string;
    };

export interface PaginationViewModel {
  current_page: number;
  total_pages: number;
  total_items: number;
  previous: {
    href: string;
    label: string;
  } | null;
  next: {
    href: string;
    label: string;
  } | null;
  items: PaginationItem[];
}

export interface MakePaginationOptions {
  current_page: number;
  total_items: number;
  page_size: number;
  sibling_count: number;
  make_href: (page: number) => string;
}

function clamp_page(page: number, total_pages: number): number {
  return Math.min(Math.max(page, 1), Math.max(total_pages, 1));
}

function to_page_numbers(current_page: number, total_pages: number, sibling_count: number): number[] {
  const pages = new Set<number>([1, total_pages]);
  const start_page = Math.max(1, current_page - sibling_count);
  const end_page = Math.min(total_pages, current_page + sibling_count);

  for (let page = start_page; page <= end_page; page += 1) {
    pages.add(page);
  }

  return Array.from(pages).sort((left, right) => left - right);
}

export function make_pagination(options: MakePaginationOptions): PaginationViewModel {
  const page_size = Math.max(1, options.page_size);
  const total_pages = Math.max(1, Math.ceil(options.total_items / page_size));
  const current_page = clamp_page(options.current_page, total_pages);
  const page_numbers = to_page_numbers(current_page, total_pages, Math.max(0, options.sibling_count));
  const items: PaginationItem[] = [];

  page_numbers.forEach((page, index) => {
    const previous_page = page_numbers[index - 1];
    if (previous_page !== undefined && page - previous_page > 1) {
      items.push({ type: 'ellipsis', key: `${previous_page}-${page}` });
    }

    items.push({
      type: 'page',
      page,
      href: options.make_href(page),
      current: page === current_page,
    });
  });

  return {
    current_page,
    total_pages,
    total_items: options.total_items,
    previous:
      current_page > 1
        ? {
            href: options.make_href(current_page - 1),
            label: 'Previous',
          }
        : null,
    next:
      current_page < total_pages
        ? {
            href: options.make_href(current_page + 1),
            label: 'Next',
          }
        : null,
    items,
  };
}
