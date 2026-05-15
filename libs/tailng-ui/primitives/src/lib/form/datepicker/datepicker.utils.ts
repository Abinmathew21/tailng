/* eslint-disable max-params -- Datepicker utility facades preserve the existing public positional API. */
import {
  buildMonthGrid as buildTngMonthGrid,
  buildMonthOptions as buildTngMonthOptions,
  buildYearOptions as buildTngYearOptions,
  hasSelectableDateInYear as hasTngSelectableDateInYear,
  isDateInRange as isTngDateInRange,
  isValueSelected as isTngValueSelected,
  resolveWeekBoundaryDate as resolveTngWeekBoundaryDate,
} from '@tailng-ui/cdk';
import type {
  TngDateAdapter,
  TngDateCell,
  TngDateValue,
  TngDatepickerSelectionMode,
  TngMonthOption,
  TngWeekdayIndex,
  TngYearOption,
} from './datepicker.types';

type TngMonthGridOptions<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createCellId: (date: TDate) => string;
  fixedWeeks: boolean;
  focusStrategy: 'active-descendant' | 'roving';
  focusedDate: TDate | null;
  inRange: (date: TDate) => boolean;
  isDisabled: (date: TDate) => boolean;
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
  hasSelectableDateInMonth,
  includesView,
  isDateValueInMonth,
  moveDateSkippingDisabled,
  normalizeRangeOrder,
  resolveInitialFocusedSection,
  resolveLocaleWeekStartsOn,
  resolveViewForEscape,
  sortAndUniqueDates,
  toDateKey,
} from '@tailng-ui/cdk';

type TngWeekBoundary = 'end' | 'start';

export function buildMonthGrid<TDate>(
  options: Readonly<TngMonthGridOptions<TDate>>,
): readonly TngDateCell<TDate>[] {
  return buildTngMonthGrid(options);
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

export function isValueSelected<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  value: Readonly<TngDateValue<TDate>>,
  date: TDate,
): boolean {
  return isTngValueSelected({ adapter, date, selectionMode, value });
}

export function isDateInRange<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: Readonly<TngDateValue<TDate>>,
  date: TDate,
): boolean {
  return isTngDateInRange({ adapter, date, value });
}

export function hasSelectableDateInYear<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  year: number,
  _currentMonth: TDate,
  isDisabled: (date: TDate) => boolean,
): boolean {
  return hasTngSelectableDateInYear({ adapter, isDisabled, year });
}
