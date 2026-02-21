import { describe, expect, it } from 'vitest';
import { coerceTngTextareaNullableBoolean, normalizeTngTextareaRows } from './tng-textarea';

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
});
