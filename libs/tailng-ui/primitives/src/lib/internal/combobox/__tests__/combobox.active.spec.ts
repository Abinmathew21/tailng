import { describe, expect, it, vi } from 'vitest';
import { ensureActiveAndSync, syncActiveDescendant } from '../combobox.active';
import type { ComboboxListboxApi } from '../combobox.listbox-api';

function createStubListbox(overrides: Partial<ComboboxListboxApi> = {}): ComboboxListboxApi {
  return {
    getHostId: () => null,
    getActiveId: () => 'opt-1',
    ensureActive: vi.fn(),
    handleKey: () => false,
    typeahead: () => false,
    commitActive: vi.fn(),
    ...overrides,
  };
}

describe('combobox.active (active descendant sync)', () => {
  describe('syncActiveDescendant', () => {
    it('calls setActiveDescendantId with listbox getActiveId', () => {
      const setActive = vi.fn();
      const listbox = createStubListbox({ getActiveId: () => 'opt-x' });

      syncActiveDescendant(listbox, setActive);

      expect(setActive).toHaveBeenCalledWith('opt-x');
    });

    it('calls setActiveDescendantId with null when listbox is null', () => {
      const setActive = vi.fn();

      syncActiveDescendant(null, setActive);

      expect(setActive).toHaveBeenCalledWith(null);
    });

    it('calls setActiveDescendantId with null when getActiveId returns null', () => {
      const setActive = vi.fn();
      const listbox = createStubListbox({ getActiveId: () => null });

      syncActiveDescendant(listbox, setActive);

      expect(setActive).toHaveBeenCalledWith(null);
    });
  });

  describe('ensureActiveAndSync', () => {
    it('calls ensureActive with pref then syncs', () => {
      const setActive = vi.fn();
      const listbox = createStubListbox({
        getActiveId: () => 'opt-last',
        ensureActive: vi.fn(),
      });

      ensureActiveAndSync(listbox, setActive, 'last');

      expect(listbox.ensureActive).toHaveBeenCalledWith('last');
      expect(setActive).toHaveBeenCalledWith('opt-last');
    });

    it('calls ensureActive with first when pref undefined', () => {
      const setActive = vi.fn();
      const listbox = createStubListbox({ ensureActive: vi.fn() });

      ensureActiveAndSync(listbox, setActive);

      expect(listbox.ensureActive).toHaveBeenCalledWith(undefined);
      expect(setActive).toHaveBeenCalledWith('opt-1');
    });

    it('handles null listbox (no throw)', () => {
      const setActive = vi.fn();

      ensureActiveAndSync(null, setActive, 'first');

      expect(setActive).toHaveBeenCalledWith(null);
    });
  });
});
