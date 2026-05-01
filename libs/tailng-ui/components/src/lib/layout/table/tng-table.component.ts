import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import type { TngTableSortDirection } from '@tailng-ui/cdk';
import {
  TngSortHeader,
  TngTable as TngTablePrimitive,
  TngTableBody,
  TngTableCell,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableRow,
  TngTableScrollContainer,
  TngTableSort,
  type TngTableDirection,
  type TngTableLayoutMode,
  type TngTableScrollAxis,
  type TngTableSortChange,
  type TngTableStickySide,
} from '@tailng-ui/primitives';

export type TngTableDensity = 'compact' | 'comfortable';
export type TngTableCellAlign = 'center' | 'end' | 'start';
export type TngTableColumnAccessor<TRow> = keyof TRow | ((row: TRow, index: number) => unknown);

export type TngTableColumn<TRow = unknown> = Readonly<{
  id: string;
  label?: string;
  accessor?: TngTableColumnAccessor<TRow>;
  align?: TngTableCellAlign;
  headerAlign?: TngTableCellAlign;
  sortable?: boolean;
  sticky?: TngTableStickySide | null;
  truncate?: boolean;
  width?: number | string | null;
}>;

export type TngTableCellContext<TRow = unknown> = Readonly<{
  $implicit: unknown;
  column: TngTableColumn<TRow>;
  columnId: string;
  row: TRow;
  rowIndex: number;
  value: unknown;
}>;

export type TngTableHeaderContext<TRow = unknown> = Readonly<{
  $implicit: TngTableColumn<TRow>;
  column: TngTableColumn<TRow>;
  columnId: string;
  label: string;
}>;

function normalizeCssLength(value: number | string | null | undefined): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeCellAlign(value: TngTableCellAlign | null | undefined): TngTableCellAlign {
  return value === 'center' || value === 'end' ? value : 'start';
}

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

@Directive({
  selector: 'ng-template[tngTableCellTemplate]',
  exportAs: 'tngTableCellTemplate',
})
export class TngTableCellTemplate<TRow = unknown> {
  public readonly columnId = input<string | null>(null, {
    alias: 'tngTableCellTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTableCellContext<TRow>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngTableHeaderTemplate]',
  exportAs: 'tngTableHeaderTemplate',
})
export class TngTableHeaderTemplate<TRow = unknown> {
  public readonly columnId = input<string | null>(null, {
    alias: 'tngTableHeaderTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTableHeaderContext<TRow>>>(TemplateRef);
}

@Component({
  selector: 'tng-table',
  imports: [
    NgTemplateOutlet,
    TngSortHeader,
    TngTablePrimitive,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
    TngTableScrollContainer,
    TngTableSort,
  ],
  templateUrl: './tng-table.component.html',
  styleUrl: './tng-table.component.css',
  exportAs: 'tngTableComponent',
})
export class TngTableComponent<TRow = unknown> {
  private readonly cellTemplates = contentChildren(TngTableCellTemplate<TRow>);
  private readonly headerTemplates = contentChildren(TngTableHeaderTemplate<TRow>);

  public readonly ariaLabel = input<string | null>('Table');
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly columns = input<readonly TngTableColumn<TRow>[]>([]);
  public readonly density = input<TngTableDensity>('comfortable');
  public readonly dir = input<TngTableDirection | null>(null);
  public readonly error = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly filterable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly items = input<readonly TRow[]>([]);
  public readonly layout = input<TngTableLayoutMode>('auto');
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pageable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly scrollAxis = input<TngTableScrollAxis>('x');
  public readonly sortActive = input<string | null | undefined>(undefined);
  public readonly sortDirection = input<TngTableSortDirection | null | undefined>(undefined);
  public readonly sortDisableClear = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly stickyHeader = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly sortChange = output<TngTableSortChange>();

  protected get visibleColumns(): readonly TngTableColumn<TRow>[] {
    return this.columns().filter((column) => column.id.trim().length > 0);
  }

  protected getColumnLabel(column: TngTableColumn<TRow>): string {
    return column.label ?? column.id;
  }

  protected getColumnWidth(column: TngTableColumn<TRow>): string | null {
    return normalizeCssLength(column.width);
  }

  protected getHeaderAlign(column: TngTableColumn<TRow>): TngTableCellAlign {
    return normalizeCellAlign(column.headerAlign ?? column.align);
  }

  protected getCellAlign(column: TngTableColumn<TRow>): TngTableCellAlign {
    return normalizeCellAlign(column.align);
  }

  protected getCellValue(row: TRow, column: TngTableColumn<TRow>, rowIndex: number): unknown {
    const accessor = column.accessor;
    if (typeof accessor === 'function') {
      return accessor(row, rowIndex);
    }

    if (typeof accessor === 'string' || typeof accessor === 'number' || typeof accessor === 'symbol') {
      return (row as Record<PropertyKey, unknown>)[accessor];
    }

    return (row as Record<PropertyKey, unknown>)[column.id];
  }

  protected getCellText(row: TRow, column: TngTableColumn<TRow>, rowIndex: number): string {
    return normalizeCellValue(this.getCellValue(row, column, rowIndex));
  }

  protected getCellTemplate(columnId: string): TngTableCellTemplate<TRow> | null {
    let fallbackTemplate: TngTableCellTemplate<TRow> | null = null;
    for (const template of this.cellTemplates()) {
      if (template.columnId() === columnId) {
        return template;
      }

      if (template.columnId() === null) {
        fallbackTemplate = template;
      }
    }

    return fallbackTemplate;
  }

  protected getHeaderTemplate(columnId: string): TngTableHeaderTemplate<TRow> | null {
    let fallbackTemplate: TngTableHeaderTemplate<TRow> | null = null;
    for (const template of this.headerTemplates()) {
      if (template.columnId() === columnId) {
        return template;
      }

      if (template.columnId() === null) {
        fallbackTemplate = template;
      }
    }

    return fallbackTemplate;
  }

  protected getCellContext(
    row: TRow,
    column: TngTableColumn<TRow>,
    rowIndex: number,
  ): TngTableCellContext<TRow> {
    const value = this.getCellValue(row, column, rowIndex);

    return {
      $implicit: value,
      column,
      columnId: column.id,
      row,
      rowIndex,
      value,
    };
  }

  protected getHeaderContext(column: TngTableColumn<TRow>): TngTableHeaderContext<TRow> {
    return {
      $implicit: column,
      column,
      columnId: column.id,
      label: this.getColumnLabel(column),
    };
  }

  protected getColspan(): number {
    return Math.max(1, this.visibleColumns.length);
  }

  protected getRowId(_row: TRow, rowIndex: number): string {
    return String(rowIndex);
  }

  protected onSortChange(event: TngTableSortChange): void {
    this.sortChange.emit(event);
  }
}

export { TngTableComponent as TngTable };
export { TngTableCellTemplate as TngTableCellTpl };
export { TngTableHeaderTemplate as TngTableHeaderTpl };
