import { Component, computed, signal } from '@angular/core';
import {
  createTngFilterController,
  createTngPaginationController,
  createTngRowSelectionController,
  type TngTableSortDirection,
  createTngSortController,
} from '@tailng-ui/cdk';
import {
  TngSortHeader,
  TngTable,
  TngTableBody,
  TngTableCell,
  TngTableEmpty,
  TngTableFooter,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableLoading,
  TngTablePagination,
  TngTableRow,
  TngTableSort,
  type TngTableSortChange,
  TngTableToolbar,
} from '@tailng-ui/primitives';

type DemoSortColumnId = 'arr' | 'owner' | 'project' | 'status' | 'updated';
type DemoStatus = 'Active' | 'Blocked' | 'Draft' | 'Review';
type DemoStatusFilter = 'all' | DemoStatus;

type TableProject = Readonly<{
  arr: number;
  id: string;
  owner: string;
  project: string;
  status: DemoStatus;
  updated: string;
}>;

const PAGE_SIZE = 5;

const statusOptions: readonly DemoStatusFilter[] = Object.freeze([
  'all',
  'Active',
  'Draft',
  'Review',
  'Blocked',
]);

const projectRows: readonly TableProject[] = Object.freeze([
  { id: 'aurora', project: 'Aurora Console', owner: 'Ava Patel', status: 'Active', arr: 128000, updated: '2026-04-22' },
  { id: 'northstar', project: 'Northstar API', owner: 'Ivy Chen', status: 'Review', arr: 98000, updated: '2026-04-21' },
  { id: 'relay', project: 'Relay Billing', owner: 'Mason Lee', status: 'Draft', arr: 72000, updated: '2026-04-20' },
  { id: 'delta', project: 'Delta Insights', owner: 'Noah Kim', status: 'Blocked', arr: 56000, updated: '2026-04-18' },
  { id: 'beacon', project: 'Beacon Admin', owner: 'Lena Brooks', status: 'Active', arr: 143000, updated: '2026-04-17' },
  { id: 'canvas', project: 'Canvas Studio', owner: 'Mila Foster', status: 'Review', arr: 67000, updated: '2026-04-16' },
  { id: 'orbit', project: 'Orbit Search', owner: 'Ethan Ross', status: 'Active', arr: 154000, updated: '2026-04-15' },
  { id: 'spruce', project: 'Spruce CMS', owner: 'Zoe Nguyen', status: 'Draft', arr: 61000, updated: '2026-04-13' },
]);

const usdFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

function resolveSortColumnId(value: string | null): DemoSortColumnId | null {
  if (
    value === 'arr' ||
    value === 'owner' ||
    value === 'project' ||
    value === 'status' ||
    value === 'updated'
  ) {
    return value;
  }

  return null;
}

function resolveSortValue(item: TableProject, columnId: DemoSortColumnId): number | string {
  switch (columnId) {
    case 'arr':
      return item.arr;
    case 'owner':
      return item.owner;
    case 'project':
      return item.project;
    case 'status':
      return item.status;
    case 'updated':
      return item.updated;
  }
}

@Component({
  selector: 'app-table-playground-page',
  imports: [
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableFooter,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    TngTableToolbar,
    TngTablePagination,
    TngTableLoading,
    TngTableEmpty,
    TngTableSort,
    TngSortHeader,
  ],
  templateUrl: './table-playground-page.component.html',
  styleUrl: './table-playground-page.component.css',
})
export class TablePlaygroundPageComponent {
  protected readonly pageSize = PAGE_SIZE;
  protected readonly projects = projectRows;
  protected readonly statusOptions = statusOptions;

  protected readonly loading = signal(false);
  protected readonly pageIndex = signal(0);
  protected readonly query = signal('');
  protected readonly selectedIds = signal<readonly string[]>([]);
  protected readonly sortState = signal<TngTableSortChange>({
    activeColumnId: 'updated',
    direction: 'desc',
  });
  protected readonly statusFilter = signal<DemoStatusFilter>('all');

  protected readonly matchingRows = computed(() => {
    const filterController = createTngFilterController<TableProject, 'status'>({
      query: this.query(),
      columnFilters: this.statusFilter() === 'all' ? {} : { status: this.statusFilter() },
      columnFilterPredicates: {
        status: (item, filterValue) => item.status === filterValue,
      },
      globalFilter: (item, query) => {
        const normalizedQuery = query.toLowerCase();
        return [item.project, item.owner, item.status].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      },
    });

    const sortColumnId = resolveSortColumnId(this.sortState().activeColumnId);
    const sortController = createTngSortController<TableProject, DemoSortColumnId>({
      accessor: (item, columnId) => resolveSortValue(item, columnId),
      activeColumnId: sortColumnId,
      direction: this.sortState().direction,
    });

    return sortController.apply(filterController.apply(projectRows));
  });

