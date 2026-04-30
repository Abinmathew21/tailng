import { describe, expect, it } from 'vitest';

import { click, createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination dynamic input updates', () => {
  it('updates controls when disabled and mode change', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.mode.set('server');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-mode')).toBe('server');
    expect(getByTestId<HTMLButtonElement>(fixture, 'next').disabled).toBe(true);
  });

  it('updates page count and current page state when inputs change', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1);
    fixture.componentInstance.pageSize.set(5);
    fixture.componentInstance.totalItems.set(50);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('1');
    expect(pagination.getAttribute('data-page-count')).toBe('10');
  });

  it('updates default values before uncontrolled interaction and ignores them after interaction', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.defaultPageIndex.set(1);
    fixture.componentInstance.defaultPageSize.set(5);
    fixture.detectChanges();
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '5',
    );

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    fixture.componentInstance.defaultPageIndex.set(0);
    fixture.componentInstance.defaultPageSize.set(20);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-size')).toBe(
      '5',
    );
  });

  it('updates aria-label and projected page-button current state after input changes', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.ariaLabel.set('Updated pages');
    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('aria-label')).toBe(
      'Updated pages',
    );
    expect(getByTestId<HTMLButtonElement>(fixture, 'page-2').getAttribute('aria-current')).toBe(
      'page',
    );
  });
});
