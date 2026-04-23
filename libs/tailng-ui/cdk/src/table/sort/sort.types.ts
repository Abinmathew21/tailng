export type TngTableAriaSort = 'ascending' | 'descending' | 'none';
export type TngTableSortDirection = 'asc' | 'desc';

export type TngTableSortAccessor<TItem, TColumnId extends string = string> = (
  item: TItem,
  columnId: TColumnId,
) => unknown;

export type TngTableSortComparator<TItem, TColumnId extends string = string> = (
  left: TItem,
  right: TItem,
  columnId: TColumnId,
) => number;

export type TngTableSortState<TColumnId extends string = string> = Readonly<{
  activeColumnId: TColumnId | null;
  direction: TngTableSortDirection | null;
  disableClear: boolean;
}>;

export type TngTableSortOptions<TItem, TColumnId extends string = string> = Readonly<{
  accessor?: TngTableSortAccessor<TItem, TColumnId>;
  activeColumnId?: TColumnId | null;
  comparator?: TngTableSortComparator<TItem, TColumnId>;
  direction?: TngTableSortDirection | null;
  disableClear?: boolean;
}>;

export type TngTableSortController<TItem, TColumnId extends string = string> = Readonly<{
  apply: (items: readonly TItem[]) => readonly TItem[];
  clear: () => TngTableSortState<TColumnId>;
  getAriaSort: (columnId: TColumnId) => TngTableAriaSort;
  getState: () => TngTableSortState<TColumnId>;
  set: (
    activeColumnId: TColumnId | null,
    direction: TngTableSortDirection | null,
  ) => TngTableSortState<TColumnId>;
  toggle: (columnId: TColumnId) => TngTableSortState<TColumnId>;
}>;
