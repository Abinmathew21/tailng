import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createGridHarnessFixture,
  dispatchGridKeydown,
  getCell,
} from './tng-grid.test-harness';

describe('tng-grid primitive selection and controlled focus', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('selects and activates the focused cell with Enter in single selection mode', async () => {
    const fixture = await createGridHarnessFixture({
      selectionMode: 'single',
    });

    const cell10 = getCell(fixture, 1, 0);
    cell10.focus();
    fixture.detectChanges();

    const event = dispatchGridKeydown(cell10, 'Enter');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.valueChanges.at(-1)).toEqual({ col: 0, row: 1 });
    expect(fixture.componentInstance.activateEvents.at(-1)).toEqual({
      col: 0,
      row: 1,
      trigger: 'keyboard',
    });
    expect(cell10.getAttribute('aria-selected')).toBe('true');
    expect(cell10.hasAttribute('data-selected')).toBe(true);
    expect(cell10.hasAttribute('data-activated')).toBe(true);
  });

  it('selects the clicked cell in single selection mode and emits pointer activation on double click', async () => {
    const fixture = await createGridHarnessFixture({
      selectionMode: 'single',
    });

    const cell21 = getCell(fixture, 2, 1);

    cell21.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    cell21.focus();
    cell21.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges.at(-1)).toEqual({ col: 1, row: 2 });
    expect(cell21.getAttribute('aria-selected')).toBe('true');

    cell21.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.activateEvents.at(-1)).toEqual({
      col: 1,
      row: 2,
      trigger: 'pointer',
    });
  });

  it('emits focus change outputs without mutating controlled focus inputs', async () => {
    const fixture = await createGridHarnessFixture({
      focusCol: 0,
      focusRow: 1,
    });

    const controlledCell = getCell(fixture, 1, 0);
    expect(controlledCell.getAttribute('tabindex')).toBe('0');

    controlledCell.focus();
    fixture.detectChanges();
    dispatchGridKeydown(controlledCell, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(getCell(fixture, 1, 1));
    expect(fixture.componentInstance.focusRow).toBe(1);
    expect(fixture.componentInstance.focusCol).toBe(0);
    expect(fixture.componentInstance.focusRowChanges.at(-1)).toBe(1);
    expect(fixture.componentInstance.focusColChanges.at(-1)).toBe(1);
    expect(fixture.componentInstance.focusEvents.at(-1)).toMatchObject({
      col: 1,
      previousCol: 0,
      previousRow: 1,
      row: 1,
      trigger: 'keyboard',
    });
  });
});
