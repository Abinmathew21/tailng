import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TableHarnessComponent, getByTestId } from './tng-table.test-harness';

describe('tng-table loading and empty state hooks', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('sets and clears data-loading from the loading input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-loading')).toBeNull();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(table.getAttribute('data-loading')).toBe('');

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(table.getAttribute('data-loading')).toBeNull();
  });

  it('sets data-empty when the table has no items and is not loading', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-empty')).toBe('');
    expect(table.getAttribute('data-loading')).toBeNull();
  });

  it('does not set data-empty while loading is active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.componentInstance.items.set([]);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-loading')).toBe('');
    expect(table.getAttribute('data-empty')).toBeNull();
  });

  it('reflects error, filterable, pageable, and consumer-owned utility slots', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.componentInstance.items.set([]);
    fixture.componentInstance.error.set(true);
    fixture.componentInstance.filterable.set(true);
    fixture.componentInstance.pageable.set(true);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-error')).toBe('');
    expect(table.getAttribute('data-filterable')).toBe('');
    expect(table.getAttribute('data-pageable')).toBe('');
    expect(getByTestId<HTMLElement>(fixture, 'empty-slot').getAttribute('data-slot')).toBe('table-empty');
    expect(getByTestId<HTMLElement>(fixture, 'error-slot').getAttribute('data-slot')).toBe('table-error');
    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-slot')).toBe('table-pagination');
  });
});
