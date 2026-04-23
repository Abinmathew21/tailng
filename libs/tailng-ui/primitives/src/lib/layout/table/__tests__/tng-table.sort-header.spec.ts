import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableSortHarnessComponent,
  dispatchKeydown,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-sort-header directive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('toggles sort direction on click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'sort-header');

    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('data-sort-direction')).toBe('asc');

    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('data-sort-direction')).toBe('desc');
  });

  it('toggles sort direction on Enter and Space keyboard activation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'sort-header');

    const enterEvent = dispatchKeydown(header, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(header.getAttribute('data-sort-direction')).toBe('asc');

    const spaceEvent = dispatchKeydown(header, ' ');
    fixture.detectChanges();
    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(header.getAttribute('data-sort-direction')).toBe('desc');
  });

  it('updates aria-sort as the sort direction changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'sort-header');
    expect(header.getAttribute('aria-sort')).toBe('none');

    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('ascending');

    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('descending');

    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-sort')).toBe('none');
  });

  it('does nothing when the sort header is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.componentInstance.headerDisabled.set(true);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'sort-header');
    header.click();
    fixture.detectChanges();

    expect(header.getAttribute('data-sort-direction')).toBeNull();
    expect(header.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects controlled sort state updates from the host inputs', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableSortHarnessComponent],
    }).createComponent(TableSortHarnessComponent);
    fixture.componentInstance.controlled.set(true);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'sort-header');

    fixture.componentInstance.activeColumnId.set('label');
    fixture.componentInstance.direction.set('desc');
    fixture.detectChanges();

    expect(header.getAttribute('data-sort-active')).toBe('');
    expect(header.getAttribute('data-sort-direction')).toBe('desc');
    expect(header.getAttribute('aria-sort')).toBe('descending');
  });
});
