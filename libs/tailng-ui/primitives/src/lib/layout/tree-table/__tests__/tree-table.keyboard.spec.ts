import { describe, expect, it } from 'vitest';
import { resolveTreeTableKeydown } from '../tree-table-keyboard';

const expandableCollapsed = { expandable: true, expanded: false, selectable: false };
const expandableExpanded = { expandable: true, expanded: true, selectable: false };
const nonExpandable = { expandable: false, expanded: false, selectable: false };
const selectableCtx = { expandable: false, expanded: false, selectable: true };
const expandableSelectable = { expandable: true, expanded: false, selectable: true };

describe('resolveTreeTableKeydown', () => {
  describe('ArrowRight', () => {
    it('returns "expand" when row is expandable and collapsed', () => {
      expect(resolveTreeTableKeydown('ArrowRight', expandableCollapsed)).toBe('expand');
    });

    it('returns null when row is expandable and already expanded', () => {
      expect(resolveTreeTableKeydown('ArrowRight', expandableExpanded)).toBeNull();
    });

    it('returns null when row is not expandable', () => {
      expect(resolveTreeTableKeydown('ArrowRight', nonExpandable)).toBeNull();
    });
  });

  describe('ArrowLeft', () => {
    it('returns "collapse" when row is expandable and expanded', () => {
      expect(resolveTreeTableKeydown('ArrowLeft', expandableExpanded)).toBe('collapse');
    });

    it('returns null when row is expandable and already collapsed', () => {
      expect(resolveTreeTableKeydown('ArrowLeft', expandableCollapsed)).toBeNull();
    });

    it('returns null when row is not expandable', () => {
      expect(resolveTreeTableKeydown('ArrowLeft', nonExpandable)).toBeNull();
    });
  });

  describe('Enter', () => {
    it('returns "toggle" when row is expandable', () => {
      expect(resolveTreeTableKeydown('Enter', expandableCollapsed)).toBe('toggle');
      expect(resolveTreeTableKeydown('Enter', expandableExpanded)).toBe('toggle');
    });

    it('returns null when row is not expandable', () => {
      expect(resolveTreeTableKeydown('Enter', nonExpandable)).toBeNull();
    });
  });

  describe('Space', () => {
    it('returns "select" when selectable', () => {
      expect(resolveTreeTableKeydown(' ', selectableCtx)).toBe('select');
      expect(resolveTreeTableKeydown(' ', expandableSelectable)).toBe('select');
    });

    it('returns null when not selectable', () => {
      expect(resolveTreeTableKeydown(' ', expandableCollapsed)).toBeNull();
      expect(resolveTreeTableKeydown(' ', nonExpandable)).toBeNull();
    });
  });

  describe('Home / End', () => {
    it('returns "focusFirst" for Home key', () => {
      expect(resolveTreeTableKeydown('Home', nonExpandable)).toBe('focusFirst');
    });

    it('returns "focusLast" for End key', () => {
      expect(resolveTreeTableKeydown('End', nonExpandable)).toBe('focusLast');
    });
  });

  describe('unknown keys', () => {
    it('returns null for unrecognised keys', () => {
      expect(resolveTreeTableKeydown('Tab', nonExpandable)).toBeNull();
      expect(resolveTreeTableKeydown('Escape', nonExpandable)).toBeNull();
      expect(resolveTreeTableKeydown('ArrowUp', nonExpandable)).toBeNull();
      expect(resolveTreeTableKeydown('ArrowDown', nonExpandable)).toBeNull();
    });
  });
});
