import type {
  TngCalendarView,
  TngDateAdapter,
  TngDateCell,
  TngDateRange,
  TngDateRangeValue,
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

type TngMoveDateOptions<TDate> = Readonly<{
  adapter: Readonly<TngDateAdapter<TDate>>;
  allowCrossView?: boolean;
  delta: number;
  isDisabled: (date: TDate) => boolean;
  start: TDate;
}>;

type TngWeekBoundary = 'end' | 'start';

export function resolveLocaleWeekStartsOn(locale?: string): TngWeekdayIndex {
  if (typeof Intl === 'undefined' || typeof Intl.Locale === 'undefined' || locale === undefined) {
    return 0;
  }

  try {
    const weekInfo = (
      new Intl.Locale(locale) as Intl.Locale & {
        weekInfo?: Readonly<{ firstDay: number }>;
      }
    ).weekInfo;
    if (weekInfo === undefined) {
      return 0;
    }

    return (weekInfo.firstDay % 7) as TngWeekdayIndex;
  } catch {
    return 0;
  }
}

export function toDateKey<TDate>(adapter: Readonly<TngDateAdapter<TDate>>, date: TDate): string {
  const year = adapter.getYear(date).toString().padStart(4, '0');
  const month = (adapter.getMonth(date) + 1).toString().padStart(2, '0');
  const day = adapter.getDate(date).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function datesEqual<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  left: TDate | null,
  right: TDate | null,
): boolean {
  if (left === null || right === null) {
    return left === right;
  }

  return adapter.compare(left, right) === 0;
}

export function isSameDate(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateBefore(a: Date, b: Date): boolean {
  return startOfDate(a).getTime() < startOfDate(b).getTime();
}

export function isDateAfter(a: Date, b: Date): boolean {
  return startOfDate(a).getTime() > startOfDate(b).getTime();
}

export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  const valueTime = startOfDate(date).getTime();
  const startTime = startOfDate(start).getTime();
  const endTime = startOfDate(end).getTime();

  return valueTime > startTime && valueTime < endTime;
}

export function normalizeDateRange(start: Date, end: Date): { end: Date; start: Date } {
  return isDateBefore(end, start) ? { end: start, start: end } : { end, start };
}

export function hasCompleteRange(value: TngDateRangeValue | null | undefined): boolean {
  return !!value?.start && !!value?.end;
}

export function hasPartialRange(value: TngDateRangeValue | null | undefined): boolean {
  return !!value?.start && !value?.end;
}

export function compareMonthIdentity<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  left: TDate,
  right: TDate,
): number {
  const yearDiff = adapter.getYear(left) - adapter.getYear(right);
  if (yearDiff !== 0) {
    return yearDiff;
  }

  return adapter.getMonth(left) - adapter.getMonth(right);
}

export function compareYearIdentity<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  left: TDate,
  right: TDate,
): number {
  return adapter.getYear(left) - adapter.getYear(right);
}

export function normalizeRangeOrder<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  range: Readonly<TngDateRange<TDate>>,
): TngDateRange<TDate> {
  if (range.start === null || range.end === null) {
    return range;
  }

  if (adapter.compare(range.start, range.end) <= 0) {
    return range;
  }

  return Object.freeze({
    end: range.start,
    start: range.end,
  });
}

export function sortAndUniqueDates<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  dates: readonly TDate[],
): readonly TDate[] {
  const sorted = [...dates].sort((left, right) => adapter.compare(left, right));
  const unique: TDate[] = [];
  for (const date of sorted) {
    const last = unique.length > 0 ? unique[unique.length - 1] : null;
    if (last !== null && adapter.compare(last, date) === 0) {
      continue;
    }
    unique.push(date);
  }
  return Object.freeze(unique);
}

export function isDateValueInMonth<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TDate,
  visibleMonth: TDate,
): boolean {
  return (
    adapter.getYear(value) === adapter.getYear(visibleMonth) &&
    adapter.getMonth(value) === adapter.getMonth(visibleMonth)
  );
}

export function clampDateToMonth<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  date: TDate,
  monthDate: TDate,
): TDate {
  const lastDate = adapter.getDate(adapter.endOfMonth(monthDate));
  return adapter.createDate(
    adapter.getYear(monthDate),
    adapter.getMonth(monthDate),
    Math.min(adapter.getDate(date), lastDate),
  );
}

export function moveDateSkippingDisabled<TDate>(
  options: Readonly<TngMoveDateOptions<TDate>>,
): TDate {
  const allowCrossView = options.allowCrossView ?? true;
  const maxIterations = 400;
  let next = options.adapter.addDays(options.start, options.delta);
  let remaining = maxIterations;
  while (remaining > 0 && options.isDisabled(next)) {
    const currentMonth = options.adapter.getMonth(options.start);
    const nextMonth = options.adapter.getMonth(next);
    if (!allowCrossView && currentMonth !== nextMonth) {
      return options.start;
    }
    next = options.adapter.addDays(next, options.delta);
    remaining -= 1;
  }

  return remaining === 0 ? options.start : next;
}

export function resolveWeekBoundaryDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  date: TDate,
  weekStartsOn: TngWeekdayIndex,
  boundary: TngWeekBoundary,
): TDate {
  const start = adapter.startOfWeek(date, weekStartsOn);
  return boundary === 'start' ? start : adapter.addDays(start, 6);
}

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
  if (value === null || Array.isArray(value)) {
    return false;
  }

  if ('start' in value && 'end' in value && value.start !== null && value.end !== null) {
    return adapter.compare(value.start, date) < 0 && adapter.compare(value.end, date) > 0;
  }

  return false;
}

