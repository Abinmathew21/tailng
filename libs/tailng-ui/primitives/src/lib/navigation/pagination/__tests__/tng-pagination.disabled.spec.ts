import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  click,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination disabled state', () => {
  it('disables all controls and exposes disabled root state', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').hasAttribute('data-disabled')).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'first').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'page-2').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'next').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'last').disabled).toBe(true);
    expect(getByTestId<HTMLSelectElement>(fixture, 'size').disabled).toBe(true);
  });

  it('does not emit pageChange, pageIndexChange, or pageSizeChange when disabled', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges).toEqual([]);
    expect(fixture.componentInstance.pageIndexChanges).toEqual([]);
    expect(fixture.componentInstance.pageSizeChanges).toEqual([]);
  });

  it('preserves page index and page size while disabled', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const pagination = getByTestId<HTMLElement>(fixture, 'pagination');
    expect(pagination.getAttribute('data-page-index')).toBe('0');
    expect(pagination.getAttribute('data-page-size')).toBe('20');
  });

  it('resumes navigation after disabled changes back to false', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([1]);
  });

  it('combines disabled state with boundary disabled state', () => {
    const fixture = createPaginationFixture();

    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').disabled).toBe(true);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').disabled).toBe(true);
  });
});
