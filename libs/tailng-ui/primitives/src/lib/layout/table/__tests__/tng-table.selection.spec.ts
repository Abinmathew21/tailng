import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableSelectionHarnessComponent,
  dispatchMouseEvent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table selection behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('clicking rows in single selection mode selects the row and clears the previous selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.detectChanges();

    const alpha = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-alpha');
    const beta = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta');

    dispatchMouseEvent(alpha, 'click');
    fixture.detectChanges();
    expect(alpha.getAttribute('data-selected')).toBe('');
    expect(fixture.componentInstance.selectionEvents.at(-1)).toMatchObject({
      changedId: 'alpha',
      selectedIds: ['alpha'],
      trigger: 'pointer',
    });

    dispatchMouseEvent(beta, 'click');
    fixture.detectChanges();
    expect(alpha.getAttribute('data-selected')).toBeNull();
    expect(beta.getAttribute('data-selected')).toBe('');
    expect(fixture.componentInstance.selectionEvents.at(-1)).toMatchObject({
      changedId: 'beta',
      selectedIds: ['beta'],
      trigger: 'pointer',
    });
  });

  it('supports additive ctrl-click selection in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.componentInstance.selectionMode.set('multiple');
    fixture.detectChanges();

    const alpha = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-alpha');
    const beta = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta');

    dispatchMouseEvent(alpha, 'click');
    fixture.detectChanges();

    dispatchMouseEvent(beta, 'click', {
      ctrlKey: true,
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds()).toEqual(['alpha', 'beta']);
    expect(alpha.getAttribute('data-selected')).toBe('');
    expect(beta.getAttribute('data-selected')).toBe('');
  });

  it('supports shift-click range selection using row order', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.componentInstance.selectionMode.set('multiple');
    fixture.componentInstance.rows.set([
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
      { id: 'gamma', label: 'Gamma' },
      { id: 'delta', label: 'Delta' },
    ]);
    fixture.detectChanges();

    const beta = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta');
    const delta = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-delta');

    dispatchMouseEvent(beta, 'click');
    fixture.detectChanges();

    dispatchMouseEvent(delta, 'click', {
      shiftKey: true,
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds()).toEqual(['beta', 'gamma', 'delta']);
  });

  it('keeps disabled rows out of selection and reflects aria-disabled state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.detectChanges();

    const gamma = getByTestId<HTMLTableRowElement>(fixture, 'selection-row-gamma');
    dispatchMouseEvent(gamma, 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds()).toEqual([]);
    expect(gamma.getAttribute('aria-disabled')).toBe('true');
    expect(gamma.getAttribute('data-disabled')).toBe('');
    expect(gamma.getAttribute('aria-selected')).toBe('false');
  });

  it('persists selection by row id across reordering and temporary filtering', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSelectionHarnessComponent],
    }).createComponent(TableSelectionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta'), 'click');
    fixture.detectChanges();

    fixture.componentInstance.rows.set([
      { id: 'delta', label: 'Delta' },
      { disabled: true, id: 'gamma', label: 'Gamma' },
      { id: 'beta', label: 'Beta' },
      { id: 'alpha', label: 'Alpha' },
    ]);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta').getAttribute('data-selected')).toBe('');
    expect(fixture.componentInstance.selectedIds()).toEqual(['beta']);

    fixture.componentInstance.hiddenIds.set(['beta']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="selection-row-beta"]')).toBeNull();
    expect(fixture.componentInstance.selectedIds()).toEqual(['beta']);

    fixture.componentInstance.hiddenIds.set([]);
    fixture.detectChanges();
    expect(getByTestId<HTMLTableRowElement>(fixture, 'selection-row-beta').getAttribute('data-selected')).toBe('');
  });
});
