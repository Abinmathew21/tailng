import { describe, expect, it } from 'vitest';

import { click, createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination accessibility', () => {
  it('supports an accessible label on the pagination root', () => {
    const fixture = createPaginationFixture();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('aria-label')).toBe(
      'Results pages',
    );
  });

  it('preserves host-provided button labels for screen readers', () => {
    const fixture = createPaginationFixture();

    expect(getByTestId<HTMLButtonElement>(fixture, 'first').textContent?.trim()).toBe('First');
    expect(getByTestId<HTMLButtonElement>(fixture, 'next').textContent?.trim()).toBe('Next');
  });

  it('marks only one page button as aria-current page', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    const pageButtons = [
      getByTestId<HTMLButtonElement>(fixture, 'page-1'),
      getByTestId<HTMLButtonElement>(fixture, 'page-2'),
      getByTestId<HTMLButtonElement>(fixture, 'page-outside'),
    ];

    expect(pageButtons.filter((button) => button.getAttribute('aria-current') === 'page')).toHaveLength(
      1,
    );
  });

  it('does not mark movement controls as aria-current', () => {
    const fixture = createPaginationFixture();

    expect(getByTestId<HTMLButtonElement>(fixture, 'first').getAttribute('aria-current')).toBeNull();
    expect(getByTestId<HTMLButtonElement>(fixture, 'next').getAttribute('aria-current')).toBeNull();
  });
});
