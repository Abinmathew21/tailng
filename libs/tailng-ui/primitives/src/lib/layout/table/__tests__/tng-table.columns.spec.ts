import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DynamicTableHarnessComponent,
  dispatchMouseEvent,
  getByTestId,
  queryAllByTestId,
} from './tng-table.test-harness';

describe('tng-table dynamic columns and row identity', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('adding and removing columns updates both headers and body cells', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.detectChanges();

    fixture.componentInstance.columns.set([
      { id: 'label', label: 'Label' },
      { id: 'value', label: 'Value' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="dynamic-header-status"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="dynamic-cell-alpha-status"]')).toBeNull();
    expect(getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-alpha-value').textContent?.trim()).toBe('1');
  });

  it('reordering column definitions reorders rendered cells without losing row selection state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLTableRowElement>(fixture, 'dynamic-row-beta'), 'click');
    fixture.detectChanges();

    fixture.componentInstance.columns.set([
      { id: 'value', label: 'Value' },
      { id: 'label', label: 'Label' },
      { id: 'status', label: 'Status' },
    ]);
    fixture.detectChanges();

    const row = getByTestId<HTMLTableRowElement>(fixture, 'dynamic-row-beta');
    const columnIds = Array.from(row.querySelectorAll('[data-slot="table-cell"]')).map((cell) =>
      cell.getAttribute('data-column-id'),
    );

    expect(columnIds).toEqual(['value', 'label', 'status']);
    expect(row.getAttribute('data-selected')).toBe('');
  });

  it('hiding a column removes its cells from the DOM', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.componentInstance.columns.set([
      { id: 'label', label: 'Label' },
      { hidden: true, id: 'status', label: 'Status' },
      { id: 'value', label: 'Value' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="dynamic-header-status"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="dynamic-cell-gamma-status"]')).toBeNull();
  });

  it('inserting and removing rows updates the DOM without mis-assigning row ids', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.detectChanges();

    fixture.componentInstance.rows.set([
      { id: 'beta', label: 'Beta', status: undefined, value: null },
      { id: 'delta', label: 'Delta', status: 'Live', value: 42 },
      { id: 'gamma', label: 'Gamma', status: 'Draft', value: true },
    ]);
    fixture.detectChanges();

    const rowIds = queryAllByTestId<HTMLTableRowElement>(fixture, 'dynamic-row-beta')
      .concat(queryAllByTestId<HTMLTableRowElement>(fixture, 'dynamic-row-delta'))
      .concat(queryAllByTestId<HTMLTableRowElement>(fixture, 'dynamic-row-gamma'))
      .map((row) => row.getAttribute('data-row-id'));

    expect(rowIds).toEqual(['beta', 'delta', 'gamma']);
    expect(fixture.nativeElement.querySelector('[data-testid="dynamic-row-alpha"]')).toBeNull();
  });

  it('renders null, undefined, and mixed primitive values safely', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-beta-status').textContent?.trim()).toBe('');
    expect(getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-beta-value').textContent?.trim()).toBe('');
    expect(getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-gamma-value').textContent?.trim()).toBe('true');
  });
});
