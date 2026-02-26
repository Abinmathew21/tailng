import { describe, expect, it } from 'vitest';
import {
  arraysEqual,
  normalizeToArray,
  normalizeToSingle,
} from '../combobox.commit';

describe('combobox.commit (normalize + equality)', () => {
  describe('normalizeToArray', () => {
    it('returns null for null', () => {
      expect(normalizeToArray(null)).toBeNull();
    });

    it('returns array as-is for array input', () => {
      const arr = ['a', 'b'];
      expect(normalizeToArray(arr)).toBe(arr);
    });

    it('wraps single value in array', () => {
      expect(normalizeToArray('x')).toEqual(['x']);
    });
  });

  describe('normalizeToSingle', () => {
    it('returns null for null', () => {
      expect(normalizeToSingle(null)).toBeNull();
    });

    it('returns first element for array input', () => {
      expect(normalizeToSingle(['a', 'b'])).toBe('a');
    });

    it('returns null for empty array', () => {
      expect(normalizeToSingle([])).toBeNull();
    });

    it('returns value as-is for single value', () => {
      expect(normalizeToSingle('x')).toBe('x');
    });
  });

  describe('arraysEqual', () => {
    it('returns true when both null', () => {
      expect(arraysEqual(null, null)).toBe(true);
    });

    it('returns false when one null', () => {
      expect(arraysEqual(null, [])).toBe(false);
      expect(arraysEqual([], null)).toBe(false);
    });

    it('returns false when lengths differ', () => {
      expect(arraysEqual(['a'], ['a', 'b'])).toBe(false);
    });

    it('returns true when same refs same order', () => {
      const arr = ['a', 'b'];
      expect(arraysEqual(arr, arr)).toBe(true);
    });

    it('returns true when equal by Object.is', () => {
      expect(arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('returns false when order differs', () => {
      expect(arraysEqual(['a', 'b'], ['b', 'a'])).toBe(false);
    });

    it('returns false when values differ', () => {
      expect(arraysEqual(['a', 'b'], ['a', 'c'])).toBe(false);
    });
  });
});
