import { describe, expect, it } from 'vitest';
import { createTngPaginationController } from './pagination';

describe('createTngPaginationController', () => {
  it('slice returns the correct page', () => {
    const controller = createTngPaginationController<number>({
      pageIndex: 1,
      pageSize: 2,
    });

    expect(controller.slice([1, 2, 3, 4, 5])).toEqual([3, 4]);
  });

  it('pageCount returns the correct number of pages', () => {
    const controller = createTngPaginationController<number>({
      pageSize: 2,
    });

    expect(controller.getPageCount(5)).toBe(3);
    expect(controller.getPageCount(0)).toBe(0);
  });

  it('clamps page index to the last page when the requested index is out of range', () => {
    const controller = createTngPaginationController<number>({
      pageIndex: 99,
      pageSize: 2,
    });

    expect(controller.setPageIndex(99, 5)).toEqual({
      pageIndex: 2,
      pageSize: 2,
    });
    expect(controller.slice([1, 2, 3, 4, 5])).toEqual([5]);
  });

  it('resets to the first page when asked', () => {
    const controller = createTngPaginationController<number>({
      pageIndex: 2,
      pageSize: 2,
    });

    expect(controller.reset(5)).toEqual({
      pageIndex: 0,
      pageSize: 2,
    });
  });

  it('can keep the first visible row in view when page size changes', () => {
    const controller = createTngPaginationController<number>({
      pageIndex: 2,
      pageSize: 5,
    });

    expect(controller.setPageSize(4, 30, { anchorIndex: 10 })).toEqual({
      pageIndex: 2,
      pageSize: 4,
    });
  });

  it('emits pageChange in server mode without slicing the provided rows', () => {
    const changes: {
      pageIndex: number;
      pageSize: number;
      previousPageIndex: number;
      previousPageSize: number;
      totalItems?: number;
    }[] = [];

    const controller = createTngPaginationController<number>({
      mode: 'server',
      onPageChange: (event) => {
        changes.push({
          pageIndex: event.pageIndex,
          pageSize: event.pageSize,
          previousPageIndex: event.previousPageIndex,
          previousPageSize: event.previousPageSize,
          totalItems: event.totalItems,
        });
      },
      pageIndex: 1,
      pageSize: 10,
    });

    expect(controller.setPageIndex(3, 120)).toEqual({
      pageIndex: 3,
      pageSize: 10,
    });
    expect(controller.slice([1, 2, 3])).toEqual([1, 2, 3]);
    expect(changes).toEqual([
      {
        pageIndex: 3,
        pageSize: 10,
        previousPageIndex: 1,
        previousPageSize: 10,
        totalItems: 120,
      },
    ]);
  });
});