  protected readonly pageCount = computed(() => {
    const controller = createTngPaginationController<TableProject>({
      pageIndex: this.pageIndex(),
      pageSize: PAGE_SIZE,
    });

    return controller.getPageCount(this.matchingRows().length);
  });

  protected readonly currentPageIndex = computed(() => {
    const pageCount = this.pageCount();
    if (pageCount === 0) {
      return 0;
    }

    return Math.min(this.pageIndex(), pageCount - 1);
  });

  protected readonly visibleRows = computed(() => {
    if (this.loading()) {
      return [];
    }

    const controller = createTngPaginationController<TableProject>({
      pageIndex: this.currentPageIndex(),
      pageSize: PAGE_SIZE,
    });

    return controller.slice(this.matchingRows());
  });

  protected readonly allVisibleSelected = computed(() => {
    const visibleIds = this.visibleRows().map((row) => row.id);
    return visibleIds.length > 0 && visibleIds.every((id) => this.selectedIds().includes(id));
  });

  protected readonly displayPageCount = computed(() => Math.max(1, this.pageCount()));

  protected readonly displayPageNumber = computed(() =>
    this.pageCount() === 0 ? 1 : this.currentPageIndex() + 1,
  );

  protected readonly matchingArr = computed(() =>
    this.matchingRows().reduce((total, row) => total + row.arr, 0),
  );

  protected readonly visibleArr = computed(() =>
    this.visibleRows().reduce((total, row) => total + row.arr, 0),
  );

  protected readonly selectedProjectsLabel = computed(() => {
    const labelList = projectRows
      .filter((row) => this.selectedIds().includes(row.id))
      .map((row) => row.project);

    if (labelList.length === 0) {
      return 'No rows selected';
    }

    return labelList.join(', ');
  });

  protected formatArr(value: number): string {
    return usdFormatter.format(value);
  }

  protected isRowSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  protected onNextPage(): void {
    this.pageIndex.update((value) => Math.min(value + 1, Math.max(0, this.pageCount() - 1)));
  }

  protected onPreviousPage(): void {
    this.pageIndex.update((value) => Math.max(0, value - 1));
  }

  protected onQueryInput(value: string): void {
    this.query.set(value);
    this.pageIndex.set(0);
  }

  protected onSortChange(sortState: TngTableSortChange): void {
    this.sortState.set(sortState);
    this.pageIndex.set(0);
  }

  protected onStatusFilterChange(value: string): void {
    if (value === 'Active' || value === 'Blocked' || value === 'Draft' || value === 'Review') {
      this.statusFilter.set(value);
    } else {
      this.statusFilter.set('all');
    }

    this.pageIndex.set(0);
  }

  protected onToggleLoading(): void {
    this.loading.update((value) => !value);
  }

  protected onToggleRowSelection(id: string): void {
    const controller = createTngRowSelectionController<string>({
      initialSelectedIds: this.selectedIds(),
      mode: 'multiple',
    });

    this.selectedIds.set(controller.toggle(id).selectedIds);
  }

  protected onToggleVisibleSelection(checked: boolean): void {
    const visibleIds = this.visibleRows().map((row) => row.id);
    if (!checked) {
      this.selectedIds.set(this.selectedIds().filter((id) => !visibleIds.includes(id)));
      return;
    }

    const controller = createTngRowSelectionController<string>({
      initialSelectedIds: this.selectedIds(),
      mode: 'multiple',
    });

    for (const id of visibleIds) {
      if (!controller.isSelected(id)) {
        controller.toggle(id);
      }
    }

    this.selectedIds.set(controller.getState().selectedIds);
  }

  protected onSelectAllMatching(): void {
    const controller = createTngRowSelectionController<string>({
      mode: 'multiple',
    });

    this.selectedIds.set(controller.selectAll(this.matchingRows().map((row) => row.id)).selectedIds);
  }

  protected onClearSelection(): void {
    this.selectedIds.set([]);
  }

  protected rowStatusTone(status: DemoStatus): 'active' | 'blocked' | 'draft' | 'review' {
    return status.toLowerCase() as 'active' | 'blocked' | 'draft' | 'review';
  }

  protected sortDirectionFor(columnId: DemoSortColumnId): TngTableSortDirection | null {
    return this.sortState().activeColumnId === columnId ? this.sortState().direction : null;
  }
}
