export type TngSelectListboxApi = Readonly<{
  getHostId: () => string | null;
  getActiveId: () => string | null;

  ensureActive: (pref?: 'first' | 'last') => void;

  handleKey: (key: string, shiftKey?: boolean) => boolean;
  typeahead: (key: string) => boolean;

  commitActive: () => void;
}>;