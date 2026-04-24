import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TableSizingHarnessComponent, getByTestId } from './tng-table.test-harness';

function dispatchDocumentMouseEvent(
  type: 'mousemove' | 'mouseup',
  init: MouseEventInit = {},
): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init,
  });

  document.dispatchEvent(event);
  return event;
}

describe('tng-table column sizing and resizing', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('applies default widths and lets controlled widths override them', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSizingHarnessComponent],
    }).createComponent(TableSizingHarnessComponent);
    fixture.detectChanges();

    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'sizing-header-status');
    const cellStatus = getByTestId<HTMLTableCellElement>(fixture, 'sizing-cell-status');

    expect(headerStatus.style.width).toBe('140px');
    expect(cellStatus.style.width).toBe('140px');
    expect(headerStatus.style.minWidth).toBe('120px');
    expect(headerStatus.style.maxWidth).toBe('220px');

    fixture.componentInstance.widths.set({
      status: '180px',
    });
    fixture.detectChanges();

    expect(headerStatus.style.width).toBe('180px');
    expect(cellStatus.style.width).toBe('180px');
  });

  it('updates the column width live while dragging a resizer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSizingHarnessComponent],
    }).createComponent(TableSizingHarnessComponent);
    fixture.detectChanges();

    const resizer = getByTestId<HTMLElement>(fixture, 'status-resizer');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'sizing-header-status');

    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }),
    );
    dispatchDocumentMouseEvent('mousemove', {
      clientX: 160,
    });
    fixture.detectChanges();
    dispatchDocumentMouseEvent('mouseup');

    expect(headerStatus.style.width).toBe('200px');
    expect(fixture.componentInstance.widthEvents.at(-1)).toEqual({
      status: '200px',
    });
  });

  it('clamps resized widths between the configured min and max values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSizingHarnessComponent],
    }).createComponent(TableSizingHarnessComponent);
    fixture.detectChanges();

    const resizer = getByTestId<HTMLElement>(fixture, 'status-resizer');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'sizing-header-status');

    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }),
    );
    dispatchDocumentMouseEvent('mousemove', {
      clientX: 320,
    });
    fixture.detectChanges();
    dispatchDocumentMouseEvent('mouseup');

    expect(headerStatus.style.width).toBe('220px');

    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }),
    );
    dispatchDocumentMouseEvent('mousemove', {
      clientX: -40,
    });
    fixture.detectChanges();
    dispatchDocumentMouseEvent('mouseup');

    expect(headerStatus.style.width).toBe('120px');
  });

  it('restores persisted widths when a new table instance receives them', () => {
    const firstFixture = TestBed.configureTestingModule({
      imports: [TableSizingHarnessComponent],
    }).createComponent(TableSizingHarnessComponent);
    firstFixture.detectChanges();

    const firstResizer = getByTestId<HTMLElement>(firstFixture, 'status-resizer');
    firstResizer.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }),
    );
    dispatchDocumentMouseEvent('mousemove', {
      clientX: 140,
    });
    firstFixture.detectChanges();
    dispatchDocumentMouseEvent('mouseup');

    const persistedWidths = firstFixture.componentInstance.widths();
    expect(persistedWidths).toEqual({
      status: '180px',
    });

    const secondFixture = TestBed.createComponent(TableSizingHarnessComponent);
    secondFixture.componentInstance.widths.set(persistedWidths);
    secondFixture.detectChanges();

    const secondHeaderStatus = getByTestId<HTMLTableCellElement>(secondFixture, 'sizing-header-status');
    const secondCellStatus = getByTestId<HTMLTableCellElement>(secondFixture, 'sizing-cell-status');

    expect(secondHeaderStatus.style.width).toBe('180px');
    expect(secondCellStatus.style.width).toBe('180px');
  });

  it('inverts drag direction in rtl so moving left grows the column', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSizingHarnessComponent],
    }).createComponent(TableSizingHarnessComponent);

    fixture.componentInstance.dir.set('rtl');
    fixture.detectChanges();

    const resizer = getByTestId<HTMLElement>(fixture, 'status-resizer');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'sizing-header-status');

    resizer.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }),
    );
    dispatchDocumentMouseEvent('mousemove', {
      clientX: 60,
    });
    fixture.detectChanges();
    dispatchDocumentMouseEvent('mouseup');

    expect(headerStatus.style.width).toBe('180px');
    expect(fixture.componentInstance.widthEvents.at(-1)).toEqual({
      status: '180px',
    });
  });
});
