import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  click,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination uncontrolled state', () => {
  it('initializes from default page index and default page size', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.defaultPageIndex.set(1);
    fixture.componentInstance.defaultPageSize.set(5);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('1');
    expect(pagination.getAttribute('data-page-size')).toBe('5');
  });

  it('falls back to page index 0 and page size 10 when defaults are not configured', () => {
    const fixture = createPaginationFixture();
    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');

    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('10');
  });

  it('normalizes negative uncontrolled defaults', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.defaultPageIndex.set(-10);
    fixture.componentInstance.defaultPageSize.set(-1);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('1');
  });

  it('clamps an initial uncontrolled page index above the last client page', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.defaultPageIndex.set(99);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
  });

  it('preserves internal page index and page size after user changes', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('20');
  });

  it('does not reset uncontrolled state on unrelated input changes', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    fixture.componentInstance.ariaLabel.set('Updated pages');
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('clamps uncontrolled page index when totalItems decreases below the current range', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    fixture.componentInstance.totalItems.set(15);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('keeps uncontrolled page index when totalItems increases and the page remains valid', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    fixture.componentInstance.totalItems.set(100);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });
});
