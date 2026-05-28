import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  isDevMode,
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

export type TngTableLeafColumn<TRow = unknown> = Readonly<{
  id: string;
  label?: string;
  accessor?: TngTableColumnAccessor<TRow>;
  align?: TngTableCellAlign;
  headerAlign?: TngTableCellAlign;
  sortable?: boolean;
  sticky?: TngTableStickySide | null;
  truncate?: boolean;
  width?: number | string | null;
  hidden?: boolean;
  children?: never;
}>;

export type TngTableGroupColumn<TRow = unknown> = Readonly<{
  id: string;
  label?: string;
  headerAlign?: TngTableCellAlign;
  hidden?: boolean;
  children: readonly TngTableColumn<TRow>[];
}>;

export type TngTableColumn<TRow = unknown> =
  | TngTableLeafColumn<TRow>
  | TngTableGroupColumn<TRow>;

export type TngTableCellContext<TRow = unknown> = Readonly<{
  $implicit: unknown;
  column: TngTableLeafColumn<TRow>;
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
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

export type TngTableHeaderCellNode<TRow = unknown> = Readonly<{
  column: TngTableColumn<TRow>;
  id: string;
  label: string;
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

type HeaderTreeModel<TRow> = Readonly<{
  headerRows: ReadonlyArray<ReadonlyArray<TngTableHeaderCellNode<TRow>>>;
  leafColumns: ReadonlyArray<TngTableLeafColumn<TRow>>;
  maxDepth: number;
}>;

function isGroupColumn<TRow>(
  column: TngTableColumn<TRow>,
): column is TngTableGroupColumn<TRow> {
  return (
    'children' in column &&
    Array.isArray((column as TngTableGroupColumn<TRow>).children) &&
    (column as TngTableGroupColumn<TRow>).children.length > 0
  );
}

function isHidden<TRow>(column: TngTableColumn<TRow>): boolean {
  return (column as { hidden?: boolean }).hidden === true;
}

function hasValidId<TRow>(column: TngTableColumn<TRow>): boolean {
  return typeof column.id === 'string' && column.id.trim().length > 0;
}

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

function getColumnLabelText<TRow>(column: TngTableColumn<TRow>): string {
  return column.label ?? column.id;
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
    TngTablePrimitive,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngSortHeader,
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

  protected readonly headerTreeModel = computed<HeaderTreeModel<TRow>>(() =>
    this.buildHeaderTreeModel(this.columns()),
  );

  protected get visibleColumns(): readonly TngTableColumn<TRow>[] {
    return this.columns().filter(
      (column) => hasValidId(column) && !isHidden(column),
    );
  }

  protected get headerRows(): ReadonlyArray<ReadonlyArray<TngTableHeaderCellNode<TRow>>> {
    return this.headerTreeModel().headerRows;
  }

  protected get leafColumns(): ReadonlyArray<TngTableLeafColumn<TRow>> {
    return this.headerTreeModel().leafColumns;
  }

  protected getColumnLabel(column: TngTableColumn<TRow>): string {
    return getColumnLabelText(column);
  }

  protected getColumnWidth(column: TngTableLeafColumn<TRow>): string | null {
    return normalizeCssLength(column.width);
  }

  protected getHeaderAlign(node: TngTableHeaderCellNode<TRow>): TngTableCellAlign {
    if (node.isGroup) {
      return normalizeCellAlign(
        (node.column as TngTableGroupColumn<TRow>).headerAlign ?? 'center',
      );
    }

    const leaf = node.column as TngTableLeafColumn<TRow>;
    return normalizeCellAlign(leaf.headerAlign ?? leaf.align);
  }

  protected getCellAlign(column: TngTableLeafColumn<TRow>): TngTableCellAlign {
    return normalizeCellAlign(column.align);
  }

  protected getCellValue(row: TRow, column: TngTableLeafColumn<TRow>, rowIndex: number): unknown {
    const accessor = column.accessor;
    if (typeof accessor === 'function') {
      return accessor(row, rowIndex);
    }

    if (typeof accessor === 'string' || typeof accessor === 'number' || typeof accessor === 'symbol') {
      return (row as Record<PropertyKey, unknown>)[accessor];
    }

    return (row as Record<PropertyKey, unknown>)[column.id];
  }

  protected getCellText(row: TRow, column: TngTableLeafColumn<TRow>, rowIndex: number): string {
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
    column: TngTableLeafColumn<TRow>,
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

  protected getHeaderContext(node: TngTableHeaderCellNode<TRow>): TngTableHeaderContext<TRow> {
    return {
      $implicit: node.column,
      column: node.column,
      columnId: node.id,
      label: node.label,
      isGroup: node.isGroup,
      depth: node.depth,
      colspan: node.colspan,
      rowspan: node.rowspan,
    };
  }

  protected getColspan(): number {
    return Math.max(1, this.leafColumns.length);
  }

  protected getRowId(_row: TRow, rowIndex: number): string {
    return String(rowIndex);
  }

  protected getNodeKey(node: TngTableHeaderCellNode<TRow>): string {
    return `${node.depth}:${node.id}`;
  }

  protected isSortableLeaf(node: TngTableHeaderCellNode<TRow>): boolean {
    return !node.isGroup && (node.column as TngTableLeafColumn<TRow>).sortable === true;
  }

  protected onSortChange(event: TngTableSortChange): void {
    this.sortChange.emit(event);
  }

  private buildHeaderTreeModel(
    columns: readonly TngTableColumn<TRow>[],
  ): HeaderTreeModel<TRow> {
    const filtered = columns.filter(
      (column) => hasValidId(column) && !isHidden(column),
    );

    const maxDepth = this.computeMaxDepth(filtered);
    const headerRows: TngTableHeaderCellNode<TRow>[][] = Array.from(
      { length: Math.max(1, maxDepth) },
      () => [],
    );
    const leafColumns: TngTableLeafColumn<TRow>[] = [];

    for (const column of filtered) {
      this.walkColumn(column, 0, maxDepth, headerRows, leafColumns);
    }

    if (isDevMode()) {
      this.validateColumnTree(columns);
    }

    return Object.freeze({
      headerRows: headerRows.map((row) => Object.freeze(row.slice())) as ReadonlyArray<
        ReadonlyArray<TngTableHeaderCellNode<TRow>>
      >,
      leafColumns: Object.freeze(leafColumns.slice()),
      maxDepth: Math.max(1, maxDepth),
    });
  }

  private walkColumn(
    column: TngTableColumn<TRow>,
    depth: number,
    maxDepth: number,
    headerRows: TngTableHeaderCellNode<TRow>[][],
    leafColumns: TngTableLeafColumn<TRow>[],
  ): number {
    if (isGroupColumn(column)) {
      const visibleChildren = column.children.filter(
        (child) => hasValidId(child) && !isHidden(child),
      );

      // Empty group after filtering: skip entirely.
      if (visibleChildren.length === 0) {
        return 0;
      }

      let colspan = 0;
      for (const child of visibleChildren) {
        colspan += this.walkColumn(child, depth + 1, maxDepth, headerRows, leafColumns);
      }

      if (colspan === 0) {
        return 0;
      }

      headerRows[depth].push(
        Object.freeze({
          column,
          id: column.id,
          label: getColumnLabelText(column),
          isGroup: true,
          depth,
          colspan,
          rowspan: 1,
        }),
      );

      return colspan;
    }

    const leaf = column as TngTableLeafColumn<TRow>;
    leafColumns.push(leaf);
    const rowspan = Math.max(1, maxDepth - depth);
    headerRows[depth].push(
      Object.freeze({
        column: leaf,
        id: leaf.id,
        label: getColumnLabelText(leaf),
        isGroup: false,
        depth,
        colspan: 1,
        rowspan,
      }),
    );

    return 1;
  }

  private computeMaxDepth(columns: readonly TngTableColumn<TRow>[]): number {
    let max = 0;
    const walk = (column: TngTableColumn<TRow>, depth: number): void => {
      if (isGroupColumn(column)) {
        const visibleChildren = column.children.filter(
          (child) => hasValidId(child) && !isHidden(child),
        );
        if (visibleChildren.length === 0) {
          return;
        }
        for (const child of visibleChildren) {
          walk(child, depth + 1);
        }
      } else {
        max = Math.max(max, depth + 1);
      }
    };
    for (const column of columns) {
      if (hasValidId(column) && !isHidden(column)) {
        walk(column, 0);
      }
    }
    return max;
  }

  private validateColumnTree(columns: readonly TngTableColumn<TRow>[]): void {
    const seenIds = new Set<string>();

    const visit = (column: TngTableColumn<TRow>): void => {
      if (!hasValidId(column)) {
        return;
      }

      if (seenIds.has(column.id)) {
        console.warn(
          `[tng-table] Duplicate column id "${column.id}" detected in column tree.`,
        );
      } else {
        seenIds.add(column.id);
      }

      if (
        'children' in column &&
        column.children !== undefined &&
        !Array.isArray(column.children)
      ) {
        console.warn(
          `[tng-table] Column "${column.id}" declares "children" but it is not an array.`,
        );
      }

      if (isGroupColumn(column)) {
        const groupExtras = column as unknown as Record<string, unknown>;
        for (const leafOnlyProp of [
          'accessor',
          'sortable',
          'sticky',
          'truncate',
          'width',
          'align',
        ]) {
          if (groupExtras[leafOnlyProp] !== undefined) {
            console.warn(
              `[tng-table] Group column "${column.id}" defines leaf-only property "${leafOnlyProp}"; it will be ignored.`,
            );
          }
        }

        for (const child of column.children) {
          visit(child);
        }
      }
      // Empty `children: []` arrays are treated as leaves — silent by design.
    };

    for (const column of columns) {
      visit(column);
    }
  }
}

export { TngTableComponent as TngTable };
export { TngTableCellTemplate as TngTableCellTpl };
export { TngTableHeaderTemplate as TngTableHeaderTpl };
