import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination page count calculation', () => {
  it('calculates page count with ceil(totalItems / pageSize)', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(21);
    fixture.componentInstance.pageSize.set(10);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '3',
    );
  });

  it('calculates page count as 0 when totalItems is 0', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(0);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '0',
    );
  });

  it('updates page count when totalItems changes', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(50);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '5',
    );
  });

  it('updates page count when page size changes', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '5');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '5',
    );
  });

  it('handles totals smaller than, equal to, and not divisible by page size', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(9);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '1',
    );

    fixture.componentInstance.totalItems.set(10);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '1',
    );

    fixture.componentInstance.totalItems.set(11);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '2',
    );
  });

  it('handles very large totals and clamps negative totals', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(1_000_001);
    fixture.componentInstance.pageSize.set(1000);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '1001',
    );

    fixture.componentInstance.totalItems.set(-10);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '0',
    );
  });

  it('normalizes invalid or zero page sizes to a positive fallback', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageSize.set(0);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '1',
    );
  });
});
