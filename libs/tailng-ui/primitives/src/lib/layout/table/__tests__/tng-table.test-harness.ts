import { Component, ViewChild, computed, signal } from '@angular/core';
import {
  TngSortHeader,
  TngTable,
  TngTableBody,
  TngTableCell,
  TngTableCellOutlet,
  TngTableCellTpl,
  TngTableEmpty,
  TngTableError,
  TngTableExpansion,
  type TngTableExpansionChange,
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
  type TngTableRowClickEvent,
  type TngTableRowContextMenuEvent,
  TngTableRowExpander,
  TngTableSelection,
  type TngTableSelectionChange,
  TngTableSort,
  TngTableToolbar,
  type TngTableCellClickEvent,
} from '..';

export type TableItem = Readonly<{
  id: string;
  label: string;
}>;

export type InteractiveTableRow = Readonly<{
  disabled?: boolean;
  id: string;
  label: string;
  status?: string | null;
  value?: boolean | number | string | null | undefined;
}>;

export type DynamicColumnId = 'label' | 'status' | 'value';

export type RenderingRow = Readonly<{
  active: boolean;
  id: string;
  label: string;
  markup: string;
  status: string;
  total: number;
}>;

export type DynamicTableColumn = Readonly<{
  hidden?: boolean;
  id: DynamicColumnId;
  label: string;
}>;

export function getByTestId<TElement extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): TElement {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as TElement;
}

export function queryAllByTestId<TElement extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): readonly TElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(`[data-testid="${testId}"]`),
  ) as readonly TElement[];
}

export function dispatchKeydown(
  element: HTMLElement,
  key: string,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });

  element.dispatchEvent(event);
  return event;
}

export function dispatchMouseEvent(
  element: Element,
  type: 'click' | 'contextmenu',
  init: MouseEventInit = {},
): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init,
  });

  element.dispatchEvent(event);
  return event;
}

function renderDynamicCell(row: InteractiveTableRow, columnId: DynamicColumnId): string {
  switch (columnId) {
    case 'label':
      return row.label ?? '';
    case 'status':
      return row.status ?? '';
    case 'value':
      return row.value === null || row.value === undefined ? '' : String(row.value);
  }
}

@Component({
  imports: [
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableFooter,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    TngTableToolbar,
    TngTableLoading,
    TngTableEmpty,
    TngTableError,
    TngTablePagination,
  ],
  template: `
    <section tngTableToolbar data-testid="toolbar">Toolbar</section>

    <table
      tngTable
      #tableRef="tngTable"
      data-testid="table"
      [ariaLabel]="ariaLabel()"
      [dir]="dir()"
      [error]="error()"
      [filterable]="filterable()"
      [items]="items()"
      [loading]="loading()"
      [pageable]="pageable()"
    >
      @if (showHeader()) {
        <thead tngTableHeader #headerRef="tngTableHeader" data-testid="header">
          <tr tngTableRow data-testid="header-row">
            <th tngTableHeaderCell data-testid="header-cell">Label</th>
          </tr>
        </thead>
      }

      <tbody tngTableBody #bodyRef="tngTableBody" data-testid="body">
        @for (item of renderedItems(); track item.id) {
          <tr tngTableRow data-testid="body-row">
            <td tngTableCell data-testid="body-cell">{{ item.label }}</td>
          </tr>
        }
      </tbody>

      @if (showFooter()) {
        <tfoot tngTableFooter #footerRef="tngTableFooter" data-testid="footer">
          <tr tngTableRow data-testid="footer-row">
            <td tngTableCell data-testid="footer-cell">Footer</td>
          </tr>
        </tfoot>
      }
    </table>

    @if (loading()) {
      <div data-testid="loading-slot" tngTableLoading>Loading</div>
    }

    @if (!loading() && renderedItems().length === 0) {
      <div data-testid="empty-slot" tngTableEmpty>Empty</div>
    }

    @if (error()) {
      <div data-testid="error-slot" tngTableError>Error</div>
    }

    <nav tngTablePagination data-testid="pagination">Pagination</nav>
  `,
})
export class TableHarnessComponent {
  public readonly ariaLabel = signal<string | null>('Harness table');
  public readonly dir = signal<'ltr' | 'rtl' | null>('ltr');
  public readonly error = signal(false);
  public readonly filterable = signal(false);
  public readonly items = signal<readonly TableItem[] | null | undefined>([
    { id: 'alpha', label: 'Alpha' },
  ]);
  public readonly loading = signal(false);
  public readonly pageable = signal(false);
  public readonly showFooter = signal(true);
  public readonly showHeader = signal(true);
  public readonly renderedItems = computed(() => this.items() ?? []);

