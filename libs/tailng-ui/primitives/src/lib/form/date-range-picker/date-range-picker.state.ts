/* eslint-disable max-params -- Date range picker state helpers keep the established positional API. */
import {
  clearDateSelectionForMode,
  dateSelectionValuesEqual,
  datesEqual,
  normalizeDateSelectionInput,
} from '@tailng-ui/cdk';
import type {
  TngDateAdapter,
  TngDateRange,
  TngDateSelectionInput,
  TngDateValue,
  TngDateRangePickerSelectionMode,
} from './date-range-picker.types';
import { isDateInRange } from './date-range-picker.utils';

function isRangeValue<TDate>(value: TngDateValue<TDate>): value is TngDateRange<TDate> {
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
  const normalized = normalizeDateSelectionInput({
    adapter,
    locale,
    selectionMode: 'range',
    value,
  });
  return normalized as Readonly<{
    validationError: string | null;
    value: TngDateValue<TDate>;
  }>;
}

export function selectionValuesEqual<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: TngDateRangePickerSelectionMode,
  left: TngDateValue<TDate>,
  right: TngDateValue<TDate>,
): boolean {
  return dateSelectionValuesEqual({ adapter, left, right, selectionMode: 'range' });
}

export function clearSelectionForMode<TDate>(
  _selectionMode: TngDateRangePickerSelectionMode,
): TngDateValue<TDate> {
  return clearDateSelectionForMode('range') as TngDateValue<TDate>;
}

export function valueIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  _selectionMode: TngDateRangePickerSelectionMode,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  if (!isRangeValue(value)) {
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
