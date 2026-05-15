import {
  coerceTngWeekStartsOn,
  defaultTngDateAdapter,
  normalizeTngDateInput,
} from '@tailng-ui/cdk';
import type { TngDateAdapter, TngDateInputValue, TngWeekdayIndex } from './datepicker.types';

export const defaultDatepickerDateAdapter: TngDateAdapter<Date> = defaultTngDateAdapter;

export function normalizeDateInput<TDate>(
  adapter: Readonly<TngDateAdapter<TDate>>,
  value: TngDateInputValue<TDate>,
  locale?: string,
): TDate | null {
  return normalizeTngDateInput(adapter, value, locale);
}

export function coerceWeekStartsOn(value: number): TngWeekdayIndex {
  return coerceTngWeekStartsOn(value);
}
