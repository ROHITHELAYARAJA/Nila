export async function commitAndRefresh<T>(
  commit: () => Promise<T>,
  refresh: () => Promise<void>,
): Promise<T> {
  const result = await commit();
  void refresh().catch(() => {});
  return result;
}
