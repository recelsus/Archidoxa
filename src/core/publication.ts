export interface PublishableContent {
  status: 'draft' | 'public' | 'hidden';
  pub_date: Date;
}

export function is_public_entry(entry: PublishableContent, build_time: Date): boolean {
  return entry.status === 'public' && entry.pub_date.getTime() <= build_time.getTime();
}
