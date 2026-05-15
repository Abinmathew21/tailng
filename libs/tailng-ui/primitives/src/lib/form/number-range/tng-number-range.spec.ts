import { describe, expect, it } from 'vitest';

import {
  isRangeValid,
  normalizeRangeValue,
  parseNumberInput,
  toInputValue,
} from './tng-number-range';
import type {
  TngNumberRangeChangeEvent,
  TngNumberRangeSlots,
  TngNumberRangeSource,
  TngNumberRangeValue,
} from './tng-number-range.types';

// ─────────────────────────────────────────────────────────────────────────────
// parseNumberInput
// ─────────────────────────────────────────────────────────────────────────────

describe('parseNumberInput', () => {
  // ── Integer strings ───────────────────────────────────────────────────────

  it('should parse an integer string', () => {
    expect(parseNumberInput('42')).toBe(42);
  });

  it('should parse a negative integer string', () => {
    expect(parseNumberInput('-10')).toBe(-10);
  });

  it('should parse zero', () => {
    expect(parseNumberInput('0')).toBe(0);
  });

  it('should parse a large integer', () => {
    expect(parseNumberInput('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER);
  });

  // ── Decimal strings ───────────────────────────────────────────────────────

  it('should parse a decimal string', () => {
    expect(parseNumberInput('3.14')).toBe(3.14);
  });

  it('should parse a negative decimal string', () => {
    expect(parseNumberInput('-0.5')).toBe(-0.5);
  });

  it('should parse a very small decimal value', () => {
    expect(parseNumberInput('0.001')).toBeCloseTo(0.001);
  });

  it('should parse a decimal with leading zero', () => {
    expect(parseNumberInput('0.99')).toBeCloseTo(0.99);
  });

  // ── Empty / whitespace → null ─────────────────────────────────────────────

  it('should return null for an empty string', () => {
    expect(parseNumberInput('')).toBeNull();
  });

  it('should return null for a whitespace-only string', () => {
    expect(parseNumberInput('   ')).toBeNull();
  });

  it('should return null for a tab-only string', () => {
    expect(parseNumberInput('\t')).toBeNull();
  });

  it('should return null for a newline-only string', () => {
    expect(parseNumberInput('\n')).toBeNull();
  });

  // ── Non-finite / non-numeric → null ──────────────────────────────────────

  it('should return null for a non-numeric string', () => {
    expect(parseNumberInput('abc')).toBeNull();
  });

  it('should return null for a mixed alphanumeric string', () => {
    expect(parseNumberInput('12px')).toBeNull();
  });

  it('should not return NaN for an invalid min input', () => {
    const result = parseNumberInput('not-a-number');
    expect(result).toBeNull();
    expect(Number.isNaN(result)).toBe(false);
  });

  it('should not return NaN for an invalid max input', () => {
    const result = parseNumberInput('xyz');
    expect(result).toBeNull();
    expect(Number.isNaN(result)).toBe(false);
  });

  it('should not return Infinity for min input', () => {
    expect(parseNumberInput('Infinity')).toBeNull();
  });

  it('should not return Infinity for max input', () => {
    expect(parseNumberInput('+Infinity')).toBeNull();
  });

  it('should not return -Infinity for min input', () => {
    expect(parseNumberInput('-Infinity')).toBeNull();
  });

  it('should not return -Infinity for max input', () => {
    expect(parseNumberInput('-Infinity')).toBeNull();
  });

  it('should return null for the string "NaN"', () => {
    expect(parseNumberInput('NaN')).toBeNull();
  });

  // ── Edge numbers ──────────────────────────────────────────────────────────

  it('should parse negative zero as 0', () => {
    // Number('-0') === 0, and isFinite(0) === true
    const result = parseNumberInput('-0');
    expect(result).toBe(0);
  });

  it('should parse scientific notation', () => {
    expect(parseNumberInput('1e3')).toBe(1000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// toInputValue
// ─────────────────────────────────────────────────────────────────────────────

describe('toInputValue', () => {
  it('should convert null to empty string', () => {
    expect(toInputValue(null)).toBe('');
  });

  it('should convert an integer to its string representation', () => {
    expect(toInputValue(42)).toBe('42');
  });

  it('should convert a decimal number', () => {
    expect(toInputValue(3.14)).toBe('3.14');
  });

  it('should convert a negative number', () => {
    expect(toInputValue(-10)).toBe('-10');
  });

  it('should convert zero', () => {
    expect(toInputValue(0)).toBe('0');
  });

  it('should convert a negative decimal', () => {
    expect(toInputValue(-0.5)).toBe('-0.5');
  });

  it('should convert a large integer', () => {
    expect(toInputValue(Number.MAX_SAFE_INTEGER)).toBe('9007199254740991');
  });

  it('should convert a very small decimal value', () => {
    expect(toInputValue(0.001)).toBe('0.001');
  });

  it('should produce a string that round-trips through parseNumberInput', () => {
    const values = [0, 1, -1, 3.14, -0.5, 1000, Number.MAX_SAFE_INTEGER];
    for (const v of values) {
      expect(parseNumberInput(toInputValue(v))).toBe(v);
    }
  });

  it('should produce an empty string that round-trips through parseNumberInput as null', () => {
    expect(parseNumberInput(toInputValue(null))).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// normalizeRangeValue
// ─────────────────────────────────────────────────────────────────────────────

describe('normalizeRangeValue', () => {
  // ── null / undefined ──────────────────────────────────────────────────────

  it('should normalize null to { min: null, max: null }', () => {
    expect(normalizeRangeValue(null)).toEqual({ min: null, max: null });
  });

  it('should normalize undefined to { min: null, max: null }', () => {
    expect(normalizeRangeValue(undefined)).toEqual({ min: null, max: null });
  });

  it('should not throw when controlled value is null', () => {
    expect(() => normalizeRangeValue(null)).not.toThrow();
  });

  it('should not throw when default value is null', () => {
    expect(() => normalizeRangeValue(undefined)).not.toThrow();
  });

  // ── Non-object inputs ─────────────────────────────────────────────────────

  it('should normalize a string value to { min: null, max: null }', () => {
    expect(normalizeRangeValue('100-200')).toEqual({ min: null, max: null });
  });

  it('should normalize a number value to { min: null, max: null }', () => {
    expect(normalizeRangeValue(42)).toEqual({ min: null, max: null });
  });

  it('should normalize an array to { min: null, max: null }', () => {
    expect(normalizeRangeValue([10, 100])).toEqual({ min: null, max: null });
  });

  // ── Valid objects ─────────────────────────────────────────────────────────

  it('should preserve valid min and max', () => {
    expect(normalizeRangeValue({ min: 10, max: 100 })).toEqual({ min: 10, max: 100 });
  });

  it('should preserve zero min and max', () => {
    expect(normalizeRangeValue({ min: 0, max: 0 })).toEqual({ min: 0, max: 0 });
  });

  it('should preserve negative min and max', () => {
    expect(normalizeRangeValue({ min: -100, max: -10 })).toEqual({ min: -100, max: -10 });
  });

  it('should preserve decimal values', () => {
    expect(normalizeRangeValue({ min: 1.5, max: 9.9 })).toEqual({ min: 1.5, max: 9.9 });
  });

  it('should preserve null min when provided', () => {
    expect(normalizeRangeValue({ min: null, max: 100 })).toEqual({ min: null, max: 100 });
  });

  it('should preserve null max when provided', () => {
    expect(normalizeRangeValue({ min: 10, max: null })).toEqual({ min: 10, max: null });
  });

  it('should preserve { min: null, max: null }', () => {
    expect(normalizeRangeValue({ min: null, max: null })).toEqual({ min: null, max: null });
  });

  // ── Missing properties → null ─────────────────────────────────────────────

  it('should handle value object with undefined min by normalizing to null', () => {
    expect(normalizeRangeValue({ max: 100 })).toEqual({ min: null, max: 100 });
  });

  it('should handle value object with undefined max by normalizing to null', () => {
    expect(normalizeRangeValue({ min: 10 })).toEqual({ min: 10, max: null });
  });

  it('should normalize missing min to null', () => {
    const result = normalizeRangeValue({ max: 50 } as Partial<TngNumberRangeValue>);
    expect(result.min).toBeNull();
  });

  it('should normalize missing max to null', () => {
    const result = normalizeRangeValue({ min: 5 } as Partial<TngNumberRangeValue>);
    expect(result.max).toBeNull();
  });

  // ── Non-finite values → null ──────────────────────────────────────────────

  it('should normalize NaN min to null', () => {
    expect(normalizeRangeValue({ min: NaN, max: 100 })).toEqual({ min: null, max: 100 });
  });

  it('should normalize NaN max to null', () => {
    expect(normalizeRangeValue({ min: 10, max: NaN })).toEqual({ min: 10, max: null });
  });

  it('should normalize Infinity min to null', () => {
    expect(normalizeRangeValue({ min: Infinity, max: 100 })).toEqual({ min: null, max: 100 });
  });

  it('should normalize -Infinity min to null', () => {
    expect(normalizeRangeValue({ min: -Infinity, max: 100 })).toEqual({ min: null, max: 100 });
  });

  it('should normalize Infinity max to null', () => {
    expect(normalizeRangeValue({ min: 10, max: Infinity })).toEqual({ min: 10, max: null });
  });

  // ── Non-numeric string properties → null ─────────────────────────────────

  it('should normalize a string min to null', () => {
    expect(normalizeRangeValue({ min: 'abc' as unknown as number, max: 100 })).toEqual({
      min: null,
      max: 100,
    });
  });

  it('should normalize a string max to null', () => {
    expect(normalizeRangeValue({ min: 10, max: 'xyz' as unknown as number })).toEqual({
      min: 10,
      max: null,
    });
  });

  it('should not mutate the input object', () => {
    const input = { min: 10, max: 100 };
    normalizeRangeValue(input);
    expect(input).toEqual({ min: 10, max: 100 });
  });

  it('should always return a fresh object', () => {
    const input = { min: 10, max: 100 };
    expect(normalizeRangeValue(input)).not.toBe(input);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isRangeValid
// ─────────────────────────────────────────────────────────────────────────────

describe('isRangeValid', () => {
  // ── Range order ───────────────────────────────────────────────────────────

  it('should be valid when both values are null', () => {
    expect(isRangeValid({ min: null, max: null }, null, null)).toBe(true);
  });

  it('should be valid when only min is set', () => {
    expect(isRangeValid({ min: 10, max: null }, null, null)).toBe(true);
  });

  it('should be valid when only max is set', () => {
    expect(isRangeValid({ min: null, max: 100 }, null, null)).toBe(true);
  });

  it('should be valid when min is less than max', () => {
    expect(isRangeValid({ min: 10, max: 100 }, null, null)).toBe(true);
  });

  it('should be valid when min equals max', () => {
    expect(isRangeValid({ min: 50, max: 50 }, null, null)).toBe(true);
  });

  it('should be invalid when min is greater than max', () => {
    expect(isRangeValid({ min: 100, max: 10 }, null, null)).toBe(false);
  });

  it('should become valid again when min is corrected below max', () => {
    expect(isRangeValid({ min: 100, max: 10 }, null, null)).toBe(false);
    expect(isRangeValid({ min: 5, max: 10 }, null, null)).toBe(true);
  });

  it('should become valid when min is cleared from an invalid range', () => {
    expect(isRangeValid({ min: null, max: 10 }, null, null)).toBe(true);
  });

  it('should become valid when max is cleared from an invalid range', () => {
    expect(isRangeValid({ min: 100, max: null }, null, null)).toBe(true);
  });

  // ── Configured lower boundary ─────────────────────────────────────────────

  it('should be valid when min value equals configured lower boundary', () => {
    expect(isRangeValid({ min: 0, max: null }, 0, null)).toBe(true);
  });

  it('should be valid when min value is greater than configured lower boundary', () => {
    expect(isRangeValid({ min: 5, max: null }, 0, null)).toBe(true);
  });

  it('should be invalid when min value is less than configured lower boundary', () => {
    expect(isRangeValid({ min: -1, max: null }, 0, null)).toBe(false);
  });

  it('should allow null min even when lower boundary is configured', () => {
    expect(isRangeValid({ min: null, max: null }, 0, null)).toBe(true);
  });

  it('should become valid when out-of-bound min is corrected', () => {
    expect(isRangeValid({ min: -5, max: null }, 0, null)).toBe(false);
    expect(isRangeValid({ min: 1, max: null }, 0, null)).toBe(true);
  });

  it('should support negative configured lower boundary', () => {
    expect(isRangeValid({ min: -200, max: null }, -200, null)).toBe(true);
    expect(isRangeValid({ min: -201, max: null }, -200, null)).toBe(false);
  });

  it('should support decimal configured lower boundary', () => {
    expect(isRangeValid({ min: 0.5, max: null }, 0.5, null)).toBe(true);
    expect(isRangeValid({ min: 0.4, max: null }, 0.5, null)).toBe(false);
  });

  // ── Configured upper boundary ─────────────────────────────────────────────

  it('should be valid when max value equals configured upper boundary', () => {
    expect(isRangeValid({ min: null, max: 100 }, null, 100)).toBe(true);
  });

  it('should be valid when max value is less than configured upper boundary', () => {
    expect(isRangeValid({ min: null, max: 90 }, null, 100)).toBe(true);
  });

  it('should be invalid when max value is greater than configured upper boundary', () => {
    expect(isRangeValid({ min: null, max: 110 }, null, 100)).toBe(false);
  });

  it('should allow null max even when upper boundary is configured', () => {
    expect(isRangeValid({ min: null, max: null }, null, 100)).toBe(true);
  });

  it('should become valid when out-of-bound max is corrected', () => {
    expect(isRangeValid({ min: null, max: 200 }, null, 100)).toBe(false);
    expect(isRangeValid({ min: null, max: 50 }, null, 100)).toBe(true);
  });

  it('should support negative configured upper boundary', () => {
    expect(isRangeValid({ min: null, max: -10 }, null, -10)).toBe(true);
    expect(isRangeValid({ min: null, max: -9 }, null, -10)).toBe(false);
  });

  it('should support decimal configured upper boundary', () => {
    expect(isRangeValid({ min: null, max: 99.9 }, null, 100)).toBe(true);
    expect(isRangeValid({ min: null, max: 100.1 }, null, 100)).toBe(false);
  });

  // ── Both boundaries ───────────────────────────────────────────────────────

  it('should be valid when both values are within both boundaries', () => {
    expect(isRangeValid({ min: 10, max: 90 }, 0, 100)).toBe(true);
  });

  it('should be invalid when min violates lower and order is also invalid', () => {
    expect(isRangeValid({ min: -1, max: 50 }, 0, 100)).toBe(false);
  });

  it('should be invalid when max violates upper and order is also invalid', () => {
    expect(isRangeValid({ min: 10, max: 200 }, 0, 100)).toBe(false);
  });

  // ── Specific range scenarios ──────────────────────────────────────────────

  it('should handle negative ranges correctly (both negative, valid order)', () => {
    expect(isRangeValid({ min: -100, max: -10 }, -200, 0)).toBe(true);
  });

  it('should be invalid for negative range with wrong order', () => {
    expect(isRangeValid({ min: -10, max: -100 }, null, null)).toBe(false);
  });

  it('should handle min and max both set to zero', () => {
    expect(isRangeValid({ min: 0, max: 0 }, null, null)).toBe(true);
  });

  it('should handle very large values', () => {
    expect(
      isRangeValid(
        { min: Number.MAX_SAFE_INTEGER - 1, max: Number.MAX_SAFE_INTEGER },
        null,
        null,
      ),
    ).toBe(true);
  });

  it('should recalculate correctly when boundaries change (lower tightens)', () => {
    // min=5 was valid with bound=0, invalid with bound=10
    expect(isRangeValid({ min: 5, max: null }, 0, null)).toBe(true);
    expect(isRangeValid({ min: 5, max: null }, 10, null)).toBe(false);
  });

  it('should recalculate correctly when boundaries change (upper tightens)', () => {
    // max=80 was valid with bound=100, invalid with bound=50
    expect(isRangeValid({ min: null, max: 80 }, null, 100)).toBe(true);
    expect(isRangeValid({ min: null, max: 80 }, null, 50)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Type exports
// ─────────────────────────────────────────────────────────────────────────────

describe('tng-number-range type exports', () => {
  it('should expose TngNumberRangeValue type (structural check)', () => {
    const value: TngNumberRangeValue = { min: null, max: null };
    expect(value).toBeDefined();
  });

  it('should allow partial TngNumberRangeValue with only min', () => {
    const value: TngNumberRangeValue = { min: 10, max: null };
    expect(value.min).toBe(10);
    expect(value.max).toBeNull();
  });

  it('should allow partial TngNumberRangeValue with only max', () => {
    const value: TngNumberRangeValue = { min: null, max: 100 };
    expect(value.min).toBeNull();
    expect(value.max).toBe(100);
  });

  it('should expose TngNumberRangeSource type as union of min | max', () => {
    const sources: TngNumberRangeSource[] = ['min', 'max'];
    expect(sources).toHaveLength(2);
  });

  it('should expose TngNumberRangeChangeEvent type (structural check)', () => {
    const event: TngNumberRangeChangeEvent = {
      value: { min: 10, max: 100 },
      source: 'min',
      valid: true,
    };
    expect(event.source).toBe('min');
    expect(event.valid).toBe(true);
  });

  it('should expose TngNumberRangeSlots type covering all five slot names', () => {
    const slots: TngNumberRangeSlots[] = ['root', 'group', 'minInput', 'separator', 'maxInput'];
    expect(slots).toHaveLength(5);
  });

  it('should export parseNumberInput as a callable function', () => {
    expect(typeof parseNumberInput).toBe('function');
  });

  it('should export toInputValue as a callable function', () => {
    expect(typeof toInputValue).toBe('function');
  });

  it('should export normalizeRangeValue as a callable function', () => {
    expect(typeof normalizeRangeValue).toBe('function');
  });

  it('should export isRangeValid as a callable function', () => {
    expect(typeof isRangeValid).toBe('function');
  });

  it('should avoid exposing any as a return type (parseNumberInput returns number | null)', () => {
    const result = parseNumberInput('42');
    // TypeScript would error if result were `any`; runtime check confirms it is a number
    expect(typeof result).toBe('number');
  });

  it('should avoid exposing any as a return type (normalizeRangeValue returns TngNumberRangeValue)', () => {
    const result = normalizeRangeValue(null);
    expect(Object.keys(result).sort()).toEqual(['max', 'min']);
  });
});
