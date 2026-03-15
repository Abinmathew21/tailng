import { describe, expect, it } from 'vitest';
import {
  coerceTngTextareaNullableBoolean,
  normalizeTngTextareaResize,
  normalizeTngTextareaRows,
} from '../tng-textarea';

describe('tng-textarea primitive helpers', () => {
  it('coerces nullable boolean values consistently', () => {
    expect(coerceTngTextareaNullableBoolean(undefined)).toBeNull();
    expect(coerceTngTextareaNullableBoolean('')).toBe(true);
    expect(coerceTngTextareaNullableBoolean('true')).toBe(true);
    expect(coerceTngTextareaNullableBoolean('false')).toBe(false);
    expect(coerceTngTextareaNullableBoolean('invalid')).toBeNull();
  });

  it('normalizes rows into a positive integer', () => {
    expect(normalizeTngTextareaRows(Number.NaN)).toBe(3);
    expect(normalizeTngTextareaRows(0)).toBe(1);
    expect(normalizeTngTextareaRows(1.9)).toBe(1);
    expect(normalizeTngTextareaRows(6)).toBe(6);
  });

  it('normalizes resize values to supported CSS modes', () => {
    expect(normalizeTngTextareaResize(undefined)).toBe('vertical');
    expect(normalizeTngTextareaResize('none')).toBe('none');
    expect(normalizeTngTextareaResize('horizontal')).toBe('horizontal');
    expect(normalizeTngTextareaResize('both')).toBe('both');
    expect(normalizeTngTextareaResize('VERTICAL')).toBe('vertical');
    expect(normalizeTngTextareaResize('invalid')).toBe('vertical');
  });
});
