import { Component, ElementRef, booleanAttribute, computed, inject, input, output, viewChildren } from '@angular/core';
import {
  collapseKey,
  expandKey,
  flattenTreeTableRows,
  resolveTreeTableKeydown,
  toggleExpandedKey,
  toggleSelectedKey,
  type TngTreeTableFlatRow,
  type TngTreeTableKey,
  type TngTreeTableRowEvent,
} from '@tailng-ui/primitives';
import {
  normalizeTngTreeTableClassValue,
  normalizeTngTreeTableCssLength,
  type TngTreeTableCellAlign,
  type TngTreeTableClassInput,
  type TngTreeTableColumn,
} from './tng-tree-table-column.type';

export type {
  TngTreeTableCellAlign,
  TngTreeTableClassInput,
  TngTreeTableColumn,
  TngTreeTableSlot,
} from './tng-tree-table-column.type';
export type { TngTreeTableKey, TngTreeTableFlatRow, TngTreeTableRowEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-tree-table',
  exportAs: 'tngTreeTableComponent',
  standalone: true,
  imports: [],
  templateUrl: './tng-tree-table.component.html',
  styleUrl: './tng-tree-table.component.css',
})
export class TngTreeTableComponent<TRow = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  public readonly data = input<readonly TRow[]>([]);
  public readonly columns = input.required<readonly TngTreeTableColumn<TRow>[]>();
  public readonly getKey = input<(row: TRow, indexPath: readonly number[]) => TngTreeTableKey>(
    (_row, indexPath) => indexPath.join('-'),
  );
  public readonly getChildren = input<(row: TRow) => readonly TRow[] | null | undefined>(
    (_row) => undefined,
  );
  public readonly expandedKeys = input<readonly TngTreeTableKey[]>([]);
  public readonly selectedKeys = input<readonly TngTreeTableKey[]>([]);
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly expandOnRowClick = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly selectable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly emptyText = input<string>('No records found');
  public readonly loadingText = input<string>('Loading...');
  public readonly treeColumnKey = input<string | null>(null);
  public readonly indentSize = input<number>(20);
  public readonly ariaLabel = input<string | null>('Tree table');
  public readonly dir = input<'ltr' | 'rtl' | null>(null);
  public readonly density = input<'comfortable' | 'compact'>('comfortable');

  // ── Outputs ─────────────────────────────────────────────────────────────────
  public readonly expandedKeysChange = output<readonly TngTreeTableKey[]>();
  public readonly selectedKeysChange = output<readonly TngTreeTableKey[]>();
  public readonly rowClick = output<TngTreeTableRowEvent<TRow>>();
  public readonly rowExpand = output<TngTreeTableRowEvent<TRow>>();
  public readonly rowCollapse = output<TngTreeTableRowEvent<TRow>>();

  // ── Internal computed ────────────────────────────────────────────────────────
  protected readonly expandedSet = computed<ReadonlySet<TngTreeTableKey>>(
    () => new Set(this.expandedKeys()),
  );

  protected readonly selectedSet = computed<ReadonlySet<TngTreeTableKey>>(
    () => new Set(this.selectedKeys()),
  );

  protected readonly flatRows = computed<readonly TngTreeTableFlatRow<TRow>[]>(() =>
    flattenTreeTableRows({
      data: this.data(),
      expandedKeys: this.expandedSet(),
      selectedKeys: this.selectedSet(),
      getKey: this.getKey(),
      getChildren: this.getChildren(),
    }),
  );

  /** The column that hosts the tree toggle / indentation. */
  protected readonly treeColumn = computed<TngTreeTableColumn<TRow> | null>(() => {
    const cols = this.columns();
    if (cols.length === 0) {
      return null;
    }

    const withToggle = cols.find((c) => c.treeToggle === true);
    if (withToggle !== undefined) {
      return withToggle;
    }

    const byKey = this.treeColumnKey();
    if (byKey !== null) {
      const found = cols.find((c) => c.key === byKey);
      if (found !== undefined) {
        return found;
      }
    }

    return cols[0] ?? null;
  });

  protected readonly colspan = computed<number>(() => Math.max(1, this.columns().length));

  // ── Row elements for focus management ───────────────────────────────────────
  private readonly rowRefs = viewChildren<ElementRef<HTMLTableRowElement>>('rowRef');

  // ── Handlers ─────────────────────────────────────────────────────────────────

  protected onToggle(flatRow: TngTreeTableFlatRow<TRow>, event: Event): void {
    event.stopPropagation();

    if (flatRow.disabled || this.disabled()) {
      return;
    }

    if (!flatRow.expandable) {
      return;
    }

    const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
    this.expandedKeysChange.emit([...nextSet]);

    const rowEvent: TngTreeTableRowEvent<TRow> = {
      row: flatRow.row,
      key: flatRow.key,
      level: flatRow.level,
      originalEvent: event,
    };

    if (flatRow.expanded) {
      this.rowCollapse.emit(rowEvent);
    } else {
      this.rowExpand.emit(rowEvent);
    }
  }

  protected onRowClick(flatRow: TngTreeTableFlatRow<TRow>, event: MouseEvent): void {
    if (flatRow.disabled || this.disabled()) {
      return;
    }

    this.rowClick.emit({
      row: flatRow.row,
      key: flatRow.key,
      level: flatRow.level,
      originalEvent: event,
    });

    if (this.expandOnRowClick() && flatRow.expandable) {
      const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);

      const rowEvent: TngTreeTableRowEvent<TRow> = {
        row: flatRow.row,
        key: flatRow.key,
        level: flatRow.level,
        originalEvent: event,
      };

      if (flatRow.expanded) {
        this.rowCollapse.emit(rowEvent);
      } else {
        this.rowExpand.emit(rowEvent);
      }
    }
  }

  protected onRowKeydown(
    flatRow: TngTreeTableFlatRow<TRow>,
    event: KeyboardEvent,
    rowIndex: number,
  ): void {
    const intent = resolveTreeTableKeydown(event.key, {
      expandable: flatRow.expandable,
      expanded: flatRow.expanded,
      selectable: this.selectable(),
    });

    if (intent === null) {
      return;
    }

    if (intent === 'select') {
      event.preventDefault();
      this.onSelect(flatRow, event);
      return;
    }

    if (intent === 'focusFirst') {
      event.preventDefault();
      this.focusRow(0);
      return;
    }

    if (intent === 'focusLast') {
      event.preventDefault();
      this.focusRow(this.flatRows().length - 1);
      return;
    }

    if (flatRow.disabled || this.disabled()) {
      return;
    }

    if (intent === 'expand') {
      const nextSet = expandKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      this.rowExpand.emit({
        row: flatRow.row,
        key: flatRow.key,
        level: flatRow.level,
        originalEvent: event,
      });
      return;
    }

    if (intent === 'collapse') {
      const nextSet = collapseKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      this.rowCollapse.emit({
        row: flatRow.row,
        key: flatRow.key,
        level: flatRow.level,
        originalEvent: event,
      });
      return;
    }

    if (intent === 'toggle' && flatRow.expandable) {
      const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      const rowEvent: TngTreeTableRowEvent<TRow> = {
        row: flatRow.row,
        key: flatRow.key,
        level: flatRow.level,
        originalEvent: event,
      };
      if (flatRow.expanded) {
        this.rowCollapse.emit(rowEvent);
      } else {
        this.rowExpand.emit(rowEvent);
      }
    }
  }

  protected onSelect(flatRow: TngTreeTableFlatRow<TRow>, event: Event): void {
    if (!this.selectable() || flatRow.disabled || this.disabled()) {
      return;
    }

    const nextSet = toggleSelectedKey(this.selectedSet(), flatRow.key);
    this.selectedKeysChange.emit([...nextSet]);
  }

  // ── Template helpers ──────────────────────────────────────────────────────────

  protected isTreeColumn(column: TngTreeTableColumn<TRow>): boolean {
    return column.key === this.treeColumn()?.key;
  }

  protected getIndentWidth(level: number): string {
    return `${level * this.indentSize()}px`;
  }

  protected getCellValue(row: TRow, column: TngTreeTableColumn<TRow>, rowIndex: number): unknown {
    const accessor = column.accessor;
    if (typeof accessor === 'function') {
      return accessor(row, rowIndex);
    }

    if (accessor !== undefined) {
      return (row as Record<PropertyKey, unknown>)[accessor as PropertyKey];
    }

    return (row as Record<PropertyKey, unknown>)[column.key];
  }

  protected getCellText(row: TRow, column: TngTreeTableColumn<TRow>, rowIndex: number): string {
    const value = this.getCellValue(row, column, rowIndex);
    return normalizeCellValue(value);
  }

  protected getCellAlign(column: TngTreeTableColumn<TRow>): TngTreeTableCellAlign {
    return normalizeCellAlign(column.align);
  }

  protected getColumnWidth(column: TngTreeTableColumn<TRow>): string | null {
    return normalizeTngTreeTableCssLength(column.width);
  }

  protected resolveHeaderClass(column: TngTreeTableColumn<TRow>): string {
    return normalizeTngTreeTableClassValue(column.headerClass);
  }

  protected resolveCellClass(
    column: TngTreeTableColumn<TRow>,
    row: TRow,
  ): string {
    const cellClass = column.cellClass;
    if (cellClass === undefined || cellClass === null) {
      return '';
    }

    if (typeof cellClass === 'function') {
      return normalizeTngTreeTableClassValue(cellClass(row));
    }

    return normalizeTngTreeTableClassValue(cellClass);
  }

  private focusRow(index: number): void {
    const refs = this.rowRefs();
    const target = refs[index];
    if (target !== undefined) {
      target.nativeElement.focus();
    }
  }

  /** Stable track-by for @for loops. */
  protected trackByKey(_index: number, flatRow: TngTreeTableFlatRow<TRow>): TngTreeTableKey {
    return flatRow.key;
  }

  protected trackByColumnKey(_index: number, column: TngTreeTableColumn<TRow>): string {
    return column.key;
  }
}

export { TngTreeTableComponent as TngTreeTable };

// ── Local helpers ──────────────────────────────────────────────────────────────

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

function normalizeCellAlign(value: TngTreeTableCellAlign | null | undefined): TngTreeTableCellAlign {
  return value === 'center' || value === 'end' ? value : 'start';
}