export function hasSelectableDateInMonth<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  monthDate: TDate,
  isDisabled: (date: TDate) => boolean,
): boolean {
  const start = adapter.startOfMonth(monthDate);
  const totalDays = adapter.getDate(adapter.endOfMonth(monthDate));
  for (let day = 0; day < totalDays; day += 1) {
    const candidate = adapter.addDays(start, day);
    if (!isDisabled(candidate)) {
      return true;
    }
  }

  return false;
}

export function hasSelectableDateInYear<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  year: number,
  currentMonth: TDate,
  isDisabled: (date: TDate) => boolean,
): boolean {
  for (let month = 0; month < 12; month += 1) {
    const monthDate = adapter.createDate(year, month, 1);
    if (hasSelectableDateInMonth(adapter, monthDate, isDisabled)) {
      return true;
    }
  }

  return false;
}

export function findFirstEnabledDateInMonth<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  monthDate: TDate,
  isDisabled: (date: TDate) => boolean,
): TDate | null {
  const start = adapter.startOfMonth(monthDate);
  const totalDays = adapter.getDate(adapter.endOfMonth(monthDate));
  for (let day = 0; day < totalDays; day += 1) {
    const candidate = adapter.addDays(start, day);
    if (!isDisabled(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function buildMonthGrid<TDate>(
  options: Readonly<TngMonthGridOptions<TDate>>,
): readonly TngDateCell<TDate>[] {
  const firstOfMonth = options.adapter.startOfMonth(options.visibleMonth);
  const firstVisibleDate = options.adapter.startOfWeek(firstOfMonth, options.weekStartsOn);
  const daysInMonth = options.adapter.getDate(options.adapter.endOfMonth(options.visibleMonth));
  const leadingOffset = (options.adapter.getDay(firstOfMonth) - options.weekStartsOn + 7) % 7;
  const weekCount = options.fixedWeeks ? 6 : Math.ceil((leadingOffset + daysInMonth) / 7);
  const totalCells = weekCount * 7;
  const cells: TngDateCell<TDate>[] = [];

  for (let index = 0; index < totalCells; index += 1) {
    const date = options.adapter.addDays(firstVisibleDate, index);
    const inMonth = isDateValueInMonth(options.adapter, date, options.visibleMonth);
    const hidden = !inMonth && !options.showOutsideDays;
    const active = datesEqual(options.adapter, date, options.activeDate);
    const focusVisible =
      options.focusedDate !== null && datesEqual(options.adapter, date, options.focusedDate);
    const disabled = !inMonth || options.isDisabled(date);
    cells.push(
      Object.freeze({
        active,
        colIndex: index % 7,
        date,
        disabled,
        focusVisible,
        hidden,
        id: options.createCellId(date),
        inMonth,
        inRange: options.inRange(date),
        label: hidden ? '' : options.adapter.format(date, 'day-number', options.locale),
        previewRange: options.isPreviewRange(date),
        rangeEnd: options.isRangeEnd(date),
        rangeStart: options.isRangeStart(date),
        rowIndex: Math.floor(index / 7),
        selected: options.isSelected(date),
        tabindex: active && options.focusStrategy === 'roving' ? 0 : -1,
        today: datesEqual(options.adapter, date, options.today),
      }),
    );
  }

  return Object.freeze(cells);
}

export function buildMonthOptions<TDate>(
  options: Readonly<TngMonthOptionsConfig<TDate>>,
): readonly TngMonthOption<TDate>[] {
  const year = options.adapter.getYear(options.visibleMonth);
  const monthOptions: TngMonthOption<TDate>[] = [];
  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const date = options.adapter.createDate(year, monthIndex, 1);
    const active =
      options.focusedSection === 'month' &&
      options.adapter.getYear(options.activeDate) === year &&
      options.adapter.getMonth(options.activeDate) === monthIndex;
    const focusVisible =
      options.focusedSection === 'month' &&
      options.focusedDate !== null &&
      compareMonthIdentity(options.adapter, date, options.focusedDate) === 0;
    monthOptions.push(
      Object.freeze({
        active,
        date,
        disabled: options.disabledMonth(monthIndex),
        focusVisible,
        id: options.createId(monthIndex),
        index: monthIndex,
        label: options.adapter.format(date, 'month-short', options.locale),
        selected: options.selectedMonth(monthIndex),
        tabindex: active ? 0 : -1,
      }),
    );
  }

  return Object.freeze(monthOptions);
}

export function buildYearOptions<TDate>(
  options: Readonly<TngYearOptionsConfig<TDate>>,
): readonly TngYearOption<TDate>[] {
  const yearOptions: TngYearOption<TDate>[] = [];
  for (let offset = 0; offset < options.totalYears; offset += 1) {
    const year = options.startYear + offset;
    const date = options.adapter.createDate(
      year,
      options.adapter.getMonth(options.visibleMonth),
      1,
    );
    const active =
      options.focusedSection === 'year' && options.adapter.getYear(options.activeDate) === year;
    const focusVisible =
      options.focusedSection === 'year' &&
      options.focusedDate !== null &&
      compareYearIdentity(options.adapter, date, options.focusedDate) === 0;
    yearOptions.push(
      Object.freeze({
        active,
        date,
        disabled: options.disabledYear(year),
        focusVisible,
        id: options.createId(year),
        label: options.adapter.format(date, 'year-label', options.locale),
        selected: options.selectedYear(year),
        tabindex: active ? 0 : -1,
        year,
      }),
    );
  }

  return Object.freeze(yearOptions);
}

export function resolveInitialFocusedSection(view: TngCalendarView): TngCalendarView {
  return view;
}

export function resolveViewForEscape(currentView: TngCalendarView): TngCalendarView | null {
  return currentView === 'day' ? null : 'day';
}

export function includesView(views: readonly TngCalendarView[], view: TngCalendarView): boolean {
  return views.includes(view);
}
