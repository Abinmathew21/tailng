import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DynamicTableHarnessComponent,
  TableHarnessComponent,
  TableSelectionHarnessComponent,
  dispatchMouseEvent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table accessibility hooks', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('reflects aria-label on the table host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.componentInstance.ariaLabel.set('Revenue table');
    fixture.detectChanges();

    expect(getByTestId<HTMLTableElement>(fixture, 'table').getAttribute('aria-label')).toBe(
      'Revenue table',
    );
  });

  it('exposes aria-selected and aria-disabled on rows based on selection state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-alpha'), 'click');
    fixture.detectChanges();

    expect(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-alpha').getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta').getAttribute('aria-selected')).toBe(
      'false',
    );
    expect(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-gamma').getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('keeps semantic header scope and row/column identity hooks on cells', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicTableHarnessComponent],
    }).createComponent(DynamicTableHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableCellElement>(fixture, 'dynamic-header-label').getAttribute('scope')).toBe('col');
    expect(
      getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-alpha-status').getAttribute(
        'data-column-id',
      ),
    ).toBe('status');
    expect(
      getByTestId<HTMLTableCellElement>(fixture, 'dynamic-cell-alpha-status').getAttribute(
        'data-row-id',
      ),
    ).toBe('alpha');
  });
});
