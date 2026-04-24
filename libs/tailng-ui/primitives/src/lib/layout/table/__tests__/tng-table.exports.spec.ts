import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createTngTableIntlDateFormatter,
  createTngTableIntlFormatter,
  createTngTableIntlNumberFormatter,
  TngTableBody,
  TngTableCell,
  TngTableCellOutlet,
  TngTableCellTpl,
  TngTableEmpty,
  TngTableError,
  TngTableExpansion,
  TngTableFooter,
  TngTableFooterOutlet,
  TngTableFooterTpl,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableHeaderOutlet,
  TngTableHeaderTpl,
  TngTableLoading,
  TngTablePagination,
  TngTableRow,
  TngTableRowExpander,
  TngTableSelection,
  TngTableSort,
  TngTable,
  TngTableToolbar,
  TngTableVirtual,
  TngTableVirtualSpacer,
} from '..';
import { TableHarnessComponent } from './tng-table.test-harness';

describe('tng-table exports and attachment', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngTable symbol', () => {
    expect(typeof TngTable).toBe('function');
  });

  it('exports the interactive and utility table directives', () => {
    expect(typeof TngTableRow).toBe('function');
    expect(typeof TngTableCell).toBe('function');
    expect(typeof TngTableHeaderCell).toBe('function');
    expect(typeof TngTableSelection).toBe('function');
    expect(typeof TngTableExpansion).toBe('function');
    expect(typeof TngTableRowExpander).toBe('function');
    expect(typeof TngTableSort).toBe('function');
    expect(typeof TngTableCellTpl).toBe('function');
    expect(typeof TngTableHeaderTpl).toBe('function');
    expect(typeof TngTableFooterTpl).toBe('function');
    expect(typeof TngTableCellOutlet).toBe('function');
    expect(typeof TngTableHeaderOutlet).toBe('function');
    expect(typeof TngTableFooterOutlet).toBe('function');
    expect(typeof TngTableToolbar).toBe('function');
    expect(typeof TngTablePagination).toBe('function');
    expect(typeof TngTableLoading).toBe('function');
    expect(typeof TngTableEmpty).toBe('function');
    expect(typeof TngTableError).toBe('function');
    expect(typeof TngTableVirtual).toBe('function');
    expect(typeof TngTableVirtualSpacer).toBe('function');
    expect(typeof createTngTableIntlNumberFormatter).toBe('function');
    expect(typeof createTngTableIntlDateFormatter).toBe('function');
    expect(typeof createTngTableIntlFormatter).toBe('function');
  });

  it('attaches to <table tngTable> without runtime errors', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.tableRef).toBeInstanceOf(TngTable);
  });

  it('exports the public header, body, and footer slot directives', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.headerRef).toBeInstanceOf(TngTableHeader);
    expect(fixture.componentInstance.bodyRef).toBeInstanceOf(TngTableBody);
    expect(fixture.componentInstance.footerRef).toBeInstanceOf(TngTableFooter);
  });
});
