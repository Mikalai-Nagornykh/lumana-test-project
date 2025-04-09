export function extractSearchTokens(search: string): string[] {
  return search
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 1);
}