  @ViewChild('tableRef', { static: true })
  public tableRef?: TngTable;

  @ViewChild('headerRef')
  public headerRef?: TngTableHeader;

  @ViewChild('bodyRef', { static: true })
  public bodyRef?: TngTableBody;

  @ViewChild('footerRef')
  public footerRef?: TngTableFooter;
}

@Component({
  imports: [
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    TngTableSort,
    TngSortHeader,
  ],
  template: `
    @if (controlled()) {
      <table
        tngTable
        tngTableSort
        #sortRef="tngTableSort"
        data-testid="table"
        [tngTableSortActive]="activeColumnId()"
        [tngTableSortDirection]="direction()"
      >
        @if (showHeader()) {
          <thead tngTableHeader data-testid="header">
            <tr tngTableRow>
              <th
                tngTableHeaderCell
                [tngSortHeader]="'label'"
                [tngSortHeaderDisabled]="headerDisabled()"
                data-testid="sort-header"
              >
                Label
              </th>
            </tr>
          </thead>
        }

        <tbody tngTableBody>
          <tr tngTableRow>
            <td tngTableCell>Alpha</td>
          </tr>
        </tbody>
      </table>
    } @else {
      <table
        tngTable
        tngTableSort
        #sortRef="tngTableSort"
        data-testid="table"
      >
        @if (showHeader()) {
          <thead tngTableHeader data-testid="header">
            <tr tngTableRow>
              <th
                tngTableHeaderCell
                [tngSortHeader]="'label'"
                [tngSortHeaderDisabled]="headerDisabled()"
                data-testid="sort-header"
              >
                Label
              </th>
            </tr>
          </thead>
        }

        <tbody tngTableBody>
          <tr tngTableRow>
            <td tngTableCell>Alpha</td>
          </tr>
        </tbody>
      </table>
    }
  `,
})
export class TableSortHarnessComponent {
  public readonly activeColumnId = signal<string | null | undefined>(undefined);
  public readonly controlled = signal(false);
  public readonly direction = signal<'asc' | 'desc' | null | undefined>(undefined);
  public readonly headerDisabled = signal(false);
  public readonly showHeader = signal(true);

  @ViewChild('sortRef')
  public sortRef?: TngTableSort;
}

