/**
 * Shared listbox bridge contract for combobox-based controls (Select, AutoComplete).
 * Used by SelectTrigger and AutocompleteInput to communicate with the listbox.
 */

export interface ComboboxListboxApi {
  /** Host element id of the listbox (for aria-controls). */
  getHostId(): string | null;
  /** Currently active/focused option id (for aria-activedescendant). */
  getActiveId(): string | null;

  /** Ensure an option is active; pref 'first' | 'last' when opening. */
  ensureActive(pref?: 'first' | 'last'): void;

  /** Handle arrow keys, Home, End, etc. Returns true if focus/selection moved. */
  handleKey(key: string, shiftKey?: boolean): boolean;
  /** Typeahead by character. Returns true if matched and moved. */
  typeahead(key: string): boolean;

  /** Commit/select the active option (Enter/Space semantics). */
  commitActive(): void;
}
