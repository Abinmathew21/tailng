import type {
  TngTablePaginationChangeEvent,
  TngTablePaginationController,
  TngTablePaginationMode,
  TngTablePaginationOptions,
  TngTablePaginationSetPageSizeOptions,
  TngTablePaginationState,
} from './pagination.types';

function normalizePageIndex(value: number | undefined): number {
  return Math.max(0, Math.trunc(value ?? 0));
}

function normalizePageSize(value: number | undefined): number {
  return Math.max(1, Math.trunc(value ?? 10));
}

function resolvePageCount(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / pageSize);
}

function clampPageIndex(pageIndex: number, totalItems: number | undefined, pageSize: number): number {
  if (totalItems === undefined) {
    return Math.max(0, pageIndex);
  }

  const pageCount = resolvePageCount(totalItems, pageSize);
  if (pageCount === 0) {
    return 0;
  }

  return Math.min(Math.max(0, pageIndex), pageCount - 1);
}

class TngTablePaginationControllerImpl<TItem> implements TngTablePaginationController<TItem> {
  private readonly mode: TngTablePaginationMode;
  private readonly onPageChange: ((event: TngTablePaginationChangeEvent) => void) | null;
  private pageIndexState: number;
  private pageSizeState: number;

  public constructor(options: TngTablePaginationOptions) {
    this.mode = options.mode ?? 'client';
    this.onPageChange = options.onPageChange ?? null;
    this.pageSizeState = normalizePageSize(options.pageSize);
    this.pageIndexState = normalizePageIndex(options.pageIndex);
  }

  public getPageCount(totalItems: number): number {
    return resolvePageCount(totalItems, this.pageSizeState);
  }

  public getState(): TngTablePaginationState {
    return Object.freeze({
      pageIndex: this.pageIndexState,
      pageSize: this.pageSizeState,
    });
  }

  public reset(totalItems?: number): TngTablePaginationState {
    return this.commit(0, this.pageSizeState, totalItems);
  }

  public setPageIndex(pageIndex: number, totalItems?: number): TngTablePaginationState {
    const normalizedPageIndex = normalizePageIndex(pageIndex);
    const nextPageIndex =
      this.mode === 'server'
        ? normalizedPageIndex
        : clampPageIndex(normalizedPageIndex, totalItems, this.pageSizeState);

    return this.commit(nextPageIndex, this.pageSizeState, totalItems);
  }

  public setPageSize(
    pageSize: number,
    totalItems?: number,
    options?: TngTablePaginationSetPageSizeOptions,
  ): TngTablePaginationState {
    const nextPageSize = normalizePageSize(pageSize);
    const nextPageIndex =
      options?.anchorIndex !== undefined
        ? Math.floor(Math.max(0, Math.trunc(options.anchorIndex)) / nextPageSize)
        : this.pageIndexState;

    return this.commit(nextPageIndex, nextPageSize, totalItems);
  }

  public slice(items: readonly TItem[]): readonly TItem[] {
    if (this.mode === 'server') {
      return [...items];
    }

    const pageIndex = clampPageIndex(this.pageIndexState, items.length, this.pageSizeState);
    const start = pageIndex * this.pageSizeState;
    return items.slice(start, start + this.pageSizeState);
  }

  private commit(
    pageIndex: number,
    pageSize: number,
    totalItems?: number,
  ): TngTablePaginationState {
    const previousPageIndex = this.pageIndexState;
    const previousPageSize = this.pageSizeState;

    this.pageSizeState = pageSize;
    this.pageIndexState =
      this.mode === 'server'
        ? normalizePageIndex(pageIndex)
        : clampPageIndex(normalizePageIndex(pageIndex), totalItems, this.pageSizeState);

    const nextState = this.getState();

    if (
      this.onPageChange !== null
      && (nextState.pageIndex !== previousPageIndex || nextState.pageSize !== previousPageSize)
    ) {
      this.onPageChange(
        Object.freeze({
          mode: this.mode,
          pageIndex: nextState.pageIndex,
          pageSize: nextState.pageSize,
          previousPageIndex,
          previousPageSize,
          totalItems,
        }),
      );
    }

    return nextState;
  }
}

export function createTngPaginationController<TItem>(
  options: TngTablePaginationOptions = {},
): TngTablePaginationController<TItem> {
  return new TngTablePaginationControllerImpl(options);
}
