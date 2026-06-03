import type { TngTreeTableKey } from './tree-table.types';

/** Returns a new Set with the key added (expanded). Does not mutate the input. */
export function expandKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey> {
  const next = new Set(expandedKeys);
  next.add(key);
  return next;
}

/** Returns a new Set with the key removed (collapsed). Does not mutate the input. */
export function collapseKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey> {
  const next = new Set(expandedKeys);
  next.delete(key);
  return next;
}

/** Returns a new Set with the key toggled. Does not mutate the input. */
export function toggleExpandedKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey> {
  return expandedKeys.has(key) ? collapseKey(expandedKeys, key) : expandKey(expandedKeys, key);
}
