import { describe, expect, it } from 'vitest';
import { collapseKey, expandKey, toggleExpandedKey } from '../tree-table-expansion';

describe('tree-table expansion primitives', () => {
  describe('expandKey', () => {
    it('should expand a collapsed key', () => {
      const next = expandKey(new Set(), 'a');
      expect(next.has('a')).toBe(true);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>();
      const next = expandKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>();
      expandKey(original, 'a');
      expect(original.has('a')).toBe(false);
    });

    it('should preserve unrelated expanded keys', () => {
      const original = new Set<string | number>(['b', 'c']);
      const next = expandKey(original, 'a');
      expect(next.has('b')).toBe(true);
      expect(next.has('c')).toBe(true);
    });
  });

  describe('collapseKey', () => {
    it('should collapse an expanded key', () => {
      const next = collapseKey(new Set(['a']), 'a');
      expect(next.has('a')).toBe(false);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>(['a']);
      const next = collapseKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>(['a']);
      collapseKey(original, 'a');
      expect(original.has('a')).toBe(true);
    });

    it('should preserve unrelated expanded keys', () => {
      const original = new Set<string | number>(['a', 'b', 'c']);
      const next = collapseKey(original, 'a');
      expect(next.has('b')).toBe(true);
      expect(next.has('c')).toBe(true);
    });
  });

  describe('toggleExpandedKey', () => {
    it('should toggle a collapsed key to expanded', () => {
      const next = toggleExpandedKey(new Set(), 'a');
      expect(next.has('a')).toBe(true);
    });

    it('should toggle an expanded key to collapsed', () => {
      const next = toggleExpandedKey(new Set(['a']), 'a');
      expect(next.has('a')).toBe(false);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>();
      const next = toggleExpandedKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>(['a']);
      toggleExpandedKey(original, 'a');
      expect(original.has('a')).toBe(true);
    });

    it('should preserve unrelated expanded keys when toggling', () => {
      const original = new Set<string | number>(['b']);
      const next = toggleExpandedKey(original, 'a');
      expect(next.has('b')).toBe(true);
    });
  });
});
