import { describe, expect, it } from 'vitest';

import {
  createFixture,
  createPaginationFixture,
  getByTestId,
  PaginationDivRootComponent,
  PaginationRootOnlyComponent,
} from './tng-pagination.test-harness';

describe('tngPagination root rendering', () => {
  it('renders root state attributes on a semantic nav element', () => {
    const fixture = createPaginationFixture();
    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');

    expect(pagination.tagName).toBe('NAV');
    expect(pagination.getAttribute('data-slot')).toBe('pagination');
    expect(pagination.getAttribute('aria-label')).toBe('Results pages');
    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('10');
    expect(pagination.getAttribute('data-page-count')).toBe('3');
    expect(pagination.getAttribute('data-mode')).toBe('client');
  });

  it('removes aria-label when ariaLabel is null', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.ariaLabel.set(null);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('aria-label')).toBeNull();
  });

  it('exposes disabled state through the root data attribute', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').hasAttribute('data-disabled')).toBe(true);
  });

  it('updates root state attributes when inputs change after initial render', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.pageIndex.set(1);
    fixture.componentInstance.pageSize.set(5);
    fixture.componentInstance.totalItems.set(11);
    fixture.componentInstance.mode.set('server');
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('1');
    expect(pagination.getAttribute('data-page-size')).toBe('5');
    expect(pagination.getAttribute('data-page-count')).toBe('3');
    expect(pagination.getAttribute('data-mode')).toBe('server');
  });

  it('does not throw when projected controls are missing', () => {
    const fixture = createFixture(PaginationRootOnlyComponent);

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-slot')).toBe(
      'pagination',
    );
  });

  it('supports non-nav host elements', () => {
    const fixture = createFixture(PaginationDivRootComponent);

    expect(getByTestId<HTMLElement>(fixture, 'pagination').tagName).toBe('DIV');
  });
});
