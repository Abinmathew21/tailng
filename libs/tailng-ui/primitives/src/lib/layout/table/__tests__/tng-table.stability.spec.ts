import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableHarnessComponent,
  TableSortHarnessComponent,
  getByTestId,
  queryAllByTestId,
} from './tng-table.test-harness';

describe('tng-table stability and lifecycle', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('recomputes runtime hooks when items, loading, header, footer, and dir change', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(queryAllByTestId(fixture, 'body-row')).toHaveLength(1);
    expect(table.getAttribute('dir')).toBe('ltr');
    expect(table.getAttribute('data-has-header')).toBe('');
    expect(table.getAttribute('data-has-footer')).toBe('');

    fixture.componentInstance.dir.set('rtl');
    fixture.componentInstance.items.set([]);
    fixture.componentInstance.loading.set(true);
    fixture.componentInstance.showHeader.set(false);
    fixture.componentInstance.showFooter.set(false);
    fixture.detectChanges();

    expect(table.getAttribute('dir')).toBe('rtl');
    expect(queryAllByTestId(fixture, 'body-row')).toHaveLength(0);
    expect(table.getAttribute('data-loading')).toBe('');
    expect(table.getAttribute('data-empty')).toBeNull();
    expect(table.getAttribute('data-has-header')).toBeNull();
    expect(table.getAttribute('data-has-footer')).toBeNull();
  });

  it('unregisters sort headers cleanly when the DOM tears down and re-renders', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.sortRef?.hasHeader('label')).toBe(true);

    fixture.componentInstance.showHeader.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.sortRef?.hasHeader('label')).toBe(false);

    fixture.componentInstance.showHeader.set(true);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.sortRef?.hasHeader('label')).toBe(true);

    expect(() => fixture.destroy()).not.toThrow();
  });
});
