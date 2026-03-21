import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createGridHarnessFixture,
  getCell,
  getGrid,
  getRow,
} from './tng-grid.test-harness';

describe('tng-grid primitive rendering and aria contract', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders grid, rows, and cells with computed aria counts and default tab stop', async () => {
    const fixture = await createGridHarnessFixture();

    const grid = getGrid(fixture);
    const row0 = getRow(fixture, 0);
    const cell00 = getCell(fixture, 0, 0);
    const cell01 = getCell(fixture, 0, 1);
    const cell02 = getCell(fixture, 0, 2);

    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toBe('Harness grid');
    expect(grid.getAttribute('aria-rowcount')).toBe('3');
    expect(grid.getAttribute('aria-colcount')).toBe('3');

    expect(row0.getAttribute('role')).toBe('row');

    expect(cell00.getAttribute('role')).toBe('columnheader');
    expect(cell00.getAttribute('tabindex')).toBe('0');
    expect(cell01.getAttribute('tabindex')).toBe('-1');
    expect(cell01.getAttribute('aria-disabled')).toBe('true');
    expect(cell01.hasAttribute('data-disabled')).toBe(true);
    expect(cell02.getAttribute('tabindex')).toBe('-1');
  });

  it('applies row/column metadata and omits aria-selected for header cells without explicit selection', async () => {
    const fixture = await createGridHarnessFixture();
    const header = getCell(fixture, 0, 0);
    const spanned = getCell(fixture, 1, 1);

    expect(header.getAttribute('aria-rowindex')).toBe('1');
    expect(header.getAttribute('aria-colindex')).toBe('1');
    expect(header.getAttribute('aria-selected')).toBeNull();
    expect(header.getAttribute('data-row-index')).toBe('0');
    expect(header.getAttribute('data-col-index')).toBe('0');

    expect(spanned.getAttribute('aria-rowspan')).toBe('2');
    expect(spanned.getAttribute('aria-colspan')).toBe('2');
    expect(spanned.getAttribute('data-row-span')).toBe('2');
    expect(spanned.getAttribute('data-col-span')).toBe('2');
  });

  it('respects explicit row and column counts when provided', async () => {
    const fixture = await createGridHarnessFixture({
      ariaColcount: 8,
      ariaRowcount: 6,
    });

    const grid = getGrid(fixture);
    expect(grid.getAttribute('aria-rowcount')).toBe('6');
    expect(grid.getAttribute('aria-colcount')).toBe('8');
  });
});
