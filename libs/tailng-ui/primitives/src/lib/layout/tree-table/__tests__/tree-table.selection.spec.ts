import { describe, expect, it } from 'vitest';
import { deselectKey, selectKey, toggleSelectedKey } from '../tree-table-selection';

describe('tree-table selection primitives', () => {
  describe('selectKey', () => {
    it('should select a key', () => {
      const next = selectKey(new Set(), 'a');
      expect(next.has('a')).toBe(true);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>();
      const next = selectKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>();
      selectKey(original, 'a');
      expect(original.has('a')).toBe(false);
    });

    it('should not select a disabled key', () => {
      const next = selectKey(new Set(), 'a', new Set(['a']));
      expect(next.has('a')).toBe(false);
    });

    it('should select a non-disabled key even when disabledKeys is provided', () => {
      const next = selectKey(new Set(), 'a', new Set(['b']));
      expect(next.has('a')).toBe(true);
    });
  });

  describe('deselectKey', () => {
    it('should deselect a selected key', () => {
      const next = deselectKey(new Set(['a']), 'a');
      expect(next.has('a')).toBe(false);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>(['a']);
      const next = deselectKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>(['a']);
      deselectKey(original, 'a');
      expect(original.has('a')).toBe(true);
    });

    it('should preserve unrelated selected keys', () => {
      const next = deselectKey(new Set(['a', 'b']), 'a');
      expect(next.has('b')).toBe(true);
    });
  });

  describe('toggleSelectedKey', () => {
    it('should toggle an unselected key to selected', () => {
      const next = toggleSelectedKey(new Set(), 'a');
      expect(next.has('a')).toBe(true);
    });

    it('should toggle a selected key to unselected', () => {
      const next = toggleSelectedKey(new Set(['a']), 'a');
      expect(next.has('a')).toBe(false);
    });

    it('should return a new Set instance', () => {
      const original = new Set<string | number>();
      const next = toggleSelectedKey(original, 'a');
      expect(next).not.toBe(original);
    });

    it('should not mutate the previous Set', () => {
      const original = new Set<string | number>(['a']);
      toggleSelectedKey(original, 'a');
      expect(original.has('a')).toBe(true);
    });

    it('should not toggle selection for a disabled key', () => {
      const next = toggleSelectedKey(new Set(), 'a', new Set(['a']));
      expect(next.has('a')).toBe(false);
    });

    it('should preserve unrelated selected keys when toggling', () => {
      const next = toggleSelectedKey(new Set(['b']), 'a');
      expect(next.has('b')).toBe(true);
    });
  });
});
