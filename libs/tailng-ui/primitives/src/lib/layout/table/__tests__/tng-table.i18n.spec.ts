import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableLayoutHarnessComponent,
  TableRenderingHarnessComponent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table rtl and localization', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('applies rtl direction to the scroll container while keeping sticky columns pinned correctly', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableLayoutHarnessComponent],
    }).createComponent(TableLayoutHarnessComponent);

    fixture.componentInstance.dir.set('rtl');
    fixture.componentInstance.labelStickySide.set('start');
    fixture.componentInstance.statusStickySide.set('start');
    fixture.componentInstance.statusStickyOffset.set('120px');
    fixture.componentInstance.valueStickySide.set('end');
    fixture.detectChanges();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'layout-scroll');
    const headerLabel = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-label');
    const headerStatus = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-status');
    const headerValue = getByTestId<HTMLTableCellElement>(fixture, 'layout-header-value');

    expect(scrollContainer.getAttribute('dir')).toBe('rtl');
    expect(scrollContainer.style.direction).toBe('rtl');
    expect(headerLabel.style.right).toBe('0px');
    expect(headerStatus.style.right).toBe('120px');
    expect(headerValue.style.left).toBe('0px');
  });

  it('formats localized number and date values with the provided intl helpers', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    const expectedNumber = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(fixture.componentInstance.localizedNumberValue());
    const expectedFooterNumber = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(fixture.componentInstance.localizedFooterValue());
    const expectedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
      year: 'numeric',
    }).format(fixture.componentInstance.rows()[0].updatedAt);

    expect(getByTestId<HTMLTableCellElement>(fixture, 'localized-number-cell').textContent?.trim()).toBe(
      expectedNumber,
    );
    expect(getByTestId<HTMLTableCellElement>(fixture, 'localized-date-cell').textContent?.trim()).toBe(
      expectedDate,
    );
    expect(getByTestId<HTMLTableCellElement>(fixture, 'localized-footer-cell').textContent?.trim()).toBe(
      expectedFooterNumber,
    );
  });
});
