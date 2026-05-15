import type {
  TngDateAdapter,
  TngDateFormatToken,
  TngDateInputValue,
  TngWeekdayIndex,
} from './date-range-picker.types';

function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function normalizeDateInstance(date: Date): Date {
  return createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function toComparableNumber(date: Date): number {
  return Number(
    `${date.getFullYear().toString().padStart(4, '0')}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`,
  );
}

function parseIsoDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (match === null) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = createLocalDate(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

function parseMonthDayYearDateOnly(value: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (match === null) {
    return null;
  }

  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = createLocalDate(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

function createFormatter(
  locale: string | undefined,
  options: Readonly<Intl.DateTimeFormatOptions>,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale ?? 'en-US', options);
}

function resolveDateFormatter(
  date: Date,
  format: TngDateFormatToken | string,
  locale?: string,
): string {
  if (format === 'input') {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${month}-${day}-${year}`;
  }

  if (format === 'month-year') {
    return createFormatter(locale, {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  if (format === 'month-long') {
    return createFormatter(locale, { month: 'long' }).format(date);
  }

  if (format === 'month-short') {
    return createFormatter(locale, { month: 'short' }).format(date);
  }

  if (format === 'weekday-short') {
    return createFormatter(locale, { weekday: 'short' }).format(date);
  }

  if (format === 'weekday-narrow') {
    return createFormatter(locale, { weekday: 'narrow' }).format(date);
  }

  if (format === 'day-number') {
    return createFormatter(locale, { day: 'numeric' }).format(date);
  }

  if (format === 'year-label') {
    return createFormatter(locale, { year: 'numeric' }).format(date);
  }

  if (format === 'label') {
    return createFormatter(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  return createFormatter(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export const defaultDateRangePickerDateAdapter: TngDateAdapter<Date> = Object.freeze({
  addDays: (date, amount) => {
    const next = createLocalDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);
    return next;
  },
  addMonths: (date, amount) => {
    const targetMonth = date.getMonth() + amount;
    const result = createLocalDate(date.getFullYear(), targetMonth, 1);
    const lastDay = createLocalDate(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    return createLocalDate(
      result.getFullYear(),
      result.getMonth(),
      Math.min(date.getDate(), lastDay),
    );
  },
  addYears: (date, amount) => {
    const result = createLocalDate(date.getFullYear() + amount, date.getMonth(), 1);
    const lastDay = createLocalDate(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    return createLocalDate(
      result.getFullYear(),
      result.getMonth(),
      Math.min(date.getDate(), lastDay),
    );
  },
  compare: (left, right) => {
    const leftValue = toComparableNumber(left);
    const rightValue = toComparableNumber(right);
    if (leftValue < rightValue) return -1;
    if (leftValue > rightValue) return 1;
    return 0;
  },
  createDate: (year, month, day) => createLocalDate(year, month, day),
  deserialize: (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : normalizeDateInstance(value);
    }

    if (typeof value === 'string') {
      const monthDayYearDate = parseMonthDayYearDateOnly(value);
      if (monthDayYearDate !== null) {
        return monthDayYearDate;
      }

      const isoDate = parseIsoDateOnly(value);
      if (isoDate !== null) {
        return isoDate;
      }

      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : normalizeDateInstance(parsed);
    }

    return null;
  },
  endOfMonth: (date) => createLocalDate(date.getFullYear(), date.getMonth() + 1, 0),
  format: (date, format, locale) => resolveDateFormatter(date, format, locale),
  getDate: (date) => date.getDate(),
  getDay: (date) => date.getDay(),
  getMonth: (date) => date.getMonth(),
  getYear: (date) => date.getFullYear(),
  isValid: (date) => Number.isFinite(date.getTime()),
  parse: (text, locale) => {
    const monthDayYearDate = parseMonthDayYearDateOnly(text);
    if (monthDayYearDate !== null) {
      return monthDayYearDate;
    }

    const isoDate = parseIsoDateOnly(text);
    if (isoDate !== null) {
      return isoDate;
    }

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const formatted = resolveDateFormatter(parsed, 'label', locale);
    if (formatted.trim().length === 0) {
      return null;
    }

    return normalizeDateInstance(parsed);
  },
  startOfMonth: (date) => createLocalDate(date.getFullYear(), date.getMonth(), 1),
  startOfWeek: (date, weekStartsOn) => {
    const diff = (date.getDay() - weekStartsOn + 7) % 7;
    return createLocalDate(date.getFullYear(), date.getMonth(), date.getDate() - diff);
  },
  today: () => normalizeDateInstance(new Date()),
});

export function normalizeDateInput<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TngDateInputValue<TDate>,
  locale?: string,
): TDate | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (adapter.deserialize !== undefined) {
    const normalized = adapter.deserialize(value, locale);
    if (normalized !== null && adapter.isValid(normalized)) {
      return normalized;
    }
  }

  if (typeof value === 'string') {
    const parsed = adapter.parse(value, locale);
    return parsed !== null && adapter.isValid(parsed) ? parsed : null;
  }

  if (value instanceof Date && adapter.isValid(value as TDate)) {
    return value as TDate;
  }

  if (adapter.isValid(value as TDate)) {
    return value as TDate;
  }

  return null;
}

export function coerceWeekStartsOn(value: number): TngWeekdayIndex {
  const normalized = Number.isFinite(value) ? Math.trunc(value) : 0;
  const wrapped = ((normalized % 7) + 7) % 7;
  return wrapped as TngWeekdayIndex;
}
