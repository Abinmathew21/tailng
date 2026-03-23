import { normalizeDateInput } from './datepicker.adapters';
import {
  datesEqual,
  isDateInRange,
  isValueSelected,
  normalizeRangeOrder,
  sortAndUniqueDates,
} from './datepicker.utils';
import type {
  TngDateAdapter,
  TngDateInputValue,
  TngDateRange,
  TngDateRangeInput,
  TngDateSelectionInput,
  TngDateValue,
  TngDatepickerSelectionMode,
} from './datepicker.types';

function isRangeInput<TDate>(
  value: TngDateSelectionInput<TDate>,
): value is Readonly<TngDateRangeInput<TDate>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'start' in value && 'end' in value;
}

function isRangeValue<TDate>(value: TngDateValue<TDate>): value is TngDateRange<TDate> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'start' in value && 'end' in value;
}

export function normalizeSelectionInput<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  value: TngDateSelectionInput<TDate>,
  locale?: string,
): Readonly<{
  validationError: string | null;
  value: TngDateValue<TDate>;
}> {
  if (value === null || value === undefined) {
    return Object.freeze({ validationError: null, value: null });
  }

  if (selectionMode === 'range') {
    if (!isRangeInput(value)) {
      const singleDate = normalizeDateInput(adapter, value as TngDateInputValue<TDate>, locale);
      if (singleDate === null) {
        return Object.freeze({ validationError: 'invalid-value', value: null });
      }
      return Object.freeze({
        validationError: null,
        value: Object.freeze({ end: null, start: singleDate }),
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

  if (selectionMode === 'multiple') {
    const list = Array.isArray(value) ? value : [value];
    const normalized = list
      .map((item) => normalizeDateInput(adapter, item as TngDateInputValue<TDate>, locale))
      .filter((item): item is TDate => item !== null);
    if (normalized.length !== list.length) {
      return Object.freeze({
        validationError: 'invalid-value',
        value: Object.freeze(sortAndUniqueDates(adapter, normalized)),
      });
    }

    return Object.freeze({
      validationError: null,
      value: Object.freeze(sortAndUniqueDates(adapter, normalized)),
    });
  }

  const date = normalizeDateInput(adapter, value as TngDateInputValue<TDate>, locale);
  return Object.freeze({
    validationError: date === null ? 'invalid-value' : null,
    value: date,
  });
}

export function selectionValuesEqual<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  left: TngDateValue<TDate>,
  right: TngDateValue<TDate>,
): boolean {
  if (left === right) {
    return true;
  }

  if (left === null || right === null) {
    return left === right;
  }

  if (selectionMode === 'single') {
    return datesEqual(adapter, left as TDate, right as TDate);
  }

  if (selectionMode === 'multiple') {
    const leftDates = left as readonly TDate[];
    const rightDates = right as readonly TDate[];
    if (leftDates.length !== rightDates.length) {
      return false;
    }

    return leftDates.every((date, index) => datesEqual(adapter, date, rightDates[index] ?? null));
  }

  const leftRange = left as TngDateRange<TDate>;
  const rightRange = right as TngDateRange<TDate>;
  return (
    datesEqual(adapter, leftRange.start, rightRange.start) &&
    datesEqual(adapter, leftRange.end, rightRange.end)
  );
}

export function clearSelectionForMode<TDate>(
  selectionMode: TngDatepickerSelectionMode,
): TngDateValue<TDate> {
  if (selectionMode === 'range') {
    return Object.freeze({ end: null, start: null });
  }

  if (selectionMode === 'multiple') {
    return Object.freeze([]);
  }

  return null;
}

export function valueIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  return isValueSelected(adapter, selectionMode, value, date);
}

export function rangeIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  return isDateInRange(adapter, value, date);
}
