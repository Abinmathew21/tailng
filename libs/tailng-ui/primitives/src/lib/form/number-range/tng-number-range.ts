import type { TngNumberRangeValue } from './tng-number-range.types';

/**
 * Parses a raw string from a number input into a finite number or null.
 * Empty / whitespace-only strings and non-finite results become null.
 */
export function parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Converts a nullable number to the string value expected by a native
 * `<input type="number">`. null becomes the empty string.
 */
export function toInputValue(value: number | null): string {
  return value === null ? '' : String(value);
}

/**
 * Normalizes an arbitrary external value (e.g. from CVA `writeValue`) into a
 * well-typed `TngNumberRangeValue`. null / undefined is converted to
 * `{ min: null, max: null }`. Object properties that are not finite numbers
 * are normalised to null.
 */
export function normalizeRangeValue(value: unknown): TngNumberRangeValue {
  if (value === null || value === undefined) {
    return { min: null, max: null };
  }

  if (typeof value !== 'object') {
    return { min: null, max: null };
  }

  const obj = value as Record<string, unknown>;

  const min = typeof obj['min'] === 'number' && Number.isFinite(obj['min']) ? obj['min'] : null;
  const max = typeof obj['max'] === 'number' && Number.isFinite(obj['max']) ? obj['max'] : null;

  return { min, max };
}

/**
 * Returns true when the range value satisfies all three validity conditions:
 *  1. min is within the configured lower bound (if set).
 *  2. max is within the configured upper bound (if set).
 *  3. min ≤ max (when both are non-null).
 */
export function isRangeValid(
  value: TngNumberRangeValue,
  minBound: number | null,
  maxBound: number | null,
): boolean {
  const minBoundValid =
    value.min === null || minBound === null || value.min >= minBound;

  const maxBoundValid =
    value.max === null || maxBound === null || value.max <= maxBound;

  const orderValid =
    value.min === null || value.max === null || value.min <= value.max;

  return minBoundValid && maxBoundValid && orderValid;
}
