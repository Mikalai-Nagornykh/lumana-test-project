export async function logPerformance<T>(
  label: string,
  fn: () => Promise<T> | T,
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  console.info(`[${label}] took ${(end - start).toFixed(2)} ms`);
  return result;
}