@Component({
  imports: [
    TngTable,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
    TngTableSelection,
  ],
  template: `
    <table
      tngTable
      tngTableSelection
      #selectionRef="tngTableSelection"
      data-testid="selection-table"
      [tngTableSelectedIds]="selectedIds()"
      [tngTableSelectionMode]="selectionMode()"
      (selectionChange)="onSelectionChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell [tngTableColumnId]="'label'" data-testid="selection-header">
            Label
          </th>
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of visibleRows(); track row.id) {
          <tr
            tngTableRow
            [attr.data-testid]="'selection-row-' + row.id"
            [tngTableRowDisabled]="row.disabled ?? false"
            [tngTableRowId]="row.id"
          >
            <td
              tngTableCell
              [attr.data-testid]="'selection-cell-' + row.id"
              [tngTableColumnId]="'label'"
            >
              {{ row.label }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TableSelectionHarnessComponent {
  public readonly hiddenIds = signal<readonly string[]>([]);
  public readonly rows = signal<readonly InteractiveTableRow[]>([
    { id: 'alpha', label: 'Alpha' },
    { id: 'beta', label: 'Beta' },
    { disabled: true, id: 'gamma', label: 'Gamma' },
    { id: 'delta', label: 'Delta' },
  ]);
  public readonly selectedIds = signal<readonly string[]>([]);
  public readonly selectionMode = signal<'multiple' | 'single'>('single');
  public readonly selectionEvents: TngTableSelectionChange[] = [];
  public readonly visibleRows = computed(() =>
    this.rows().filter((row) => !this.hiddenIds().includes(row.id)),
  );

  @ViewChild('selectionRef', { static: true })
  public selectionRef?: TngTableSelection;

  public onSelectionChange(event: TngTableSelectionChange): void {
    this.selectedIds.set(event.selectedIds);
    this.selectionEvents.push(event);
  }
}

@Component({
  imports: [
    TngTable,
    TngTableBody,
    TngTableCell,
    TngTableExpansion,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
    TngTableRowExpander,
  ],
  template: `
    <table
      tngTable
      tngTableExpansion
      #expansionRef="tngTableExpansion"
      data-testid="expansion-table"
      [tngTableExpandedIds]="expandedIds()"
      [tngTableExpansionMode]="expansionMode()"
      (expansionChange)="onExpansionChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell data-testid="expander-header">Expand</th>
          @for (column of visibleColumns(); track column.id) {
            <th
              tngTableHeaderCell
              [attr.data-testid]="'expansion-header-' + column.id"
              [tngTableColumnId]="column.id"
            >
              {{ column.label }}
            </th>
          }
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of rows(); track row.id) {
          <tr
            tngTableRow
            [attr.data-testid]="'expansion-row-' + row.id"
            [tngTableRowId]="row.id"
          >
            <td tngTableCell [tngTableColumnId]="'label'">
              <div
                tabindex="0"
                [attr.data-testid]="'expander-' + row.id"
                [tngTableRowExpander]="row.id"
              >
                Toggle
              </div>
            </td>
            @for (column of visibleColumns(); track column.id) {
              <td
                tngTableCell
                [attr.data-testid]="'expansion-cell-' + row.id + '-' + column.id"
                [tngTableColumnId]="column.id"
              >
                {{ renderCell(row, column.id) }}
              </td>
            }
          </tr>

          @if (isExpanded(row.id)) {
            <tr
              tngTableRow
              [attr.data-testid]="'detail-row-' + row.id"
              [tngTableRowExpanded]="true"
              [tngTableRowId]="row.id + '-detail'"
            >
              <td
                tngTableCell
                [attr.colspan]="visibleColumns().length + 1"
                [attr.data-testid]="'detail-cell-' + row.id"
              >
                Details for {{ row.label }}
              </td>
            </tr>
          }
        }
      </tbody>
    </table>
  `,
})
export class TableExpansionHarnessComponent {
  public readonly expandedIds = signal<readonly string[]>([]);
  public readonly expansionEvents: TngTableExpansionChange[] = [];
  public readonly expansionMode = signal<'multiple' | 'single'>('multiple');
  public readonly rows = signal<readonly InteractiveTableRow[]>([
    { id: 'alpha', label: 'Alpha', status: 'Ready', value: 1 },
    { id: 'beta', label: 'Beta', status: 'Review', value: 2 },
    { id: 'gamma', label: 'Gamma', status: 'Draft', value: 3 },
  ]);
  public readonly visibleColumns = signal<readonly DynamicTableColumn[]>([
    { id: 'label', label: 'Label' },
    { id: 'status', label: 'Status' },
    { id: 'value', label: 'Value' },
  ]);

  @ViewChild('expansionRef', { static: true })
  public expansionRef?: TngTableExpansion;

  public isExpanded(rowId: string): boolean {
    return this.expandedIds().includes(rowId);
  }

  public onExpansionChange(event: TngTableExpansionChange): void {
    this.expandedIds.set(event.expandedIds);
    this.expansionEvents.push(event);
  }

  public renderCell(row: InteractiveTableRow, columnId: DynamicColumnId): string {
    return renderDynamicCell(row, columnId);
  }
}

@Component({
  imports: [
    TngTable,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
  ],
  template: `
    <table tngTable data-testid="interaction-table">
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell [tngTableColumnId]="'label'">Label</th>
          <th tngTableHeaderCell [tngTableColumnId]="'actions'">Actions</th>
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of rows(); track row.id) {
          <tr
            tngTableRow
            [attr.data-testid]="'interaction-row-' + row.id"
            [tngTableRowId]="row.id"
            (rowClick)="onRowClick($event)"
            (rowContextMenu)="onRowContextMenu($event)"
          >
            <td
              tngTableCell
              [attr.data-testid]="'interaction-cell-' + row.id"
              [tngTableColumnId]="'label'"
              (cellClick)="onCellClick($event)"
            >
              {{ row.label }}
            </td>
            <td
              tngTableCell
              [tngTableColumnId]="'actions'"
              (cellClick)="onCellClick($event)"
            >
              <button
                type="button"
                [attr.data-testid]="'row-action-' + row.id"
                (click)="$event.stopPropagation()"
              >
                Action
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TableInteractionHarnessComponent {
  public readonly cellClicks: TngTableCellClickEvent[] = [];
  public readonly rowClicks: TngTableRowClickEvent[] = [];
  public readonly rowContextMenus: TngTableRowContextMenuEvent[] = [];
  public readonly rows = signal<readonly InteractiveTableRow[]>([
    { id: 'alpha', label: 'Alpha' },
    { id: 'beta', label: 'Beta' },
  ]);

  public onCellClick(event: TngTableCellClickEvent): void {
    this.cellClicks.push(event);
  }

  public onRowClick(event: TngTableRowClickEvent): void {
    this.rowClicks.push(event);
  }

  public onRowContextMenu(event: TngTableRowContextMenuEvent): void {
    this.rowContextMenus.push(event);
  }
}

@Component({
  imports: [
    TngTable,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
    TngTableSelection,
  ],
  template: `
    <table
      tngTable
      tngTableSelection
      data-testid="dynamic-table"
      [ariaLabel]="ariaLabel()"
      [tngTableSelectedIds]="selectedIds()"
      (selectionChange)="onSelectionChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          @for (column of visibleColumns(); track column.id) {
            <th
              tngTableHeaderCell
              [attr.data-testid]="'dynamic-header-' + column.id"
              [tngTableColumnId]="column.id"
              scope="col"
            >
              {{ column.label }}
            </th>
          }
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of rows(); track row.id) {
          <tr
            tngTableRow
            [attr.data-testid]="'dynamic-row-' + row.id"
            [tngTableRowId]="row.id"
          >
            @for (column of visibleColumns(); track column.id) {
              <td
                tngTableCell
                [attr.data-testid]="'dynamic-cell-' + row.id + '-' + column.id"
                [tngTableColumnId]="column.id"
              >
                {{ renderCell(row, column.id) }}
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class DynamicTableHarnessComponent {
  public readonly ariaLabel = signal<string | null>('Dynamic table');
  public readonly columns = signal<readonly DynamicTableColumn[]>([
    { id: 'label', label: 'Label' },
    { id: 'status', label: 'Status' },
    { id: 'value', label: 'Value' },
  ]);
  public readonly rows = signal<readonly InteractiveTableRow[]>([
    { id: 'alpha', label: 'Alpha', status: 'Ready', value: 1 },
    { id: 'beta', label: 'Beta', status: undefined, value: null },
    { id: 'gamma', label: 'Gamma', status: 'Draft', value: true },
  ]);
  public readonly selectedIds = signal<readonly string[]>([]);
  public readonly visibleColumns = computed(() =>
    this.columns().filter((column) => column.hidden !== true),
  );

  public onSelectionChange(event: TngTableSelectionChange): void {
    this.selectedIds.set(event.selectedIds);
  }

  public renderCell(row: InteractiveTableRow, columnId: DynamicColumnId): string {
    return renderDynamicCell(row, columnId);
  }
}

@Component({
  imports: [
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableFooter,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    TngTableCellOutlet,
    TngTableCellTpl,
    TngTableHeaderOutlet,
    TngTableHeaderTpl,
    TngTableFooterOutlet,
    TngTableFooterTpl,
  ],
  template: `
    <ng-template
      tngTableCellTpl
      #cellTemplate="tngTableCellTpl"
      let-columnId="columnId"
      let-row="row"
      let-value
    >
      <span data-testid="custom-cell-content">{{ row.id }}::{{ columnId }}::{{ value }}</span>
    </ng-template>

    <ng-template
      tngTableHeaderTpl
      #headerTemplate="tngTableHeaderTpl"
      let-columnId="columnId"
      let-label
    >
      <span data-testid="custom-header-content">{{ columnId }}::{{ label }}</span>
    </ng-template>

    <ng-template
      tngTableFooterTpl
      #footerTemplate="tngTableFooterTpl"
      let-columnId="columnId"
      let-items="items"
      let-value
    >
      <span data-testid="custom-footer-content">{{ columnId }}::{{ items.length }}::{{ value }}</span>
    </ng-template>

    <ng-template tngTableCellTpl #htmlTemplate="tngTableCellTpl" let-value>
      <span data-testid="custom-html-content" [innerHTML]="value"></span>
    </ng-template>

    <table tngTable data-testid="rendering-table">
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell data-testid="default-header">
            <tng-table-header-outlet
              [columnId]="'label'"
              [label]="'Name'"
            ></tng-table-header-outlet>
          </th>
          <th tngTableHeaderCell data-testid="custom-header">
            <tng-table-header-outlet
              [columnId]="'status'"
              [label]="'Status'"
              [template]="headerTemplate"
            ></tng-table-header-outlet>
          </th>
        </tr>
      </thead>

      <tbody tngTableBody>
        <tr tngTableRow [tngTableRowId]="rows()[0].id">
          <td tngTableCell data-testid="default-string-cell">
            <tng-table-cell-outlet
              [columnId]="'label'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].label"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="default-number-cell">
            <tng-table-cell-outlet
              [columnId]="'total'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].total"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="default-boolean-cell">
            <tng-table-cell-outlet
              [columnId]="'active'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].active"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="custom-cell">
            <tng-table-cell-outlet
              [columnId]="'status'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [template]="cellTemplate"
              [value]="rows()[0].status"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="formatted-cell">
            <tng-table-cell-outlet
              [columnId]="'status'"
              [formatter]="statusFormatter"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].status"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="formatter-error-cell">
            <tng-table-cell-outlet
              #errorCellOutlet="tngTableCellOutlet"
              [columnId]="'status'"
              [formatter]="throwingFormatter"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].status"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="html-escape-cell">
            <tng-table-cell-outlet
              [columnId]="'markup'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].markup"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="html-optin-cell">
            <tng-table-cell-outlet
              [columnId]="'markup'"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [template]="htmlTemplate"
              [value]="rows()[0].markup"
            ></tng-table-cell-outlet>
          </td>
        </tr>
      </tbody>

      <tfoot tngTableFooter>
        <tr tngTableRow>
          <td tngTableCell data-testid="default-footer-cell">
            <tng-table-footer-outlet
              [columnId]="'total'"
              [items]="rows()"
              [value]="footerValue()"
            ></tng-table-footer-outlet>
          </td>
          <td tngTableCell data-testid="custom-footer-cell">
            <tng-table-footer-outlet
              #footerOutlet="tngTableFooterOutlet"
              [columnId]="'summary'"
              [items]="rows()"
              [template]="footerTemplate"
              [value]="footerValue()"
            ></tng-table-footer-outlet>
          </td>
        </tr>
      </tfoot>
    </table>
  `,
})
export class TableRenderingHarnessComponent {
  public readonly footerValue = signal(2);
  public readonly rows = signal<readonly RenderingRow[]>([
    {
      active: true,
      id: 'alpha',
      label: 'Alpha',
      markup: '<strong>Safe</strong>',
      status: 'Active',
      total: 42,
    },
    {
      active: false,
      id: 'beta',
      label: 'Beta',
      markup: '<em>Draft</em>',
      status: 'Draft',
      total: 18,
    },
  ]);

  public readonly statusFormatter = (value: unknown): string =>
    `formatted:${String(value).toUpperCase()}`;
  public readonly throwingFormatter = (): string => {
    throw new Error('Formatter failure');
  };

  @ViewChild('errorCellOutlet')
  public errorCellOutlet?: TngTableCellOutlet;

  @ViewChild('footerOutlet')
  public footerOutlet?: TngTableFooterOutlet;
}
