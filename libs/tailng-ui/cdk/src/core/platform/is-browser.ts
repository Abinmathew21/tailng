export function isBrowser(value: unknown = globalThis): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const maybeBrowser = value as { document?: unknown; window?: unknown };
  return maybeBrowser.window !== undefined && maybeBrowser.document !== undefined;
}
