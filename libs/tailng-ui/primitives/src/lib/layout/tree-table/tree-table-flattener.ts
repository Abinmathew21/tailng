import type { TngTreeTableFlatRow, TngTreeTableFlattenOptions, TngTreeTableKey } from './tree-table.types';

/**
 * Performs a depth-first walk of the tree, returning only visible rows
 * (i.e. children of collapsed parents are excluded entirely).
 *
 * Pure: never mutates input; output rows are frozen.
 */
export function flattenTreeTableRows<TRow>(
  options: TngTreeTableFlattenOptions<TRow>,
): readonly TngTreeTableFlatRow<TRow>[] {
  const { data, expandedKeys, selectedKeys, getKey, getChildren, isDisabled } = options;
  const result: TngTreeTableFlatRow<TRow>[] = [];

  function walk(
    rows: readonly TRow[],
    level: number,
    parentKey: TngTreeTableKey | null,
    ancestorPath: readonly TngTreeTableKey[],
    indexPath: readonly number[],
  ): void {
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i] as TRow;
      const currentIndexPath = [...indexPath, i];
      const key = getKey(row, currentIndexPath);
      const path = Object.freeze([...ancestorPath, key]);

      const rawChildren = getChildren(row);
      const children: readonly TRow[] =
        Array.isArray(rawChildren) && rawChildren.length > 0 ? rawChildren : [];

      const expandable = children.length > 0;
      const expanded = expandable && expandedKeys.has(key);
      const selected = selectedKeys?.has(key) ?? false;
      const disabled = isDisabled?.(row) ?? false;

      const flatRow: TngTreeTableFlatRow<TRow> = Object.freeze({
        row,
        key,
        level,
        expandable,
        expanded,
        selected,
        disabled,
        visible: true,
        parentKey,
        path,
      });

      result.push(flatRow);

      if (expanded) {
        walk(children, level + 1, key, path, currentIndexPath);
      }
    }
  }

  walk(data, 0, null, [], []);
  return Object.freeze(result);
}
