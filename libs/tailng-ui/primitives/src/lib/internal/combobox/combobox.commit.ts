/**
 * Normalize + commit helpers for combobox listbox value sync.
 * Listbox emits T | readonly T[] | null; these helpers normalize and compare
 * for Select, AutoComplete, etc.
 */

/** Listbox value shape (single, array, or null). */
export type ListboxValueShape<T> = T | readonly T[] | null;

/**
 * Normalize listbox value to array form (for multi-select).
 */
export function normalizeToArray<T>(value: ListboxValueShape<T>): readonly T[] | null {
  if (value === null) return null;
  return (Array.isArray(value) ? value : [value]) as readonly T[];
}

/**
 * Normalize listbox value to single form (for single-select).
 */
export function normalizeToSingle<T>(value: ListboxValueShape<T>): T | null {
  if (value === null) return null;
  return (Array.isArray(value) ? (value[0] ?? null) : value) as T | null;
}

/**
 * Check if two array values are equal (same refs, same order).
 */
export function arraysEqual<T>(
  a: readonly T[] | null,
  b: readonly T[] | null
): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((x, i) => Object.is(x, b[i]));
}
