import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableInteractionHarnessComponent,
  dispatchMouseEvent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table row and cell interactions', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('emits rowClick with the row id and original event', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableInteractionHarnessComponent],
    }).createComponent(TableInteractionHarnessComponent);
    fixture.detectChanges();

    const row = getByTestId<HTMLTableRowElement>(fixture, 'interaction-row-alpha');
    const event = dispatchMouseEvent(row, 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.rowClicks).toHaveLength(1);
    expect(fixture.componentInstance.rowClicks[0]).toMatchObject({
      originalEvent: event,
      rowId: 'alpha',
    });
  });

  it('emits cellClick with row and column context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableInteractionHarnessComponent],
    }).createComponent(TableInteractionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLTableCellElement>(fixture, 'interaction-cell-beta'), 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.cellClicks[0]).toMatchObject({
      columnId: 'label',
      rowId: 'beta',
    });
  });

  it('does not bubble action-button clicks into rowClick when propagation is stopped', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableInteractionHarnessComponent],
    }).createComponent(TableInteractionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLButtonElement>(fixture, 'row-action-alpha'), 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.rowClicks).toHaveLength(0);
    expect(fixture.componentInstance.cellClicks).toHaveLength(0);
  });

  it('emits context menu events with the row context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableInteractionHarnessComponent],
    }).createComponent(TableInteractionHarnessComponent);
    fixture.detectChanges();

    dispatchMouseEvent(getByTestId<HTMLTableRowElement>(fixture, 'interaction-row-beta'), 'contextmenu');
    fixture.detectChanges();

    expect(fixture.componentInstance.rowContextMenus[0]).toMatchObject({
      rowId: 'beta',
    });
  });
});
