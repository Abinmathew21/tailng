import { describe, expect, it } from 'vitest';

import { click, createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination first button', () => {
  it('renders first control and disables it on the first page', () => {
    const fixture = createPaginationFixture();
    const first = getByTestId<HTMLButtonElement>(fixture, 'first');

    expect(first.getAttribute('data-slot')).toBe('pagination-first');
    expect(first.disabled).toBe(true);
  });

  it('navigates to page 0 and emits first-triggered events', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'first'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges.at(-1)).toBe(0);
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 0,
      previousPageIndex: 2,
      trigger: 'first',
    });
  });

  it('does not emit on first page or while disabled', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'first'));
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'first'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
  });
});

describe('tngPagination previous button', () => {
  it('renders previous control and decrements page index', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').getAttribute('data-slot')).toBe(
      'pagination-previous',
    );
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 0,
      previousPageIndex: 1,
      trigger: 'previous',
    });
  });

  it('clamps at page 0 and does not emit on the first page', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').disabled).toBe(true);
  });
});

describe('tngPagination next button', () => {
  it('renders next control and increments page index', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'next').getAttribute('data-slot')).toBe(
      'pagination-next',
    );
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 1,
      previousPageIndex: 0,
      trigger: 'next',
    });
  });

  it('disables and does not emit on the last page in client mode', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'next').disabled).toBe(true);
    expect(fixture.componentInstance.pageChanges).toHaveLength(1);
  });
});

describe('tngPagination last button', () => {
  it('renders last control and navigates to the final client page', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'last').getAttribute('data-slot')).toBe(
      'pagination-last',
    );
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 2,
      previousPageIndex: 0,
      trigger: 'last',
    });
  });

  it('is disabled on the last page and when there is only one page', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    expect(getByTestId<HTMLButtonElement>(fixture, 'last').disabled).toBe(true);

    fixture.componentInstance.totalItems.set(5);
    fixture.detectChanges();
    expect(getByTestId<HTMLButtonElement>(fixture, 'last').disabled).toBe(true);
  });
});
