import { Component, booleanAttribute, computed, input, output } from '@angular/core';
import {
  TngPagination,
  type TngPaginationChangeEvent,
  type TngPaginationMode,
  TngPaginationFirst,
  TngPaginationLast,
  TngPaginationNext,
  TngPaginationPage,
  TngPaginationPageSize,
  TngPaginationPrevious,
} from '@tailng-ui/primitives';

export type TngPaginatorSize = 'md' | 'sm';

function normalizePageButtonCount(value: unknown): number {
  if (typeof value === 'number') {
    return Math.max(1, Math.trunc(Number.isFinite(value) ? value : 5));
  }

  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Math.max(1, Math.trunc(Number.isFinite(parsed) ? parsed : 5));
  }

  return 5;
}

function normalizePageSizeOptions(value: readonly number[] | null | undefined): readonly number[] {
  if (value === null || value === undefined) {
    return [5, 10, 25, 50];
  }

  const uniqueOptions = new Set<number>();
  for (const entry of value) {
    const normalizedEntry = Math.max(1, Math.trunc(entry));
    if (Number.isFinite(normalizedEntry)) {
      uniqueOptions.add(normalizedEntry);
    }
  }

  const normalized = [...uniqueOptions].sort((a, b) => a - b);

  return normalized.length > 0 ? normalized : [5, 10, 25, 50];
}

@Component({
  selector: 'tng-paginator',
  imports: [
    TngPagination,
    TngPaginationFirst,
    TngPaginationPrevious,
    TngPaginationNext,
    TngPaginationLast,
    TngPaginationPage,
    TngPaginationPageSize,
  ],
  templateUrl: './tng-paginator.component.html',
  styleUrl: './tng-paginator.component.css',
  exportAs: 'tngPaginator',
})
export class TngPaginatorComponent {
  public readonly ariaLabel = input<string | null>('Pagination');
  public readonly defaultPageIndex = input<number>(0);
  public readonly defaultPageSize = input<number>(10);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly mode = input<TngPaginationMode>('client');
  public readonly pageIndex = input<number | undefined>(undefined);
  public readonly pageSize = input<number | undefined>(undefined);
  public readonly totalItems = input<number>(0);
  public readonly pageSizeOptions = input<readonly number[] | null, readonly number[] | null | undefined>(
    [5, 10, 25, 50],
    {
      transform: normalizePageSizeOptions,
    },
  );
  public readonly maxPageButtons = input<number, unknown>(5, {
    transform: normalizePageButtonCount,
  });
  public readonly showFirstLast = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showPageSize = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showRange = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly size = input<TngPaginatorSize>('md');

  public readonly pageIndexChange = output<number>();
  public readonly pageSizeChange = output<number>();
  public readonly pageChange = output<TngPaginationChangeEvent>();

  protected readonly normalizedPageSizeOptions = computed(() => this.pageSizeOptions());

  protected getPages(currentPageIndex: number, pageCount: number): readonly number[] {
    if (pageCount <= 0) {
      return [];
    }

    const maxPages = Math.min(this.maxPageButtons(), pageCount);
    const halfWindow = Math.floor(maxPages / 2);
    let start = currentPageIndex - halfWindow;
    let end = start + maxPages - 1;

    if (start < 0) {
      start = 0;
      end = maxPages - 1;
    }

    if (end >= pageCount) {
      end = pageCount - 1;
      start = Math.max(0, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_entry, index) => start + index);
  }

  protected getRangeLabel(pageIndex: number, pageSize: number, totalItems: number): string {
    if (totalItems <= 0) {
      return '0 of 0';
    }

    const start = pageIndex * pageSize + 1;
    const end = Math.min(totalItems, start + pageSize - 1);
    return `${start}-${end} of ${totalItems}`;
  }

  protected getPageLabel(pageIndex: number): string {
    return `Page ${pageIndex + 1}`;
  }

  protected onPageIndexChange(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }

  protected onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  protected onPageChange(event: TngPaginationChangeEvent): void {
    this.pageChange.emit(event);
  }
}

export { TngPaginatorComponent as TngPaginator };
