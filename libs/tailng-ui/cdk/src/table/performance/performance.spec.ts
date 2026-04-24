import { describe, expect, it } from 'vitest';
import { createTngFilterController } from '../filter/filter';
import { createTngSortController } from '../sort/sort';

type PerformanceRow = Readonly<{
  group: 'even' | 'odd';
  id: string;
  label: string;
  score: number;
}>;

const performanceRows: readonly PerformanceRow[] = Object.freeze(
  Array.from({ length: 1_000 }, (_, index) => ({
    group: index % 2 === 0 ? 'even' : 'odd',
    id: `row-${index}`,
    label: `Row ${index}`,
    score: 1_000 - index,
  })),
);

describe('table performance smoke checks', () => {
  it('computes accessor sort values once per row during bulk sorts', () => {
    let accessorCalls = 0;
    const controller = createTngSortController<PerformanceRow, 'score'>({
      accessor: (item, columnId) => {
        accessorCalls += 1;
        return item[columnId];
      },
      activeColumnId: 'score',
      direction: 'asc',
    });

    const sorted = controller.apply(performanceRows);

    expect(sorted[0]?.score).toBe(1);
    expect(sorted.at(-1)?.score).toBe(1_000);
    expect(accessorCalls).toBe(performanceRows.length);
  });

  it('applies bulk filtering in a single pass before sorting the filtered rows', () => {
    let globalFilterCalls = 0;
    let columnPredicateCalls = 0;
    let sortAccessorCalls = 0;

    const filterController = createTngFilterController<PerformanceRow, 'group'>({
      columnFilterPredicates: {
        group: (item, filterValue) => {
          columnPredicateCalls += 1;
          return item.group === filterValue;
        },
      },
      globalFilter: (item, query) => {
        globalFilterCalls += 1;
        return item.label.toLowerCase().includes(query.toLowerCase());
      },
    });
    const sortController = createTngSortController<PerformanceRow, 'score'>({
      accessor: (item, columnId) => {
        sortAccessorCalls += 1;
        return item[columnId];
      },
      activeColumnId: 'score',
      direction: 'asc',
    });

    filterController.setQuery('row');
    filterController.setColumnFilter('group', 'even');

    const filtered = filterController.apply(performanceRows);
    const sorted = sortController.apply(filtered);

    expect(filtered).toHaveLength(500);
    expect(sorted[0]?.score).toBe(2);
    expect(sorted.at(-1)?.score).toBe(1_000);
    expect(globalFilterCalls).toBe(performanceRows.length);
    expect(columnPredicateCalls).toBe(performanceRows.length);
    expect(sortAccessorCalls).toBe(filtered.length);
  });
});
