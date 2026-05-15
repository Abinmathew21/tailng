import { normalizeDateInput } from './date-range-picker.adapters';
import { datesEqual, isDateInRange, normalizeRangeOrder } from './date-range-picker.utils';
import type {
  TngDateAdapter,
  TngDateInputValue,
  TngDateRange,
  TngDateRangeInput,
  TngDateSelectionInput,
  TngDateValue,
  TngDateRangePickerSelectionMode,
} from './date-range-picker.types';

function isRangeInput<TDate>(
  value: TngDateSelectionInput<TDate>,
): value is Readonly<TngDateRangeInput<TDate>> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'start' in value &&
    'end' in value
  );
}

export function normalizeSelectionInput<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: TngDateRangePickerSelectionMode,
  value: TngDateSelectionInput<TDate>,
  locale?: string,
): Readonly<{
  validationError: string | null;
  value: TngDateValue<TDate>;
}> {
  if (value === null || value === undefined) {
    return Object.freeze({ validationError: null, value: null });
  }

  if (!isRangeInput(value)) {
    const startDate = normalizeDateInput(adapter, value as TngDateInputValue<TDate>, locale);
    if (startDate === null) {
      return Object.freeze({ validationError: 'invalid-value', value: null });
    }
    return Object.freeze({
      validationError: null,
      value: Object.freeze({ end: null, start: startDate }),
    });
  }

  const start = normalizeDateInput(adapter, value.start, locale);
  const end = normalizeDateInput(adapter, value.end, locale);
  if (value.start !== null && value.start !== undefined && start === null) {
    return Object.freeze({ validationError: 'invalid-value', value: null });
  }
  if (value.end !== null && value.end !== undefined && end === null) {
    return Object.freeze({ validationError: 'invalid-value', value: null });
  }

  return Object.freeze({
    validationError: null,
    value: normalizeRangeOrder(adapter, Object.freeze({ end, start })),
  });
}

export function selectionValuesEqual<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: TngDateRangePickerSelectionMode,
  left: TngDateValue<TDate>,
  right: TngDateValue<TDate>,
): boolean {
  if (left === right) {
    return true;
  }

  if (left === null || right === null) {
    return left === right;
  }

  const leftRange = left as TngDateRange<TDate>;
  const rightRange = right as TngDateRange<TDate>;
  return (
    datesEqual(adapter, leftRange.start, rightRange.start) &&
    datesEqual(adapter, leftRange.end, rightRange.end)
  );
}

export function clearSelectionForMode<TDate>(
  _selectionMode: TngDateRangePickerSelectionMode,
): TngDateValue<TDate> {
  return Object.freeze({ end: null, start: null });
}

export function valueIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: TngDateRangePickerSelectionMode,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  if (value === null || !isRangeInput(value)) {
    return false;
  }

  return datesEqual(adapter, value.start, date) || datesEqual(adapter, value.end, date);
}

export function rangeIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  return isDateInRange(adapter, value, date);
}
