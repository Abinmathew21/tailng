import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createGridHarnessFixture,
  dispatchGridKeydown,
  getCell,
  getOutsideButton,
} from './tng-grid.test-harness';

describe('tng-grid primitive keyboard navigation', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('moves focus with arrows and skips disabled cells', async () => {
    const fixture = await createGridHarnessFixture();
    const cell00 = getCell(fixture, 0, 0);

    cell00.focus();
    fixture.detectChanges();

    let event = dispatchGridKeydown(cell00, 'ArrowRight');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getCell(fixture, 0, 2));

    event = dispatchGridKeydown(getCell(fixture, 0, 2), 'ArrowDown');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getCell(fixture, 1, 2));

    event = dispatchGridKeydown(getCell(fixture, 1, 2), 'ArrowLeft');
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getCell(fixture, 1, 1));
  });

  it('supports Home, End, Ctrl+Home, and Ctrl+End navigation', async () => {
    const fixture = await createGridHarnessFixture();
    const cell12 = getCell(fixture, 1, 2);

    cell12.focus();
    fixture.detectChanges();

    dispatchGridKeydown(cell12, 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 1, 0));

    dispatchGridKeydown(getCell(fixture, 1, 0), 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 1, 2));

    dispatchGridKeydown(getCell(fixture, 1, 2), 'Home', { ctrlKey: true });
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 0, 0));

    dispatchGridKeydown(getCell(fixture, 0, 0), 'End', { ctrlKey: true });
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 2, 2));
  });

  it('wraps within rows and columns when wrap=true', async () => {
    const fixture = await createGridHarnessFixture({
      wrap: true,
    });

    const lastCell = getCell(fixture, 2, 2);
    lastCell.focus();
    fixture.detectChanges();

    dispatchGridKeydown(lastCell, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 2, 0));

    dispatchGridKeydown(getCell(fixture, 2, 0), 'ArrowUp');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getCell(fixture, 1, 0));
  });

  it('clears focused and focus-visible state when focus leaves the grid', async () => {
    const fixture = await createGridHarnessFixture();
    const cell00 = getCell(fixture, 0, 0);

    cell00.focus();
    fixture.detectChanges();
    dispatchGridKeydown(cell00, 'ArrowRight');
    fixture.detectChanges();

    const target = getCell(fixture, 0, 2);
    expect(target.hasAttribute('data-focused')).toBe(true);
    expect(target.hasAttribute('data-focus-visible')).toBe(true);

    getOutsideButton(fixture).focus();
    fixture.detectChanges();

    expect(target.hasAttribute('data-focused')).toBe(false);
    expect(target.hasAttribute('data-focus-visible')).toBe(false);
    expect(target.getAttribute('tabindex')).toBe('0');
  });

  it('does not prevent default for Tab and lets focus leave the grid', async () => {
    const fixture = await createGridHarnessFixture();
    const cell00 = getCell(fixture, 0, 0);

    cell00.focus();
    fixture.detectChanges();

    const event = dispatchGridKeydown(cell00, 'Tab');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
  });
});
