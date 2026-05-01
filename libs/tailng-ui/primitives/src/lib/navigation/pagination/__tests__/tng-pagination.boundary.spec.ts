import { describe, expect, it } from 'vitest';

import { createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination boundary conditions', () => {
  it('handles totals around the page size boundary', () => {
    const fixture = createPaginationFixture();

    for (const [totalItems, pageCount] of [
      [0, '0'],
      [1, '1'],
      [10, '1'],
      [11, '2'],
    ] as const) {
      fixture.componentInstance.totalItems.set(totalItems);
      fixture.detectChanges();
      expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
        pageCount,
      );
    }
  });

  it('handles page size larger than total items and page size of 1', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageSize.set(100);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '1',
    );

    fixture.componentInstance.pageSize.set(1);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '25',
    );
  });

  it('clamps very large page indexes in client mode', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1_000_000);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
  });

  it('preserves very large page indexes in server mode', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.mode.set('server');
    fixture.componentInstance.pageIndex.set(1_000_000);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1000000',
    );
  });

  it('normalizes negative and decimal page indexes and page sizes', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(-10);
    fixture.componentInstance.pageSize.set(2.9);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('2');
  });
});
