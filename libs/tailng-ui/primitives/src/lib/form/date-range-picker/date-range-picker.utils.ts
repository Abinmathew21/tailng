/* eslint-disable max-params -- Date range picker utility facades preserve the existing public positional API. */
import {
  buildMonthGrid as buildTngMonthGrid,
  buildMonthOptions as buildTngMonthOptions,
  buildYearOptions as buildTngYearOptions,
  hasSelectableDateInYear as hasTngSelectableDateInYear,
  isDateInRange as isTngDateInRange,
  resolveWeekBoundaryDate as resolveTngWeekBoundaryDate,
} from '@tailng-ui/cdk';
import type {
  TngDateAdapter,
  TngDateCell,
  TngDateRange,
  TngDateValue,
  TngMonthOption,
  TngWeekdayIndex,
  TngYearOption,
} from './date-range-picker.types';

type TngMonthGridOptions<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createCellId: (date: TDate) => string;
  fixedWeeks: boolean;
  focusStrategy: 'active-descendant' | 'roving';
  focusedDate: TDate | null;
  inRange: (date: TDate) => boolean;
  isDisabled: (date: TDate) => boolean;
  isPreviewRange: (date: TDate) => boolean;
  isRangeEnd: (date: TDate) => boolean;
  isRangeStart: (date: TDate) => boolean;
  isSelected: (date: TDate) => boolean;
  locale?: string;
  showOutsideDays: boolean;
  today: TDate;
  visibleMonth: TDate;
  weekStartsOn: TngWeekdayIndex;
}>;

type TngMonthOptionsConfig<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createId: (month: number) => string;
  disabledMonth: (month: number) => boolean;
  focusedDate: TDate | null;
  focusedSection: 'day' | 'month' | 'year';
  locale?: string;
  selectedMonth: (month: number) => boolean;
  visibleMonth: TDate;
}>;

type TngYearOptionsConfig<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createId: (year: number) => string;
  disabledYear: (year: number) => boolean;
  focusedDate: TDate | null;
  focusedSection: 'day' | 'month' | 'year';
  locale?: string;
  selectedYear: (year: number) => boolean;
  startYear: number;
  totalYears: number;
  visibleMonth: TDate;
}>;

export {
  clampDateToMonth,
  compareMonthIdentity,
  compareYearIdentity,
  datesEqual,
  findFirstEnabledDateInMonth,
  hasCompleteRange,
  hasPartialRange,
  hasSelectableDateInMonth,
  includesView,
  isDateAfter,
  isDateBefore,
  isDateBetween,
  isDateValueInMonth,
  isSameDate,
  moveDateSkippingDisabled,
  normalizeDateRange,
  normalizeRangeOrder,
  resolveInitialFocusedSection,
  resolveLocaleWeekStartsOn,
  resolveViewForEscape,
  sortAndUniqueDates,
  startOfDate,
  toDateKey,
} from '@tailng-ui/cdk';

type TngWeekBoundary = 'end' | 'start';

export function isValueSelected<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: 'range',
  value: Readonly<TngDateValue<TDate>>,
  date: TDate,
): boolean {
  if (value === null) {
    return false;
  }

  const range = value as TngDateRange<TDate>;
  if (range.start === null || range.end === null) {
    return range.start !== null && adapter.compare(range.start, date) === 0;
  }

  return adapter.compare(range.start, date) === 0 || adapter.compare(range.end, date) === 0;
}

export function isDateInRange<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: Readonly<TngDateValue<TDate>>,
  date: TDate,
): boolean {
  return isTngDateInRange({ adapter, date, includeEndpoints: false, value });
}

export function buildMonthGrid<TDate>(
  options: Readonly<TngMonthGridOptions<TDate>>,
): readonly TngDateCell<TDate>[] {
  return buildTngMonthGrid({
    ...options,
    getCellState: ({ date }) =>
      Object.freeze({
        previewRange: options.isPreviewRange(date),
      }),
  });
}

export function buildMonthOptions<TDate>(
  options: Readonly<TngMonthOptionsConfig<TDate>>,
): readonly TngMonthOption<TDate>[] {
  return buildTngMonthOptions(options);
}

export function buildYearOptions<TDate>(
  options: Readonly<TngYearOptionsConfig<TDate>>,
): readonly TngYearOption<TDate>[] {
  return buildTngYearOptions(options);
}

export function resolveWeekBoundaryDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  date: TDate,
  weekStartsOn: TngWeekdayIndex,
  boundary: TngWeekBoundary,
): TDate {
  return resolveTngWeekBoundaryDate({ adapter, boundary, date, weekStartsOn });
}

export function hasSelectableDateInYear<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  year: number,
  _currentMonth: TDate,
  isDisabled: (date: TDate) => boolean,
): boolean {
  return hasTngSelectableDateInYear({ adapter, isDisabled, year });
}
