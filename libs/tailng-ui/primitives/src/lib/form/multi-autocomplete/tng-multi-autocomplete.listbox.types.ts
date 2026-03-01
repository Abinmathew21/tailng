// libs/tailng-ui/primitives/src/lib/form/multi-autocomplete/tng-multi-autocomplete.listbox.types.ts

export interface TngMultiAutocompleteListboxApi<T = unknown> {
  /** Host element id of the listbox (for aria-controls when content id not used). */
  getHostId(): string | null;

  /** Currently active option id (for aria-activedescendant). */
  getActiveId(): string | null;

  /** Ensure an option is active; pref on open. */
  ensureActive(pref?: 'first' | 'last'): void;

  /** Handle arrow keys, Home, End, etc. Returns true if listbox handled it. */
  handleKey(key: string, shiftKey?: boolean): boolean;

  /**
   * Commit/toggle the active option.
   * Multi-autocomplete semantics: toggle selection, keep overlay open.
   */
  commitActive(): void;

  /** (Optional) expose selected values later if needed */
  getValue?(): readonly T[];
}