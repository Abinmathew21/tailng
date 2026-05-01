import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  click,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination controlled page index', () => {
  it('uses controlled pageIndex when provided by the host', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('emits without mutating rendered page index until the host syncs', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(0);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([1]);
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '0',
    );

    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('clamps controlled page index for client mode rendering', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(99);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
  });

  it('preserves controlled page index when unrelated inputs change', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();
    fixture.componentInstance.ariaLabel.set('Updated');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('switches between uncontrolled and controlled page index', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    fixture.componentInstance.pageIndex.set(0);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '0',
    );

    fixture.componentInstance.pageIndex.set(undefined);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('does not emit duplicate pageIndexChange for the current page', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'page-1'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([]);
  });

  it('emits previous page index from controlled state', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 0,
      previousPageIndex: 1,
    });
  });
});

describe('tngPagination controlled page size', () => {
  it('uses controlled pageSize when provided by the host', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageSize.set(5);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '5',
    );
  });

  it('emits without mutating rendered page size until the host syncs', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageSize.set(10);
    fixture.detectChanges();
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSizeChanges).toEqual([20]);
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '10',
    );

    fixture.componentInstance.pageSize.set(20);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '20',
    );
  });

  it('switches between uncontrolled and controlled page size', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();
    fixture.componentInstance.pageSize.set(5);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '5',
    );

    fixture.componentInstance.pageSize.set(undefined);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '20',
    );
  });

  it('does not emit duplicate pageSizeChange for the current page size', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '10');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSizeChanges).toEqual([]);
  });

  it('recomputes page count and clamps page index from controlled page size', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(2);
    fixture.componentInstance.pageSize.set(20);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-count')).toBe('2');
    expect(pagination.getAttribute('data-page-index')).toBe('1');
  });
});
