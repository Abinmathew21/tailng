import type { TngTreeTableKey } from './tree-table.types';

/** Guard: disabled rows are never selectable. */
function isSelectable(key: TngTreeTableKey, disabledKeys?: ReadonlySet<TngTreeTableKey>): boolean {
  return !disabledKeys?.has(key);
}

/** Returns a new Set with the key toggled. Does not mutate the input. Respects disabled state. */
export function toggleSelectedKey(
  selectedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
  disabledKeys?: ReadonlySet<TngTreeTableKey>,
): ReadonlySet<TngTreeTableKey> {
  if (!isSelectable(key, disabledKeys)) {
    return selectedKeys;
  }

  const next = new Set(selectedKeys);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return next;
}

/** Returns a new Set with the key added. Does not mutate the input. Respects disabled state. */
export function selectKey(
  selectedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
  disabledKeys?: ReadonlySet<TngTreeTableKey>,
): ReadonlySet<TngTreeTableKey> {
  if (!isSelectable(key, disabledKeys)) {
    return selectedKeys;
  }

  const next = new Set(selectedKeys);
  next.add(key);
  return next;
}

/** Returns a new Set with the key removed. Does not mutate the input. */
export function deselectKey(
  selectedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey> {
  const next = new Set(selectedKeys);
  next.delete(key);
  return next;
}
