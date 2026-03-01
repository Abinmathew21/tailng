export interface TngMultiAutocompleteListboxApi<T> {
  /** Returns currently active option id (for aria-activedescendant). */
  getActiveId(): string | null;

  /** Optionally allow listbox to expose its value if needed later. */
  getValue?(): readonly T[];
}