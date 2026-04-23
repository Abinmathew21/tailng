import type {
  TngTableColumnFilterPredicate,
  TngTableFilterController,
  TngTableFilterOptions,
  TngTableFilterState,
  TngTableGlobalFilterPredicate,
} from './filter.types';

function normalizeQuery(query: string | undefined): string {
  return query?.trim() ?? '';
}

function toSearchText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return '';
}

function normalizeColumnFilters(
  filters: Readonly<Record<string, unknown>> | undefined,
): Record<string, unknown> {
  return { ...(filters ?? {}) };
}

function defaultGlobalFilter<TItem>(item: TItem, query: string): boolean {
  const normalizedQuery = query.toLowerCase();

  if (typeof item !== 'object' || item === null) {
    return toSearchText(item).toLowerCase().includes(normalizedQuery);
  }

  return Object.values(item as Record<string, unknown>).some((value) =>
    toSearchText(value).toLowerCase().includes(normalizedQuery),
  );
}

function defaultColumnPredicate<TItem, TColumnId extends string>(
  item: TItem,
  filterValue: unknown,
  columnId: TColumnId,
): boolean {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const value = (item as Record<string, unknown>)[columnId];
  return toSearchText(value).toLowerCase().includes(toSearchText(filterValue).toLowerCase());
}

class TngTableFilterControllerImpl<TItem, TColumnId extends string>
  implements TngTableFilterController<TItem, TColumnId>
{
  private readonly columnFilterPredicates: Readonly<
    Partial<Record<TColumnId, TngTableColumnFilterPredicate<TItem, TColumnId>>>
  >;
  private readonly globalFilter: TngTableGlobalFilterPredicate<TItem>;
  private columnFiltersState: Record<string, unknown>;
  private queryState: string;

  public constructor(options: TngTableFilterOptions<TItem, TColumnId>) {
    this.columnFilterPredicates =
      options.columnFilterPredicates ??
      ({} as Readonly<Partial<Record<TColumnId, TngTableColumnFilterPredicate<TItem, TColumnId>>>>);
    this.columnFiltersState = normalizeColumnFilters(options.columnFilters);
    this.globalFilter = options.globalFilter ?? defaultGlobalFilter;
    this.queryState = normalizeQuery(options.query);
  }

  public apply(items: readonly TItem[]): readonly TItem[] {
    return items.filter((item) => this.matchesQuery(item) && this.matchesColumnFilters(item));
  }

  public clear(): TngTableFilterState {
    this.queryState = '';
    this.columnFiltersState = {};
    return this.getState();
  }

  public getState(): TngTableFilterState {
    return Object.freeze({
      columnFilters: Object.freeze({ ...this.columnFiltersState }),
      query: this.queryState,
    });
  }

  public setColumnFilter(columnId: TColumnId, filterValue: unknown): TngTableFilterState {
    const nextFilters = { ...this.columnFiltersState };

    if (filterValue === undefined || filterValue === null || filterValue === '') {
      delete nextFilters[columnId];
    } else {
      nextFilters[columnId] = filterValue;
    }

    this.columnFiltersState = nextFilters;
    return this.getState();
  }

  public setQuery(query: string): TngTableFilterState {
    this.queryState = normalizeQuery(query);
    return this.getState();
  }

  private matchesColumnFilters(item: TItem): boolean {
    for (const [columnId, filterValue] of Object.entries(this.columnFiltersState)) {
      const predicate =
        (this.columnFilterPredicates[columnId as TColumnId] ?? defaultColumnPredicate) as
          | TngTableColumnFilterPredicate<TItem, TColumnId>
          | undefined;

      if (predicate === undefined) {
        continue;
      }

      if (!predicate(item, filterValue, columnId as TColumnId)) {
        return false;
      }
    }

    return true;
  }

  private matchesQuery(item: TItem): boolean {
    if (this.queryState.length === 0) {
      return true;
    }

    return this.globalFilter(item, this.queryState);
  }
}

export function createTngFilterController<TItem, TColumnId extends string = string>(
  options: TngTableFilterOptions<TItem, TColumnId> = {},
): TngTableFilterController<TItem, TColumnId> {
  return new TngTableFilterControllerImpl(options);
}
