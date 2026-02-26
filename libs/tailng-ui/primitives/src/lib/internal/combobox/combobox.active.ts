/**
 * Active descendant sync helpers.
 * Keeps ensureActive + setActiveDescendantId(getActiveId()) consistent
 * across Select, AutoComplete, etc.
 */

import type { ComboboxListboxApi } from './combobox.listbox-api';

/** Callback to set aria-activedescendant on the trigger. */
export type SetActiveDescendantId = (id: string | null) => void;

/**
 * Sync aria-activedescendant from listbox active id to the trigger.
 */
export function syncActiveDescendant(
  listbox: ComboboxListboxApi | null,
  setActiveDescendantId: SetActiveDescendantId
): void {
  setActiveDescendantId(listbox?.getActiveId() ?? null);
}

/**
 * Ensure an option is active (first or last), then sync activeDescendant.
 */
export function ensureActiveAndSync(
  listbox: ComboboxListboxApi | null,
  setActiveDescendantId: SetActiveDescendantId,
  pref?: 'first' | 'last'
): void {
  listbox?.ensureActive(pref);
  syncActiveDescendant(listbox, setActiveDescendantId);
}
