import { describe, expect, it } from 'vitest';
import { createTngSortController } from './sort';

type SortRow = Readonly<{
  age: number;
  id: string;
  name: string;
}>;

const rows: readonly SortRow[] = Object.freeze([
  { id: 'gamma', name: 'Gamma', age: 30 },
  { id: 'alpha', name: 'Alpha', age: 24 },
  { id: 'beta', name: 'Beta', age: 24 },
]);

describe('createTngSortController', () => {
  it('toggle cycles asc to desc to none', () => {
    const controller = createTngSortController<SortRow>();

    expect(controller.toggle('name').direction).toBe('asc');
    expect(controller.toggle('name').direction).toBe('desc');
    expect(controller.toggle('name').direction).toBeNull();
    expect(controller.getState().activeColumnId).toBeNull();
  });

  it('disableClear keeps cycling between asc and desc', () => {
    const controller = createTngSortController<SortRow>({
      disableClear: true,
    });

    expect(controller.toggle('name').direction).toBe('asc');
    expect(controller.toggle('name').direction).toBe('desc');
    expect(controller.toggle('name').direction).toBe('asc');
    expect(controller.getState().activeColumnId).toBe('name');
  });

  it('applies stable accessor-based sorting', () => {
    const controller = createTngSortController<SortRow>({
      accessor: (item, columnId) => item[columnId as keyof SortRow],
    });

    controller.toggle('age');
    expect(controller.apply(rows).map((row) => row.id)).toEqual(['alpha', 'beta', 'gamma']);

    controller.toggle('age');
    expect(controller.apply(rows).map((row) => row.id)).toEqual(['gamma', 'alpha', 'beta']);
  });

  it('uses a custom comparator when provided', () => {
    const controller = createTngSortController<SortRow, 'name'>({
      activeColumnId: 'name',
      comparator: (left, right) => left.name.length - right.name.length,
      direction: 'desc',
    });

    expect(controller.apply(rows).map((row) => row.id)).toEqual(['gamma', 'alpha', 'beta']);
  });
});
