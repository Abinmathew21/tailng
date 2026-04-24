import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TableVirtualHarnessComponent, getByTestId } from './tng-table.test-harness';

function dispatchScroll(element: HTMLElement, scrollTop: number): void {
  element.scrollTop = scrollTop;
  element.dispatchEvent(new Event('scroll'));
}

function getRenderedRowIds(fixture: { nativeElement: HTMLElement }): readonly string[] {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('[data-testid^="virtual-row-"]'))
    .map((row) => row.getAttribute('data-row-id'))
    .filter((rowId): rowId is string => rowId !== null);
}

describe('tng-table virtualization', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders only the visible row window when virtualization is enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);
    fixture.detectChanges();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'virtual-scroll');
    const bottomSpacer = getByTestId<HTMLTableRowElement>(fixture, 'virtual-bottom-spacer');

    expect(scrollContainer.getAttribute('data-virtualized')).toBe('');
    expect(scrollContainer.getAttribute('data-virtual-start')).toBe('0');
    expect(scrollContainer.getAttribute('data-virtual-end')).toBe('3');
    expect(getRenderedRowIds(fixture)).toEqual(['row-0', 'row-1', 'row-2']);
    expect(fixture.nativeElement.querySelector('[data-testid="virtual-top-spacer"]')).toBeNull();
    expect(bottomSpacer.getAttribute('data-size')).toBe('680');
  });

  it('updates the rendered window and spacer sizes as the viewport scrolls', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);
    fixture.detectChanges();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'virtual-scroll');

    dispatchScroll(scrollContainer, 160);
    fixture.detectChanges();

    const topSpacer = getByTestId<HTMLTableRowElement>(fixture, 'virtual-top-spacer');
    const bottomSpacer = getByTestId<HTMLTableRowElement>(fixture, 'virtual-bottom-spacer');

    expect(scrollContainer.getAttribute('data-virtual-start')).toBe('4');
    expect(scrollContainer.getAttribute('data-virtual-end')).toBe('7');
    expect(getRenderedRowIds(fixture)).toEqual(['row-4', 'row-5', 'row-6']);
    expect(topSpacer.getAttribute('data-size')).toBe('160');
    expect(bottomSpacer.getAttribute('data-size')).toBe('520');
  });

  it('keeps sticky headers intact while rendering a virtualized body window', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);

    fixture.componentInstance.stickyHeader.set(true);
    fixture.detectChanges();

    const header = getByTestId<HTMLElement>(fixture, 'virtual-header');
    const hostElement = fixture.nativeElement as HTMLElement;
    const headerCell = hostElement.querySelector<HTMLTableCellElement>(
      '[data-slot="table-header-cell"]',
    );
    const scrollContainer = getByTestId<HTMLElement>(fixture, 'virtual-scroll');

    dispatchScroll(scrollContainer, 200);
    fixture.detectChanges();

    expect(header.getAttribute('data-sticky')).toBe('');
    expect(headerCell?.style.top).toBe('0px');
    expect(getRenderedRowIds(fixture)).toEqual(['row-5', 'row-6', 'row-7']);
  });

  it('preserves selection for offscreen rows when they enter the virtual window', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);
    fixture.detectChanges();

    fixture.componentInstance.selectionRef?.replace('row-8');
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds()).toEqual(['row-8']);
    expect(fixture.nativeElement.querySelector('[data-testid="virtual-row-row-8"]')).toBeNull();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'virtual-scroll');
    dispatchScroll(scrollContainer, 320);
    fixture.detectChanges();

    const row = getByTestId<HTMLTableRowElement>(fixture, 'virtual-row-row-8');
    expect(row.getAttribute('data-selected')).toBe('');
    expect(getRenderedRowIds(fixture)).toEqual(['row-8', 'row-9', 'row-10']);
  });
});
