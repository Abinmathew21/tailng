/* eslint-disable max-params -- Datepicker state helpers keep the established positional API. */
import {
  clearDateSelectionForMode,
  dateSelectionValuesEqual,
  isDateInRange,
  isValueSelected,
  normalizeDateSelectionInput,
} from '@tailng-ui/cdk';
import type {
  TngDateAdapter,
  TngDateSelectionInput,
  TngDateValue,
  TngDatepickerSelectionMode,
} from './datepicker.types';

export function normalizeSelectionInput<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  value: TngDateSelectionInput<TDate>,
  locale?: string,
): Readonly<{
  validationError: string | null;
  value: TngDateValue<TDate>;
}> {
  return normalizeDateSelectionInput({ adapter, locale, selectionMode, value });
}

export function selectionValuesEqual<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  left: TngDateValue<TDate>,
  right: TngDateValue<TDate>,
): boolean {
  return dateSelectionValuesEqual({ adapter, left, right, selectionMode });
}

export function clearSelectionForMode<TDate>(
  selectionMode: TngDatepickerSelectionMode,
): TngDateValue<TDate> {
  return clearDateSelectionForMode(selectionMode);
}

export function valueIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  selectionMode: TngDatepickerSelectionMode,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  return isValueSelected({ adapter, date, selectionMode, value });
}

export function rangeIncludesDate<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TngDateValue<TDate>,
  date: TDate,
): boolean {
  return isDateInRange({ adapter, date, value });
}
