export type TngCalendarView = 'day' | 'month' | 'year';
export type TngDateSelectionMode = 'multiple' | 'range' | 'single';
export type TngDateFormatToken =
  | 'input'
  | 'label'
  | 'month-year'
  | 'month-long'
  | 'month-short'
  | 'weekday-short'
  | 'weekday-narrow'
  | 'day-number'
  | 'year-label';
export type TngWeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TngDateInputValue<TDate> = Date | TDate | string | null | undefined;

export type TngDateRange<TDate> = Readonly<{
  end: TDate | null;
  start: TDate | null;
}>;

export type TngDateRangeInput<TDate> = Readonly<{
  end: TngDateInputValue<TDate>;
  start: TngDateInputValue<TDate>;
}>;

export type TngDateValue<TDate> = TDate | TngDateRange<TDate> | readonly TDate[] | null;
export type TngDateSelectionInput<TDate> =
  | TngDateInputValue<TDate>
  | TngDateRangeInput<TDate>
  | readonly TngDateInputValue<TDate>[];

export type TngDateAdapter<TDate> = Readonly<{
  addDays: (date: TDate, amount: number) => TDate;
  addMonths: (date: TDate, amount: number) => TDate;
  addYears: (date: TDate, amount: number) => TDate;
  compare: (left: TDate, right: TDate) => -1 | 0 | 1;
  createDate: (year: number, month: number, day: number) => TDate;
  deserialize?: (value: unknown, locale?: string) => TDate | null;
  endOfMonth: (date: TDate) => TDate;
  format: (date: TDate, format: string, locale?: string) => string;
  getDate: (date: TDate) => number;
  getDay: (date: TDate) => number;
  getMonth: (date: TDate) => number;
  getYear: (date: TDate) => number;
  isValid: (date: TDate) => boolean;
  parse: (text: string, locale?: string) => TDate | null;
  startOfMonth: (date: TDate) => TDate;
  startOfWeek: (date: TDate, weekStartsOn: TngWeekdayIndex) => TDate;
  today: () => TDate;
}>;

export type TngDateCell<TDate> = Readonly<{
  active: boolean;
  colIndex: number;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  hidden: boolean;
  id: string;
  inMonth: boolean;
  inRange: boolean;
  label: string;
  rangeEnd: boolean;
  rangeStart: boolean;
  rowIndex: number;
  selected: boolean;
  tabindex: -1 | 0;
  today: boolean;
}>;

export type TngMonthOption<TDate> = Readonly<{
  active: boolean;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  id: string;
  index: number;
  label: string;
  selected: boolean;
  tabindex: -1 | 0;
}>;

export type TngYearOption<TDate> = Readonly<{
  active: boolean;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  id: string;
  label: string;
  selected: boolean;
  tabindex: -1 | 0;
  year: number;
}>;

export type TngMonthGridCellContext<TDate> = Readonly<{
  date: TDate;
  hidden: boolean;
  inMonth: boolean;
  index: number;
}>;

export type TngMonthGridOptions<TDate, TExtraCellState extends object = object> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createCellId: (date: TDate) => string;
  fixedWeeks: boolean;
  focusStrategy: 'active-descendant' | 'roving';
  focusedDate: TDate | null;
  getCellState?: (context: TngMonthGridCellContext<TDate>) => TExtraCellState;
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

export type TngMonthOptionsConfig<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createId: (month: number) => string;
  disabledMonth: (month: number) => boolean;
  focusedDate: TDate | null;
  focusedSection: TngCalendarView;
  locale?: string;
  selectedMonth: (month: number) => boolean;
  visibleMonth: TDate;
}>;

export type TngYearOptionsConfig<TDate> = Readonly<{
  activeDate: TDate;
  adapter: Readonly<TngDateAdapter<TDate>>;
  createId: (year: number) => string;
  disabledYear: (year: number) => boolean;
  focusedDate: TDate | null;
  focusedSection: TngCalendarView;
  locale?: string;
  selectedYear: (year: number) => boolean;
  startYear: number;
  totalYears: number;
  visibleMonth: TDate;
}>;

export type TngMoveDateOptions<TDate> = Readonly<{
  adapter: Readonly<TngDateAdapter<TDate>>;
  allowCrossView?: boolean;
  delta: number;
  isDisabled: (date: TDate) => boolean;
  start: TDate;
}>;

export type TngWeekBoundary = 'end' | 'start';

export type TngDateSelectionNormalization<TDate> = Readonly<{
  validationError: string | null;
  value: TngDateValue<TDate>;
}>;
