import { describe, expect, it } from 'vitest';

import { click, createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination explicit page buttons', () => {
  it('renders page controls and marks only the current page', () => {
    const fixture = createPaginationFixture();

    const firstPage = getByTestId<HTMLButtonElement>(fixture, 'page-1');
    const secondPage = getByTestId<HTMLButtonElement>(fixture, 'page-2');

    expect(firstPage.getAttribute('data-slot')).toBe('pagination-page');
    expect(firstPage.getAttribute('aria-current')).toBe('page');
    expect(secondPage.getAttribute('aria-current')).toBeNull();
  });

  it('updates aria-current after navigation', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'page-1').getAttribute('aria-current')).toBeNull();
    expect(getByTestId<HTMLButtonElement>(fixture, 'page-2').getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('navigates to the configured page index and emits page trigger', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'page-2'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([1]);
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 1,
      trigger: 'page',
    });
  });

  it('does not emit when clicking the current page button', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'page-1'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
  });

  it('disables page buttons when pagination is disabled', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'page-2').disabled).toBe(true);
  });

  it('disables page buttons outside the known client range', () => {
    const fixture = createPaginationFixture();

    expect(getByTestId<HTMLButtonElement>(fixture, 'page-outside').disabled).toBe(true);
  });

  it('supports dynamic page button values and preserves host text content', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageTwo.set(2);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'page-2'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'page-2').textContent?.trim()).toBe('Two');
    expect(fixture.componentInstance.pageIndexChanges).toEqual([2]);
  });
});
