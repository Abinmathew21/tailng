export type TngTablePaginationMode = 'client' | 'server';

export type TngTablePaginationState = Readonly<{
  pageIndex: number;
  pageSize: number;
}>;

export type TngTablePaginationChangeEvent = Readonly<{
  mode: TngTablePaginationMode;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
  previousPageSize: number;
  totalItems?: number;
}>;

export type TngTablePaginationSetPageSizeOptions = Readonly<{
  anchorIndex?: number;
}>;

export type TngTablePaginationOptions = Readonly<{
  mode?: TngTablePaginationMode;
  onPageChange?: (event: TngTablePaginationChangeEvent) => void;
  pageIndex?: number;
  pageSize?: number;
}>;

export type TngTablePaginationController<TItem> = Readonly<{
  getPageCount: (totalItems: number) => number;
  getState: () => TngTablePaginationState;
  reset: (totalItems?: number) => TngTablePaginationState;
  setPageIndex: (pageIndex: number, totalItems?: number) => TngTablePaginationState;
  setPageSize: (
    pageSize: number,
    totalItems?: number,
    options?: TngTablePaginationSetPageSizeOptions,
  ) => TngTablePaginationState;
  slice: (items: readonly TItem[]) => readonly TItem[];
}>;
