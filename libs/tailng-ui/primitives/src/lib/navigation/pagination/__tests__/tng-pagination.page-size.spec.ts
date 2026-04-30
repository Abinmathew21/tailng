import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  click,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination page size select', () => {
  it('renders page-size control and initializes from current page size', () => {
    const fixture = createPaginationFixture();
    const select = getByTestId<HTMLSelectElement>(fixture, 'size');

    expect(select.getAttribute('data-slot')).toBe('pagination-page-size');
    expect(select.value).toBe('10');
  });

  it('updates page size and emits size-triggered events', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSizeChanges).toEqual([20]);
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 0,
      pageSize: 20,
      trigger: 'size',
    });
  });

  it('keeps the first visible item anchored and clamps in client mode', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 1,
      pageSize: 20,
      trigger: 'size',
    });
  });

  it('does not emit when selecting the current page size', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '10');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
  });

  it('does not emit while disabled', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
    expect(getByTestId<HTMLSelectElement>(fixture, 'size').disabled).toBe(true);
  });

  it('falls back for non-numeric select values', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), 'bad');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '10',
    );
  });

  it('updates select value when controlled page size changes from the host', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageSize.set(20);
    fixture.detectChanges();

    expect(getByTestId<HTMLSelectElement>(fixture, 'size').value).toBe('20');
  });
});
