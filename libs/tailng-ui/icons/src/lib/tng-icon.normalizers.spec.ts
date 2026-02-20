import { describe, expect, it } from 'vitest';
import {
  normalizeIconRef,
  normalizeOptionalString,
} from './tng-icon.normalizers';

describe('normalizeOptionalString', () => {
  it('returns null for undefined, null, and whitespace-only values', () => {
    expect(normalizeOptionalString(undefined)).toBeNull();
    expect(normalizeOptionalString(null)).toBeNull();
    expect(normalizeOptionalString('   ')).toBeNull();
  });

  it('trims and returns meaningful values', () => {
    expect(normalizeOptionalString(' bell ')).toBe('bell');
  });
});

describe('normalizeIconRef', () => {
  it('returns null for empty icon refs', () => {
    expect(normalizeIconRef('')).toBeNull();
    expect(normalizeIconRef('   ')).toBeNull();
  });

  it('trims icon refs', () => {
    expect(normalizeIconRef(' lucide:bell ')).toBe('lucide:bell');
  });
});
