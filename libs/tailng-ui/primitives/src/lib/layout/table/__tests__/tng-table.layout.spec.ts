import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TableLayoutHarnessComponent, getByTestId } from './tng-table.test-harness';

describe('tng-table layout features', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('supports fixed layout mode with truncation hooks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);

    fixture.componentInstance.layout.set('fixed');
    fixture.componentInstance.truncate.set(true);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'layout-table');
    const cell = getByTestId<HTMLTableCellElement>(fixture, 'layout-cell-label');

    expect(table.getAttribute('data-layout')).toBe('fixed');
    expect(table.style.tableLayout).toBe('fixed');
    expect(cell.getAttribute('data-truncate')).toBe('');
    expect(cell.style.overflow).toBe('hidden');
    expect(cell.style.textOverflow).toBe('ellipsis');
    expect(cell.style.whiteSpace).toBe('nowrap');
  });

  it('supports auto layout mode without forcing truncation styles', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'layout-table');
    const cell = getByTestId<HTMLTableCellElement>(fixture, 'layout-cell-label');

    expect(table.getAttribute('data-layout')).toBe('auto');
    expect(table.style.tableLayout).toBe('auto');
    expect(cell.hasAttribute('data-truncate')).toBe(false);
    expect(cell.style.overflow).toBe('');
  });

  it('applies sticky header and footer insets to section cells', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);

    fixture.componentInstance.stickyHeader.set(true);
    fixture.componentInstance.stickyFooter.set(true);
    fixture.detectChanges();

    const header = getByTestId<HTMLElement>(fixture, 'layout-header');
    const footer = getByTestId<HTMLElement>(fixture, 'layout-footer');
    const headerCell = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-label');
    const footerCell = getByTestId<HTMLTableCellElement>(fixture, 'layout-footer-label');

    expect(header.getAttribute('data-sticky')).toBe('');
    expect(footer.getAttribute('data-sticky')).toBe('');
    expect(headerCell.getAttribute('data-sticky-header')).toBe('');
    expect(headerCell.style.position).toBe('sticky');
    expect(headerCell.style.top).toBe('12px');
    expect(footerCell.getAttribute('data-sticky-footer')).toBe('');
    expect(footerCell.style.position).toBe('sticky');
    expect(footerCell.style.bottom).toBe('8px');
  });

  it('applies explicit sticky column offsets in ltr without overlap', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);

    fixture.componentInstance.labelStickySide.set('start');
    fixture.componentInstance.statusStickySide.set('start');
    fixture.componentInstance.statusStickyOffset.set('120px');
    fixture.componentInstance.valueStickySide.set('end');
    fixture.detectChanges();

    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-label');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-status');
    const headerValue = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-value');
    const bodyStatus = getByTestId<HTMLTableCellElement>(fixture, 'layout-cell-status');
    const bodyValue = getByTestId<HTMLTableCellElement>(fixture, 'layout-cell-value');

    expect(headerLabel.style.position).toBe('sticky');
    expect(headerLabel.style.left).toBe('0px');
    expect(headerStatus.style.left).toBe('120px');
    expect(headerValue.style.right).toBe('0px');
    expect(bodyStatus.style.left).toBe('120px');
    expect(bodyValue.style.right).toBe('0px');
  });

  it('maps sticky start and end columns to the opposite physical sides in rtl', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);

    fixture.componentInstance.dir.set('rtl');
    fixture.componentInstance.labelStickySide.set('start');
    fixture.componentInstance.statusStickySide.set('start');
    fixture.componentInstance.statusStickyOffset.set('120px');
    fixture.componentInstance.valueStickySide.set('end');
    fixture.detectChanges();

    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-label');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-status');
    const headerValue = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-value');

    expect(headerLabel.style.right).toBe('0px');
    expect(headerLabel.style.left).toBe('');
    expect(headerStatus.style.right).toBe('120px');
    expect(headerValue.style.left).toBe('0px');
    expect(headerValue.style.right).toBe('');
  });

  it('provides a horizontal scroll container for responsive overflow', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);
    fixture.detectChanges();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'layout-scroll');

    expect(scrollContainer.getAttribute('data-slot')).toBe('table-scroll-container');
    expect(scrollContainer.getAttribute('data-overflow-axis')).toBe('x');
    expect(scrollContainer.style.display).toBe('block');
    expect(scrollContainer.style.maxWidth).toBe('100%');
    expect(scrollContainer.style.overflowX).toBe('auto');
    expect(scrollContainer.style.overflowY).toBe('hidden');
  });
});
