import { describe, expect, it } from 'vitest';
import { flattenTreeTableRows } from '../tree-table-flattener';
import type { TngTreeTableFlattenOptions } from '../tree-table.types';

interface TestRow {
  id: string;
  name: string;
  children?: TestRow[];
}

function makeOptions(
  data: readonly TestRow[],
  expandedKeys: ReadonlySet<string | number> = new Set(),
  overrides: Partial<TngTreeTableFlattenOptions<TestRow>> = {},
): TngTreeTableFlattenOptions<TestRow> {
  return {
    data,
    expandedKeys,
    getKey: (row) => row.id,
    getChildren: (row) => row.children,
    ...overrides,
  };
}

const FLAT_DATA: readonly TestRow[] = [
  { id: 'a', name: 'A' },
  { id: 'b', name: 'B' },
];

const TREE_DATA: readonly TestRow[] = [
  {
    id: 'root',
    name: 'Root',
    children: [
      { id: 'child-1', name: 'Child 1' },
      { id: 'child-2', name: 'Child 2', children: [{ id: 'grandchild', name: 'Grandchild' }] },
    ],
  },
];

describe('flattenTreeTableRows', () => {
  describe('root-level rows', () => {
    it('should flatten root-level rows', () => {
      const result = flattenTreeTableRows(makeOptions(FLAT_DATA));
      expect(result).toHaveLength(2);
    });

    it('should assign level 0 to root rows', () => {
      const result = flattenTreeTableRows(makeOptions(FLAT_DATA));
      expect(result[0]?.level).toBe(0);
      expect(result[1]?.level).toBe(0);
    });

    it('should handle empty data', () => {
      const result = flattenTreeTableRows(makeOptions([]));
      expect(result).toHaveLength(0);
    });
  });

  describe('levels and expandable', () => {
    it('should mark rows with children as expandable', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const root = result.find((r) => r.key === 'root');
      expect(root?.expandable).toBe(true);
    });

    it('should mark rows without children as non-expandable', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const child = result.find((r) => r.key === 'child-1');
      expect(child?.expandable).toBe(false);
    });

    it('should assign incremented levels to child rows', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const child = result.find((r) => r.key === 'child-1');
      expect(child?.level).toBe(1);
    });

    it('should support deeply nested rows', () => {
      const result = flattenTreeTableRows(
        makeOptions(TREE_DATA, new Set(['root', 'child-2'])),
      );
      const grandchild = result.find((r) => r.key === 'grandchild');
      expect(grandchild?.level).toBe(2);
    });
  });

  describe('expand/collapse visibility', () => {
    it('should include children when parent key is expanded', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const keys = result.map((r) => r.key);
      expect(keys).toContain('child-1');
      expect(keys).toContain('child-2');
    });

    it('should exclude children when parent key is collapsed', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA));
      expect(result).toHaveLength(1);
      expect(result[0]?.key).toBe('root');
    });

    it('should not render grandchildren if immediate parent is collapsed', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const keys = result.map((r) => r.key);
      expect(keys).not.toContain('grandchild');
    });
  });

  describe('parentKey and path', () => {
    it('should generate correct parentKey', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const child = result.find((r) => r.key === 'child-1');
      expect(child?.parentKey).toBe('root');
    });

    it('should set parentKey to null for root rows', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA));
      expect(result[0]?.parentKey).toBeNull();
    });

    it('should generate correct path for root rows', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA));
      expect(result[0]?.path).toEqual(['root']);
    });

    it('should generate correct path for child rows', () => {
      const result = flattenTreeTableRows(makeOptions(TREE_DATA, new Set(['root'])));
      const child = result.find((r) => r.key === 'child-1');
      expect(child?.path).toEqual(['root', 'child-1']);
    });
  });

  describe('reference preservation and immutability', () => {
    it('should preserve original row references', () => {
      const row = { id: 'x', name: 'X' };
      const result = flattenTreeTableRows(makeOptions([row]));
      expect(result[0]?.row).toBe(row);
    });

    it('should not mutate input data', () => {
      const data: TestRow[] = [{ id: 'a', name: 'A' }];
      const copy = JSON.stringify(data);
      flattenTreeTableRows(makeOptions(data));
      expect(JSON.stringify(data)).toBe(copy);
    });
  });

  describe('null / missing children', () => {
    it('should handle missing children as empty', () => {
      const data: TestRow[] = [{ id: 'a', name: 'A' }]; // no children property
      const result = flattenTreeTableRows(makeOptions(data));
      expect(result[0]?.expandable).toBe(false);
    });

    it('should handle null children as empty', () => {
      const result = flattenTreeTableRows(
        makeOptions([{ id: 'a', name: 'A' }], new Set(), {
          getChildren: () => null,
        }),
      );
      expect(result[0]?.expandable).toBe(false);
    });

    it('should handle empty children array as non-expandable', () => {
      const data: TestRow[] = [{ id: 'a', name: 'A', children: [] }];
      const result = flattenTreeTableRows(makeOptions(data));
      expect(result[0]?.expandable).toBe(false);
    });
  });

  describe('selection and disabled', () => {
    it('should mark selected rows when selectedKeys is provided', () => {
      const result = flattenTreeTableRows(
        makeOptions(FLAT_DATA, new Set(), { selectedKeys: new Set(['a']) }),
      );
      expect(result[0]?.selected).toBe(true);
      expect(result[1]?.selected).toBe(false);
    });

    it('should mark disabled rows when isDisabled returns true', () => {
      const result = flattenTreeTableRows(
        makeOptions(FLAT_DATA, new Set(), { isDisabled: (row) => row.id === 'a' }),
      );
      expect(result[0]?.disabled).toBe(true);
      expect(result[1]?.disabled).toBe(false);
    });
  });
});
