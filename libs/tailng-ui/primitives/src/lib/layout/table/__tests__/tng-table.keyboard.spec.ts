import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  TableKeyboardHarnessComponent,
  TableKeyboardSpanHarnessComponent,
  dispatchKeydown,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table keyboard navigation and focus', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('uses the first enabled header cell as the initial tab stop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const before = getByTestId<HTMLButtonElement>(fixture, 'before');
    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-status');

    expect(headerLabel.getAttribute('tabindex')).toBe('0');
    expect(headerStatus.getAttribute('tabindex')).toBe('-1');

    before.focus();
    fixture.detectChanges();

    dispatchKeydown(before, 'Tab');
    headerLabel.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(headerLabel);
    expect(headerLabel.getAttribute('data-focused')).toBe('');
  });

  it('moves focus with arrow keys and skips disabled rows', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label');
    headerLabel.focus();
    fixture.detectChanges();

    let event = dispatchKeydown(headerLabel, 'ArrowRight');
    fixture.detectChanges();

    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-status');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(headerStatus);

    event = dispatchKeydown(headerStatus, 'ArrowDown');
    fixture.detectChanges();

    const alphaStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-alpha-status');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(alphaStatus);

    event = dispatchKeydown(alphaStatus, 'ArrowDown');
    fixture.detectChanges();

    const gammaStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-status');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(gammaStatus);

    event = dispatchKeydown(gammaStatus, 'ArrowLeft');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-label'),
    );
  });

  it('supports Home, End, Ctrl+Home, and Ctrl+End navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const gammaStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-status');
    gammaStatus.focus();
    fixture.detectChanges();

    dispatchKeydown(gammaStatus, 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-label'),
    );

    dispatchKeydown(getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-label'), 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-value'),
    );

    dispatchKeydown(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-value'),
      'Home',
      { ctrlKey: true },
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label'),
    );

    dispatchKeydown(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label'),
      'End',
      { ctrlKey: true },
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-value'),
    );
  });

  it('supports PageUp and PageDown within the current column', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const alphaStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-alpha-status');
    alphaStatus.focus();
    fixture.detectChanges();

    let event = dispatchKeydown(alphaStatus, 'PageDown');
    fixture.detectChanges();

    const gammaStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-status');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(gammaStatus);

    event = dispatchKeydown(gammaStatus, 'PageUp');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-status'),
    );
  });

  it('maps rowspan cells to their full visual footprint for keyboard navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardSpanHarnessComponent],
    }).createComponent(TableKeyboardSpanHarnessComponent);
    fixture.detectChanges();

    const group = getByTestId<HTMLTableCellElement>(fixture, 'span-group-engineering');
    const alice = getByTestId<HTMLTableCellElement>(fixture, 'span-name-alice');
    const bob = getByTestId<HTMLTableCellElement>(fixture, 'span-name-bob');
    const sales = getByTestId<HTMLTableCellElement>(fixture, 'span-group-sales');

    expect(group.getAttribute('rowspan')).toBe('2');

    group.focus();
    fixture.detectChanges();

    let event = dispatchKeydown(group, 'ArrowRight');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(alice);

    event = dispatchKeydown(alice, 'ArrowDown');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(bob);

    event = dispatchKeydown(bob, 'ArrowLeft');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(group);

    event = dispatchKeydown(group, 'ArrowDown');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(group);

    bob.focus();
    fixture.detectChanges();

    event = dispatchKeydown(bob, 'ArrowDown');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'span-name-dave'),
    );

    sales.focus();
    fixture.detectChanges();

    event = dispatchKeydown(sales, 'ArrowRight');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      getByTestId<HTMLTableCellElement>(fixture, 'span-name-dave'),
    );
  });

  it('restores focus to the external trigger on Escape', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const before = getByTestId<HTMLButtonElement>(fixture, 'before');
    const gammaValue = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-value');

    before.focus();
    fixture.detectChanges();

    gammaValue.focus();
    fixture.detectChanges();

    const event = dispatchKeydown(gammaValue, 'Escape');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(before);
    expect(gammaValue.hasAttribute('data-focused')).toBe(false);
    expect(gammaValue.getAttribute('tabindex')).toBe('0');
  });

  it('clears focused state when focus leaves while keeping the roving tab stop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label');
    const after = getByTestId<HTMLButtonElement>(fixture, 'after');

    headerLabel.focus();
    fixture.detectChanges();

    dispatchKeydown(headerLabel, 'ArrowRight');
    fixture.detectChanges();

    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-status');
    expect(headerStatus.getAttribute('data-focused')).toBe('');
    expect(headerStatus.getAttribute('data-focus-visible')).toBe('');

    after.focus();
    fixture.detectChanges();

    expect(headerStatus.hasAttribute('data-focused')).toBe(false);
    expect(headerStatus.hasAttribute('data-focus-visible')).toBe(false);
    expect(headerStatus.getAttribute('tabindex')).toBe('0');
  });

  it('does not prevent default for Tab so focus can leave the table naturally', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-header-label');
    headerLabel.focus();
    fixture.detectChanges();

    const event = dispatchKeydown(headerLabel, 'Tab');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
  });

  it('restores focus when the table is destroyed while focus is inside it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableKeyboardHarnessComponent],
    }).createComponent(TableKeyboardHarnessComponent);
    fixture.detectChanges();

    const before = getByTestId<HTMLButtonElement>(fixture, 'before');
    const gammaValue = getByTestId<HTMLTableCellElement>(fixture, 'keyboard-cell-gamma-value');
    const focusSpy = vi.spyOn(before, 'focus');

    before.focus();
    fixture.detectChanges();
    focusSpy.mockClear();

    gammaValue.focus();
    fixture.detectChanges();

    fixture.componentInstance.showTable.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(focusSpy).toHaveBeenCalled();
  });
});
