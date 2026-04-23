export type TngTableColumnFilterPredicate<TItem, TColumnId extends string = string> = (
  item: TItem,
  filterValue: unknown,
  columnId: TColumnId,
) => boolean;

export type TngTableGlobalFilterPredicate<TItem> = (item: TItem, query: string) => boolean;

export type TngTableFilterState = Readonly<{
  columnFilters: Readonly<Record<string, unknown>>;
  query: string;
}>;

export type TngTableFilterOptions<TItem, TColumnId extends string = string> = Readonly<{
  columnFilterPredicates?: Readonly<
    Partial<Record<TColumnId, TngTableColumnFilterPredicate<TItem, TColumnId>>>
  >;
  columnFilters?: Readonly<Partial<Record<TColumnId, unknown>>>;
  globalFilter?: TngTableGlobalFilterPredicate<TItem>;
  query?: string;
}>;

export type TngTableFilterController<TItem, TColumnId extends string = string> = Readonly<{
  apply: (items: readonly TItem[]) => readonly TItem[];
  clear: () => TngTableFilterState;
  getState: () => TngTableFilterState;
  setColumnFilter: (columnId: TColumnId, filterValue: unknown) => TngTableFilterState;
  setQuery: (query: string) => TngTableFilterState;
}>;
