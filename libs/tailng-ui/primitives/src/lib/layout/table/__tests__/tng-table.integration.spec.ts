import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableControlledIntegrationHarnessComponent,
  TableEmbeddedIntegrationHarnessComponent,
  dispatchKeydown,
  dispatchMouseEvent,
  getByTestId,
} from './tng-table.test-harness';

function getRenderedControlledRowIds(fixture: { nativeElement: HTMLElement }): readonly string[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLTableRowElement>('[data-testid^="controlled-row-"]'))
    .map((row) => row.getAttribute('data-row-id'))
    .filter((rowId): rowId is string => rowId !== null);
}

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  standalone: true,
  template: `Detail route`,
})
class DetailRouteComponent {}

describe('tng-table integration contracts', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('allows router links inside cells to navigate without row or cell hijacking', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DetailRouteComponent, TableEmbeddedIntegrationHarnessComponent],
      providers: [provideRouter([{ component: DetailRouteComponent, path: 'detail/:id' }])],
    }).createComponent(TableEmbeddedIntegrationHarnessComponent);

    await settle(fixture);

    const router = TestBed.inject(Router);
    const link = getByTestId<HTMLAnchorElement>(fixture, 'integration-link-alpha');

    link.click();
    await settle(fixture);

    expect(router.url).toBe('/detail/alpha');
    expect(fixture.componentInstance.selectedIds()).toEqual([]);
    expect(fixture.componentInstance.rowClicks).toHaveLength(0);
    expect(fixture.componentInstance.cellClicks).toHaveLength(0);
  });

  it('keeps input and select controls usable without stealing clicks or keyboard events', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DetailRouteComponent, TableEmbeddedIntegrationHarnessComponent],
      providers: [provideRouter([{ component: DetailRouteComponent, path: 'detail/:id' }])],
    }).createComponent(TableEmbeddedIntegrationHarnessComponent);

    await settle(fixture);

    const input = getByTestId<HTMLInputElement>(fixture, 'integration-input-alpha');
    const select = getByTestId<HTMLSelectElement>(fixture, 'integration-select-alpha');

    dispatchMouseEvent(input, 'click');
    input.focus();
    const inputEvent = dispatchKeydown(input, 'ArrowRight');

    dispatchMouseEvent(select, 'click');
    select.focus();
    const selectEvent = dispatchKeydown(select, 'ArrowDown');

    fixture.detectChanges();

    expect(inputEvent.defaultPrevented).toBe(false);
    expect(selectEvent.defaultPrevented).toBe(false);
    expect(document.activeElement === input || document.activeElement === select).toBe(true);
    expect(fixture.componentInstance.selectedIds()).toEqual([]);
    expect(fixture.componentInstance.rowClicks).toHaveLength(0);
    expect(fixture.componentInstance.cellClicks).toHaveLength(0);
  });

  it('opens popovers inside table cells without bubbling into row selection or click handlers', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DetailRouteComponent, TableEmbeddedIntegrationHarnessComponent],
      providers: [provideRouter([{ component: DetailRouteComponent, path: 'detail/:id' }])],
    }).createComponent(TableEmbeddedIntegrationHarnessComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'integration-popover-trigger-alpha');
    const panel = getByTestId<HTMLElement>(fixture, 'integration-popover-panel-alpha');

    expect(panel.getAttribute('hidden')).toBe('');

    trigger.click();
    await settle(fixture);

    expect(panel.getAttribute('hidden')).toBeNull();
    expect(panel.getAttribute('data-state')).toBe('open');
    expect(fixture.componentInstance.selectedIds()).toEqual([]);
    expect(fixture.componentInstance.rowClicks).toHaveLength(0);
    expect(fixture.componentInstance.cellClicks).toHaveLength(0);
  });

  it('supports externally controlled sort, filter, and pagination without state divergence', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableControlledIntegrationHarnessComponent],
    }).createComponent(TableControlledIntegrationHarnessComponent);
    fixture.detectChanges();

    const header = getByTestId<HTMLTableCellElement>(fixture, 'controlled-sort-header');
    const filterInput = getByTestId<HTMLInputElement>(fixture, 'controlled-filter');
    const nextPageButton = getByTestId<HTMLButtonElement>(fixture, 'controlled-page-next');

    expect(getRenderedControlledRowIds(fixture)).toEqual(['gamma', 'alpha']);

    header.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sortEvents.at(-1)).toMatchObject({
      activeColumnId: 'label',
      direction: 'asc',
    });
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(getRenderedControlledRowIds(fixture)).toEqual(['alpha', 'beta']);

    nextPageButton.click();
    fixture.detectChanges();
    expect(getRenderedControlledRowIds(fixture)).toEqual(['delta', 'gamma']);

    filterInput.value = 'ga';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(getRenderedControlledRowIds(fixture)).toEqual(['gamma']);
    expect(fixture.componentInstance.pageIndex()).toBe(0);
    expect(fixture.componentInstance.sortRef?.getState()).toMatchObject({
      activeColumnId: 'label',
      direction: 'asc',
    });
  });
});
