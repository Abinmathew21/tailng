import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableExpansionHarnessComponent,
  dispatchKeydown,
  dispatchMouseEvent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table expansion behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('toggles expansion for the targeted row only', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableExpansionHarnessComponent],
    }).createComponent(TableExpansionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-alpha'), 'click');
    fixture.detectChanges();
    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-alpha')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="detail-row-beta"]')).toBeNull();

    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-beta'), 'click');
    fixture.detectChanges();
    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-beta')).toBeTruthy();
    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-alpha')).toBeTruthy();
  });

  it('single expansion mode closes previously expanded rows', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableExpansionHarnessComponent],
    }).createComponent(TableExpansionHarnessComponent);
    fixture.componentInstance.expansionMode.set('single');
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-alpha'), 'click');
    fixture.detectChanges();
    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-beta'), 'click');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="detail-row-alpha"]')).toBeNull();
    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-beta')).toBeTruthy();
  });

  it('renders expanded content with a colspan that matches the visible column count', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableExpansionHarnessComponent],
    }).createComponent(TableExpansionHarnessComponent);
    fixture.componentInstance.visibleColumns.set([
      { id: 'label', label: 'Label' },
      { id: 'value', label: 'Value' },
    ]);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-alpha'), 'click');
    fixture.detectChanges();

    expect(getByTestId<HTMLTableCellElement>(fixture, 'detail-cell-alpha').getAttribute('colspan')).toBe('3');
  });

  it('preserves expanded rows across reordering because expansion state is keyed by row id', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableExpansionHarnessComponent],
    }).createComponent(TableExpansionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLElement>(fixture, 'expander-beta'), 'click');
    fixture.detectChanges();

    fixture.componentInstance.rows.set([
      { id: 'gamma', label: 'Gamma', status: 'Draft', value: 3 },
      { id: 'beta', label: 'Beta', status: 'Review', value: 2 },
      { id: 'alpha', label: 'Alpha', status: 'Ready', value: 1 },
    ]);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-beta')).toBeTruthy();
  });

  it('supports keyboard expansion on focusable expanders', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableExpansionHarnessComponent],
    }).createComponent(TableExpansionHarnessComponent);
    fixture.detectChanges();

    const expander = getByTestId<HTMLElement>(fixture, 'expander-alpha');
    const event = dispatchKeydown(expander, 'Enter');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(getByTestId<HTMLTableRowElement>(fixture, 'detail-row-alpha')).toBeTruthy();
    expect(fixture.componentInstance.expansionEvents.at(-1)).toMatchObject({
      expanded: true,
      rowId: 'alpha',
      trigger: 'keyboard',
    });
  });
});
