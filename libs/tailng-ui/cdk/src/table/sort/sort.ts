import type {
  TngTableAriaSort,
  TngTableSortComparator,
  TngTableSortController,
  TngTableSortDirection,
  TngTableSortOptions,
  TngTableSortState,
} from './sort.types';

type TngSortableEntry<TItem> = Readonly<{
  index: number;
  item: TItem;
}>;

type TngAccessorSortableEntry<TItem> = Readonly<{
  index: number;
  item: TItem;
  sortValue: unknown;
}>;

function compareBigints(left: unknown, right: unknown): number | null {
  if (typeof left !== 'bigint' || typeof right !== 'bigint') {
    return null;
  }

  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function compareBooleans(left: unknown, right: unknown): number | null {
  if (typeof left !== 'boolean' || typeof right !== 'boolean') {
    return null;
  }

  if (left === right) {
    return 0;
  }

  return left ? 1 : -1;
}

function compareDates(left: unknown, right: unknown): number | null {
  if (!(left instanceof Date) || !(right instanceof Date)) {
    return null;
  }

  return left.getTime() - right.getTime();
}

function compareNumbers(left: unknown, right: unknown): number | null {
  if (typeof left !== 'number' || typeof right !== 'number') {
    return null;
  }

  return left - right;
}

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function toComparableText(value: unknown): string {
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

function compareFallback(left: unknown, right: unknown): number {
  if (Object.is(left, right)) {
    return 0;
  }

  if (isNil(left)) {
    return 1;
  }

  if (isNil(right)) {
    return -1;
  }

  return (
    compareDates(left, right) ??
    compareNumbers(left, right) ??
    compareBigints(left, right) ??
    compareBooleans(left, right) ??
    toComparableText(left).localeCompare(toComparableText(right))
  );
}

function compareSortedEntries<TItem, TColumnId extends string>(
  left: TngSortableEntry<TItem>,
  right: TngSortableEntry<TItem>,
  options: Readonly<{
    activeColumnId: TColumnId;
    comparator: TngTableSortComparator<TItem, TColumnId>;
    directionMultiplier: number;
  }>,
): number {
  const comparison = options.comparator(left.item, right.item, options.activeColumnId);
  if (comparison !== 0) {
    return comparison * options.directionMultiplier;
  }

  return left.index - right.index;
}

function compareAccessorSortedEntries(
  left: TngAccessorSortableEntry<unknown>,
  right: TngAccessorSortableEntry<unknown>,
  directionMultiplier: number,
): number {
  const comparison = compareFallback(left.sortValue, right.sortValue);
  if (comparison !== 0) {
    return comparison * directionMultiplier;
  }

  return left.index - right.index;
}

function resolveNextDirection(
  currentDirection: TngTableSortDirection | null,
  disableClear: boolean,
): TngTableSortDirection | null {
  if (currentDirection === null) {
    return 'asc';
  }

  if (currentDirection === 'asc') {
    return 'desc';
  }

  return disableClear ? 'asc' : null;
}

class TngTableSortControllerImpl<TItem, TColumnId extends string>
  implements TngTableSortController<TItem, TColumnId>
{
  private readonly comparator: TngTableSortComparator<TItem, TColumnId> | null;
  private readonly accessor: TngTableSortOptions<TItem, TColumnId>['accessor'];
  private readonly disableClearState: boolean;
  private activeColumnIdState: TColumnId | null;
  private directionState: TngTableSortDirection | null;

  public constructor(options: TngTableSortOptions<TItem, TColumnId>) {
    this.accessor = options.accessor;
    this.comparator = options.comparator ?? null;
    this.disableClearState = options.disableClear ?? false;
    this.activeColumnIdState = options.activeColumnId ?? null;
    this.directionState = options.direction ?? null;
  }

  public apply(items: readonly TItem[]): readonly TItem[] {
    const activeColumnId = this.activeColumnIdState;
    if (activeColumnId === null || this.directionState === null) {
      return [...items];
    }

    const directionMultiplier = this.directionState === 'asc' ? 1 : -1;
    const comparator = this.comparator;
    if (comparator !== null) {
      const sortOptions = Object.freeze({
        activeColumnId,
        comparator,
        directionMultiplier,
      });

      return items
        .map<TngSortableEntry<TItem>>((item, index) => ({ index, item }))
        .sort((left, right) => compareSortedEntries(left, right, sortOptions))
        .map((entry) => entry.item);
    }

    const accessor = this.accessor;
    if (accessor === undefined) {
      return [...items];
    }

    return items
      .map<TngAccessorSortableEntry<TItem>>((item, index) => ({
        index,
        item,
        sortValue: accessor(item, activeColumnId),
      }))
      .sort((left, right) => compareAccessorSortedEntries(left, right, directionMultiplier))
      .map((entry) => entry.item);
  }

  public clear(): TngTableSortState<TColumnId> {
    return this.set(null, null);
  }

  public getAriaSort(columnId: TColumnId): TngTableAriaSort {
    if (this.activeColumnIdState !== columnId || this.directionState === null) {
      return 'none';
    }

    return this.directionState === 'asc' ? 'ascending' : 'descending';
  }

  public getState(): TngTableSortState<TColumnId> {
    return Object.freeze({
      activeColumnId: this.activeColumnIdState,
      direction: this.directionState,
      disableClear: this.disableClearState,
    });
  }

  public set(
    activeColumnId: TColumnId | null,
    direction: TngTableSortDirection | null,
  ): TngTableSortState<TColumnId> {
    this.activeColumnIdState = activeColumnId;
    this.directionState = activeColumnId === null ? null : direction;
    return this.getState();
  }

  public toggle(columnId: TColumnId): TngTableSortState<TColumnId> {
    const nextDirection =
      this.activeColumnIdState === columnId
        ? resolveNextDirection(this.directionState, this.disableClearState)
        : 'asc';

    if (nextDirection === null) {
      return this.clear();
    }

    return this.set(columnId, nextDirection);
  }
}

export function createTngSortController<TItem, TColumnId extends string = string>(
  options: TngTableSortOptions<TItem, TColumnId> = {},
): TngTableSortController<TItem, TColumnId> {
  return new TngTableSortControllerImpl(options);
}
