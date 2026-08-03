export function to_stable_number(value: string): number {
  let result = 0;

  for (const char of value) {
    result = (result * 31 + char.charCodeAt(0)) >>> 0;
  }

  return result;
}

export function to_stable_index(value: string, size: number): number {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('Stable index size must be a positive integer.');
  }

  return to_stable_number(value) % size;
}
