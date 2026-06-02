import { Component, ViewChild, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  createTngFilterController,
  createTngPaginationController,
  createTngSortController,
  type TngTableSortDirection,
} from '@tailng-ui/cdk';
import {
  TngSortHeader,
  TngTable,
  TngTableBody,
  TngTableCell,
  TngTableCellOutlet,
  TngTableCellTpl,
  TngTableColumn,
  TngTableColumnResizer,
  TngTableColumnSizing,
  createTngTableIntlDateFormatter,
  createTngTableIntlNumberFormatter,
  type TngTableColumnWidthMap,
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
  TngTableScrollContainer,
  TngTableVirtual,
  type TngTableVirtualRange,
  TngTableVirtualSpacer,
  type TngTableSelectionChange,
  TngTableSort,
  type TngTableSortChange,
  TngTableToolbar,
  type TngTableLayoutMode,
  type TngTableStickySide,
  type TngTableCellClickEvent,
} from '..';
import { TngPopover, TngPopoverPanel, TngPopoverTrigger } from '../../../overlay';

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
  updatedAt: Date;
}>;

export type DynamicTableColumn = Readonly<{
  hidden?: boolean;
  id: DynamicColumnId;
  label: string;
}>;

export type IntegrationRow = Readonly<{
  id: string;
  label: string;
  status: 'draft' | 'ready';
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
  init: KeyboardEventInit = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...init,
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
      <table tngTable tngTableSort #sortRef="tngTableSort" data-testid="table">
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
          <tr tngTableRow [attr.data-testid]="'expansion-row-' + row.id" [tngTableRowId]="row.id">
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
  imports: [TngTable, TngTableBody, TngTableCell, TngTableHeader, TngTableHeaderCell, TngTableRow],
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
            <td tngTableCell [tngTableColumnId]="'actions'" (cellClick)="onCellClick($event)">
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
    RouterLink,
    TngPopover,
    TngPopoverPanel,
    TngPopoverTrigger,
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
      data-testid="integration-table"
      [tngTableSelectedIds]="selectedIds()"
      (selectionChange)="onSelectionChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell [tngTableColumnId]="'label'">Label</th>
          <th tngTableHeaderCell [tngTableColumnId]="'link'">Link</th>
          <th tngTableHeaderCell [tngTableColumnId]="'form'">Form</th>
          <th tngTableHeaderCell [tngTableColumnId]="'overlay'">Overlay</th>
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of rows(); track row.id) {
          <tr
            tngTableRow
            [attr.data-testid]="'integration-row-' + row.id"
            [tngTableRowId]="row.id"
            (rowClick)="onRowClick($event)"
          >
            <td
              tngTableCell
              [attr.data-testid]="'integration-cell-' + row.id + '-label'"
              [tngTableColumnId]="'label'"
              (cellClick)="onCellClick($event)"
            >
              {{ row.label }}
            </td>

            <td
              tngTableCell
              [attr.data-testid]="'integration-cell-' + row.id + '-link'"
              [tngTableColumnId]="'link'"
              (cellClick)="onCellClick($event)"
            >
              <a
                [routerLink]="['/detail', row.id]"
                [attr.data-testid]="'integration-link-' + row.id"
              >
                Open
              </a>
            </td>

            <td
              tngTableCell
              [attr.data-testid]="'integration-cell-' + row.id + '-form'"
              [tngTableColumnId]="'form'"
              (cellClick)="onCellClick($event)"
            >
              <input
                type="text"
                [attr.data-testid]="'integration-input-' + row.id"
                [value]="row.label"
              />
              <select [attr.data-testid]="'integration-select-' + row.id">
                <option value="draft">Draft</option>
                <option value="ready">Ready</option>
              </select>
            </td>

            <td
              tngTableCell
              [attr.data-testid]="'integration-cell-' + row.id + '-overlay'"
              [tngTableColumnId]="'overlay'"
              (cellClick)="onCellClick($event)"
            >
              <section tngPopover #popover="tngPopover" [restoreFocus]="false">
                <button
                  type="button"
                  [attr.data-testid]="'integration-popover-trigger-' + row.id"
                  [tngPopoverTrigger]="popover"
                >
                  Actions
                </button>

                <section tngPopoverPanel [attr.data-testid]="'integration-popover-panel-' + row.id">
                  <button type="button">Inspect</button>
                </section>
              </section>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TableEmbeddedIntegrationHarnessComponent {
  public readonly cellClicks: TngTableCellClickEvent[] = [];
  public readonly rowClicks: TngTableRowClickEvent[] = [];
  public readonly rows = signal<readonly IntegrationRow[]>([
    { id: 'alpha', label: 'Alpha', status: 'ready' },
  ]);
  public readonly selectedIds = signal<readonly string[]>([]);

  public onCellClick(event: TngTableCellClickEvent): void {
    this.cellClicks.push(event);
  }

  public onRowClick(event: TngTableRowClickEvent): void {
    this.rowClicks.push(event);
  }

  public onSelectionChange(event: TngTableSelectionChange): void {
    this.selectedIds.set(event.selectedIds);
  }
}

@Component({
  imports: [
    TngSortHeader,
    TngTable,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngTableRow,
    TngTableSort,
  ],
  template: `
    <input
      #filterInput
      type="text"
      data-testid="controlled-filter"
      [value]="query()"
      (input)="onQueryInput(filterInput.value)"
    />
    <button type="button" data-testid="controlled-page-next" (click)="nextPage()">Next page</button>

    <table
      tngTable
      tngTableSort
      #sortRef="tngTableSort"
      data-testid="controlled-table"
      [items]="visibleRows()"
      [filterable]="true"
      [pageable]="true"
      [tngTableSortActive]="activeColumnId()"
      [tngTableSortDirection]="direction()"
      (sortChange)="onSortChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell [tngSortHeader]="'label'" data-testid="controlled-sort-header">
            Label
          </th>
          <th tngTableHeaderCell [tngTableColumnId]="'status'">Status</th>
        </tr>
      </thead>

      <tbody tngTableBody>
        @for (row of visibleRows(); track row.id) {
          <tr tngTableRow [attr.data-testid]="'controlled-row-' + row.id" [tngTableRowId]="row.id">
            <td tngTableCell [tngTableColumnId]="'label'">{{ row.label }}</td>
            <td tngTableCell [tngTableColumnId]="'status'">{{ row.status }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TableControlledIntegrationHarnessComponent {
  public readonly activeColumnId = signal<string | null>(null);
  public readonly direction = signal<TngTableSortDirection | null>(null);
  public readonly pageIndex = signal(0);
  public readonly pageSize = signal(2);
  public readonly query = signal('');
  public readonly rows = signal<readonly IntegrationRow[]>([
    { id: 'gamma', label: 'Gamma', status: 'draft' },
    { id: 'alpha', label: 'Alpha', status: 'ready' },
    { id: 'beta', label: 'Beta', status: 'ready' },
    { id: 'delta', label: 'Delta', status: 'draft' },
  ]);
  public readonly sortEvents: TngTableSortChange[] = [];

  public readonly filteredRows = computed(() =>
    createTngFilterController<IntegrationRow>({
      globalFilter: (item, query) => item.label.toLowerCase().includes(query.toLowerCase()),
      query: this.query(),
    }).apply(this.rows()),
  );
  public readonly sortedRows = computed(() =>
    createTngSortController<IntegrationRow, 'label'>({
      accessor: (item, columnId) => item[columnId],
      activeColumnId: this.activeColumnId() === 'label' ? 'label' : null,
      direction: this.direction(),
    }).apply(this.filteredRows()),
  );
  public readonly visibleRows = computed(() =>
    createTngPaginationController<IntegrationRow>({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    }).slice(this.sortedRows()),
  );

  @ViewChild('sortRef')
  public sortRef?: TngTableSort;

  public nextPage(): void {
    this.pageIndex.update((value) => value + 1);
  }

  public onQueryInput(query: string): void {
    this.query.set(query);
    this.pageIndex.set(0);
  }

  public onSortChange(event: TngTableSortChange): void {
    this.activeColumnId.set(event.activeColumnId);
    this.direction.set(event.direction);
    this.pageIndex.set(0);
    this.sortEvents.push(event);
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
          <tr tngTableRow [attr.data-testid]="'dynamic-row-' + row.id" [tngTableRowId]="row.id">
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
      <span data-testid="custom-footer-content"
        >{{ columnId }}::{{ items.length }}::{{ value }}</span
      >
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
          <td tngTableCell data-testid="localized-number-cell">
            <tng-table-cell-outlet
              [columnId]="'localizedTotal'"
              [formatter]="localizedNumberFormatter"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="localizedNumberValue()"
            ></tng-table-cell-outlet>
          </td>
          <td tngTableCell data-testid="localized-date-cell">
            <tng-table-cell-outlet
              [columnId]="'updatedAt'"
              [formatter]="localizedDateFormatter"
              [row]="rows()[0]"
              [rowId]="rows()[0].id"
              [value]="rows()[0].updatedAt"
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
          <td tngTableCell data-testid="localized-footer-cell">
            <tng-table-footer-outlet
              [columnId]="'localizedTotal'"
              [formatter]="localizedNumberFormatter"
              [items]="rows()"
              [value]="localizedFooterValue()"
            ></tng-table-footer-outlet>
          </td>
        </tr>
      </tfoot>
    </table>
  `,
})
export class TableRenderingHarnessComponent {
  public readonly footerValue = signal(2);
  public readonly localizedFooterValue = signal(9876.5);
  public readonly localizedNumberValue = signal(12345.67);
  public readonly rows = signal<readonly RenderingRow[]>([
    {
      active: true,
      id: 'alpha',
      label: 'Alpha',
      markup: '<strong>Safe</strong>',
      status: 'Active',
      total: 42,
      updatedAt: new Date('2026-04-24T00:00:00.000Z'),
    },
    {
      active: false,
      id: 'beta',
      label: 'Beta',
      markup: '<em>Draft</em>',
      status: 'Draft',
      total: 18,
      updatedAt: new Date('2026-04-23T00:00:00.000Z'),
    },
  ]);

  public readonly localizedDateFormatter = createTngTableIntlDateFormatter('en-GB', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
    year: 'numeric',
  });
  public readonly localizedNumberFormatter = createTngTableIntlNumberFormatter('de-DE', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
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

@Component({
  imports: [
    TngTable,
    TngTableScrollContainer,
    TngTableHeader,
    TngTableBody,
    TngTableFooter,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
  ],
  template: `
    <div
      tngTableScrollContainer
      data-testid="layout-scroll"
      [dir]="dir()"
      [tngTableScrollAxis]="scrollAxis()"
    >
      <table tngTable data-testid="layout-table" [dir]="dir()" [tngTableLayout]="layout()">
        <thead
          tngTableHeader
          data-testid="layout-header"
          [tngTableHeaderSticky]="stickyHeader()"
          [tngTableHeaderStickyOffset]="headerStickyOffset()"
        >
          <tr tngTableRow>
            <th
              tngTableHeaderCell
              data-testid="layout-header-label"
              [tngTableColumnId]="'label'"
              [tngTableStickyColumn]="labelStickySide()"
              [tngTableStickyOffset]="labelStickyOffset()"
              [tngTableTruncate]="truncate()"
            >
              Project name
            </th>
            <th
              tngTableHeaderCell
              data-testid="layout-header-status"
              [tngTableColumnId]="'status'"
              [tngTableStickyColumn]="statusStickySide()"
              [tngTableStickyOffset]="statusStickyOffset()"
            >
              Status
            </th>
            <th
              tngTableHeaderCell
              data-testid="layout-header-value"
              [tngTableColumnId]="'value'"
              [tngTableStickyColumn]="valueStickySide()"
              [tngTableStickyOffset]="valueStickyOffset()"
            >
              Value
            </th>
          </tr>
        </thead>

        <tbody tngTableBody>
          <tr tngTableRow [tngTableRowId]="'alpha'">
            <td
              tngTableCell
              data-testid="layout-cell-label"
              [tngTableColumnId]="'label'"
              [tngTableStickyColumn]="labelStickySide()"
              [tngTableStickyOffset]="labelStickyOffset()"
              [tngTableTruncate]="truncate()"
            >
              A very long label that should truncate in fixed layout mode
            </td>
            <td
              tngTableCell
              data-testid="layout-cell-status"
              [tngTableColumnId]="'status'"
              [tngTableStickyColumn]="statusStickySide()"
              [tngTableStickyOffset]="statusStickyOffset()"
            >
              Ready
            </td>
            <td
              tngTableCell
              data-testid="layout-cell-value"
              [tngTableColumnId]="'value'"
              [tngTableStickyColumn]="valueStickySide()"
              [tngTableStickyOffset]="valueStickyOffset()"
            >
              42
            </td>
          </tr>
        </tbody>

        <tfoot
          tngTableFooter
          data-testid="layout-footer"
          [tngTableFooterSticky]="stickyFooter()"
          [tngTableFooterStickyOffset]="footerStickyOffset()"
        >
          <tr tngTableRow>
            <td
              tngTableCell
              data-testid="layout-footer-label"
              [tngTableColumnId]="'label'"
              [tngTableStickyColumn]="labelStickySide()"
              [tngTableStickyOffset]="labelStickyOffset()"
            >
              Totals
            </td>
            <td
              tngTableCell
              data-testid="layout-footer-status"
              [tngTableColumnId]="'status'"
              [tngTableStickyColumn]="statusStickySide()"
              [tngTableStickyOffset]="statusStickyOffset()"
            >
              Complete
            </td>
            <td
              tngTableCell
              data-testid="layout-footer-value"
              [tngTableColumnId]="'value'"
              [tngTableStickyColumn]="valueStickySide()"
              [tngTableStickyOffset]="valueStickyOffset()"
            >
              42
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
})
export class TableLayoutHarnessComponent {
  public readonly dir = signal<'ltr' | 'rtl'>('ltr');
  public readonly footerStickyOffset = signal('8px');
  public readonly headerStickyOffset = signal('12px');
  public readonly labelStickyOffset = signal<string | null>(null);
  public readonly labelStickySide = signal<TngTableStickySide | null>(null);
  public readonly layout = signal<TngTableLayoutMode>('auto');
  public readonly scrollAxis = signal<'both' | 'x' | 'y'>('x');
  public readonly statusStickyOffset = signal<string | null>(null);
  public readonly statusStickySide = signal<TngTableStickySide | null>(null);
  public readonly stickyFooter = signal(false);
  public readonly stickyHeader = signal(false);
  public readonly truncate = signal(false);
  public readonly valueStickyOffset = signal<string | null>(null);
  public readonly valueStickySide = signal<TngTableStickySide | null>(null);
}

@Component({
  imports: [
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    TngTableColumnSizing,
    TngTableColumn,
    TngTableColumnResizer,
  ],
  template: `
    <table
      tngTable
      tngTableColumnSizing
      data-testid="sizing-table"
      [dir]="dir()"
      [tngTableColumnWidths]="widths()"
      (columnWidthsChange)="onWidthsChange($event)"
    >
      <thead tngTableHeader>
        <tr tngTableRow>
          <th
            tngTableHeaderCell
            tngTableColumn
            data-testid="sizing-header-label"
            [tngTableColumn]="'label'"
            [tngTableColumnWidth]="'240px'"
          >
            Label
            <span [tngTableColumnResizer]="'label'" data-testid="label-resizer"></span>
          </th>
          <th
            tngTableHeaderCell
            tngTableColumn
            data-testid="sizing-header-status"
            [tngTableColumn]="'status'"
            [tngTableColumnMaxWidth]="'220px'"
            [tngTableColumnMinWidth]="'120px'"
            [tngTableColumnWidth]="'140px'"
          >
            Status
            <span [tngTableColumnResizer]="'status'" data-testid="status-resizer"></span>
          </th>
          <th
            tngTableHeaderCell
            tngTableColumn
            data-testid="sizing-header-value"
            [tngTableColumn]="'value'"
            [tngTableColumnWidth]="'96px'"
          >
            Value
            <span [tngTableColumnResizer]="'value'" data-testid="value-resizer"></span>
          </th>
        </tr>
      </thead>

      <tbody tngTableBody>
        <tr tngTableRow [tngTableRowId]="'alpha'">
          <td
            tngTableCell
            tngTableColumn
            data-testid="sizing-cell-label"
            [tngTableColumn]="'label'"
            [tngTableColumnWidth]="'240px'"
          >
            Alpha
          </td>
          <td
            tngTableCell
            tngTableColumn
            data-testid="sizing-cell-status"
            [tngTableColumn]="'status'"
            [tngTableColumnMaxWidth]="'220px'"
            [tngTableColumnMinWidth]="'120px'"
            [tngTableColumnWidth]="'140px'"
          >
            Ready
          </td>
          <td
            tngTableCell
            tngTableColumn
            data-testid="sizing-cell-value"
            [tngTableColumn]="'value'"
            [tngTableColumnWidth]="'96px'"
          >
            42
          </td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableSizingHarnessComponent {
  public readonly dir = signal<'ltr' | 'rtl'>('ltr');
  public readonly widthEvents: TngTableColumnWidthMap[] = [];
  public readonly widths = signal<Record<string, string> | undefined>(undefined);

  public onWidthsChange(nextWidths: TngTableColumnWidthMap): void {
    this.widths.set({ ...nextWidths });
    this.widthEvents.push(nextWidths);
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
    TngTableScrollContainer,
    TngTableSelection,
    TngTableVirtual,
    TngTableVirtualSpacer,
  ],
  template: `
    <div
      tngTableScrollContainer
      tngTableVirtual
      #virtualRef="tngTableVirtual"
      data-testid="virtual-scroll"
      [tngTableScrollAxis]="'both'"
      [tngTableVirtualItemCount]="rows().length"
      [tngTableVirtualItemSize]="rowHeight()"
      [tngTableVirtualOverscan]="overscan()"
      [tngTableVirtualViewportHeight]="viewportHeight()"
      (rangeChange)="onRangeChange($event)"
    >
      <table
        tngTable
        tngTableSelection
        #selectionRef="tngTableSelection"
        data-testid="virtual-table"
        [tngTableSelectedIds]="selectedIds()"
        (selectionChange)="onSelectionChange($event)"
      >
        <thead tngTableHeader data-testid="virtual-header" [tngTableHeaderSticky]="stickyHeader()">
          <tr tngTableRow>
            <th tngTableHeaderCell [tngTableColumnId]="'label'">Label</th>
            <th tngTableHeaderCell [tngTableColumnId]="'status'">Status</th>
            <th tngTableHeaderCell [tngTableColumnId]="'value'">Value</th>
          </tr>
        </thead>

        <tbody tngTableBody>
          @if (virtualRef.beforeSize() > 0) {
            <tr
              tngTableVirtualSpacer
              data-testid="virtual-top-spacer"
              [tngTableVirtualSpacerColspan]="3"
              [tngTableVirtualSpacerSize]="virtualRef.beforeSize()"
            ></tr>
          }

          @for (row of virtualRef.slice(rows()); track row.id) {
            <tr tngTableRow [attr.data-testid]="'virtual-row-' + row.id" [tngTableRowId]="row.id">
              <td tngTableCell [tngTableColumnId]="'label'">{{ row.label }}</td>
              <td tngTableCell [tngTableColumnId]="'status'">{{ row.status }}</td>
              <td tngTableCell [tngTableColumnId]="'value'">{{ row.value }}</td>
            </tr>
          }

          @if (virtualRef.afterSize() > 0) {
            <tr
              tngTableVirtualSpacer
              data-testid="virtual-bottom-spacer"
              [tngTableVirtualSpacerColspan]="3"
              [tngTableVirtualSpacerSize]="virtualRef.afterSize()"
            ></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableVirtualHarnessComponent {
  public readonly overscan = signal(0);
  public readonly rangeChanges = signal<readonly TngTableVirtualRange[]>([]);
  public readonly rowHeight = signal(40);
  public readonly rows = signal<readonly InteractiveTableRow[]>(
    Array.from({ length: 20 }, (_, index) => ({
      id: `row-${index}`,
      label: `Row ${index}`,
      status: index % 2 === 0 ? 'Ready' : 'Draft',
      value: index,
    })),
  );
  public readonly selectedIds = signal<readonly string[]>([]);
  public readonly stickyHeader = signal(false);
  public readonly viewportHeight = signal(120);

  @ViewChild('selectionRef')
  public selectionRef?: TngTableSelection;

  @ViewChild('virtualRef', { static: true })
  public virtualRef?: TngTableVirtual;

  public onSelectionChange(event: TngTableSelectionChange): void {
    this.selectedIds.set(event.selectedIds);
  }

  public onRangeChange(event: TngTableVirtualRange): void {
    this.rangeChanges.set([...this.rangeChanges(), event]);
  }
}

@Component({
  imports: [TngTable, TngTableHeader, TngTableBody, TngTableRow, TngTableHeaderCell, TngTableCell],
  template: `
    <button type="button" data-testid="before">Before</button>

    @if (showTable()) {
      <table tngTable data-testid="keyboard-table">
        <thead tngTableHeader>
          <tr tngTableRow>
            <th
              tngTableHeaderCell
              [tngTableColumnId]="'label'"
              data-testid="keyboard-cell-header-label"
            >
              Label
            </th>
            <th
              tngTableHeaderCell
              [tngTableColumnId]="'status'"
              data-testid="keyboard-cell-header-status"
            >
              Status
            </th>
            <th
              tngTableHeaderCell
              [tngTableColumnId]="'value'"
              data-testid="keyboard-cell-header-value"
            >
              Value
            </th>
          </tr>
        </thead>

        <tbody tngTableBody>
          @for (row of rows(); track row.id) {
            <tr tngTableRow [tngTableRowDisabled]="row.disabled ?? false" [tngTableRowId]="row.id">
              <td
                tngTableCell
                [attr.data-testid]="'keyboard-cell-' + row.id + '-label'"
                [tngTableColumnId]="'label'"
              >
                {{ row.label }}
              </td>
              <td
                tngTableCell
                [attr.data-testid]="'keyboard-cell-' + row.id + '-status'"
                [tngTableColumnId]="'status'"
              >
                {{ row.status }}
              </td>
              <td
                tngTableCell
                [attr.data-testid]="'keyboard-cell-' + row.id + '-value'"
                [tngTableColumnId]="'value'"
              >
                {{ row.value }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    }

    <button type="button" data-testid="after">After</button>
  `,
})
export class TableKeyboardHarnessComponent {
  public readonly rows = signal<readonly InteractiveTableRow[]>([
    { id: 'alpha', label: 'Alpha', status: 'Ready', value: 1 },
    { disabled: true, id: 'beta', label: 'Beta', status: 'Blocked', value: 2 },
    { id: 'gamma', label: 'Gamma', status: 'Draft', value: 3 },
  ]);
  public readonly showTable = signal(true);

  @ViewChild(TngTable)
  public tableRef?: TngTable;
}

@Component({
  imports: [TngTable, TngTableHeader, TngTableBody, TngTableRow, TngTableHeaderCell, TngTableCell],
  template: `
    <table tngTable data-testid="keyboard-span-table">
      <thead tngTableHeader>
        <tr tngTableRow>
          <th tngTableHeaderCell data-testid="span-header-group">Group</th>
          <th tngTableHeaderCell data-testid="span-header-name">Name</th>
        </tr>
      </thead>

      <tbody tngTableBody>
        <tr tngTableRow>
          <td tngTableCell [tngTableRowspan]="2" data-testid="span-group-engineering">
            Engineering
          </td>
          <td tngTableCell data-testid="span-name-alice">Alice</td>
        </tr>
        <tr tngTableRow>
          <td tngTableCell data-testid="span-name-bob">Bob</td>
        </tr>
        <tr tngTableRow>
          <td tngTableCell data-testid="span-group-sales">Sales</td>
          <td tngTableCell data-testid="span-name-dave">Dave</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableKeyboardSpanHarnessComponent {}
