import { describe, expect, it } from 'vitest';
import { createTngFilterController } from './filter';
import { createTngSortController } from '../sort/sort';

type FilterRow = Readonly<{
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}>;

const rows: readonly FilterRow[] = Object.freeze([
  { id: 'alice', name: 'Alice Jones', role: 'admin' },
  { id: 'ben', name: 'Ben Reed', role: 'editor' },
  { id: 'cara', name: 'Cara Miles', role: 'viewer' },
]);

describe('createTngFilterController', () => {
  it('setQuery updates the filter state', () => {
    const controller = createTngFilterController<FilterRow>();

    expect(controller.setQuery(' ali ').query).toBe('ali');
    expect(controller.getState().query).toBe('ali');
  });

  it('setColumnFilter updates the filter state', () => {
    const controller = createTngFilterController<FilterRow>();

    controller.setColumnFilter('role', 'admin');
    expect(controller.getState().columnFilters).toEqual({ role: 'admin' });

    controller.setColumnFilter('role', '');
    expect(controller.getState().columnFilters).toEqual({});
  });

  it('applies query and column filters to rows', () => {
    const controller = createTngFilterController<FilterRow>({
      columnFilterPredicates: {
        role: (item, filterValue) => item.role === filterValue,
      },
      globalFilter: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
    });

    controller.setQuery('a');
    controller.setColumnFilter('role', 'admin');

    expect(controller.apply(rows).map((row) => row.id)).toEqual(['alice']);
  });

  it('clear restores the full dataset', () => {
    const controller = createTngFilterController<FilterRow>({
      columnFilterPredicates: {
        role: (item, filterValue) => item.role === filterValue,
      },
    });

    controller.setQuery('alice');
    controller.setColumnFilter('role', 'admin');
    expect(controller.apply(rows).map((row) => row.id)).toEqual(['alice']);

    controller.clear();
    expect(controller.apply(rows).map((row) => row.id)).toEqual(['alice', 'ben', 'cara']);
  });

  it('composes correctly with sorting and returns an empty list for no-match states', () => {
    const filterController = createTngFilterController<FilterRow>({
      globalFilter: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
    });
    const sortController = createTngSortController<FilterRow, 'name'>({
      accessor: (item) => item.name,
      activeColumnId: 'name',
      direction: 'desc',
    });

    filterController.setQuery('e');
    expect(sortController.apply(filterController.apply(rows)).map((row) => row.id)).toEqual([
      'cara',
      'ben',
      'alice',
    ]);

    filterController.setQuery('zzz');
    expect(sortController.apply(filterController.apply(rows))).toEqual([]);
  });
});
