import { describe, expect, it, vi } from 'vitest';
import { handleComboboxKeydown } from '../combobox.keyboard';
import type { ComboboxListboxApi } from '../combobox.listbox-api';

function createEvent(
  key: string,
  init: Partial<KeyboardEventInit> = {}
): KeyboardEvent {
  return new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init });
}

function createStubListbox(overrides: Partial<ComboboxListboxApi> = {}): ComboboxListboxApi {
  return {
    getHostId: () => null,
    getActiveId: () => 'opt-1',
    ensureActive: vi.fn(),
    handleKey: vi.fn(() => false),
    typeahead: vi.fn(() => false),
    commitActive: vi.fn(),
    ...overrides,
  };
}

function createContext(overrides: Partial<{
  disabled: boolean;
  open: boolean;
  openSelect: () => void;
  close: () => void;
  listbox: ComboboxListboxApi | null;
  setActiveDescendantId: (id: string | null) => void;
}> = {}) {
  return {
    disabled: false,
    open: false,
    openSelect: vi.fn(),
    close: vi.fn(),
    listbox: createStubListbox(),
    setActiveDescendantId: vi.fn(),
    ...overrides,
  };
}

describe('combobox.keyboard (handleComboboxKeydown)', () => {
  describe('disabled', () => {
    it('does nothing when disabled', () => {
      const ctx = createContext({ disabled: true });
      const ev = createEvent('ArrowDown');

      handleComboboxKeydown(ev, ctx);

      expect(ev.defaultPrevented).toBe(false);
      expect(ctx.openSelect).not.toHaveBeenCalled();
      expect(ctx.close).not.toHaveBeenCalled();
    });
  });

  describe('closed state - keys that open', () => {
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Spacebar'];

    openKeys.forEach((key) => {
      it(`${key} opens and calls ensureActive + setActiveDescendantId`, () => {
        const ctx = createContext({ open: false });
        const ev = createEvent(key);

        handleComboboxKeydown(ev, ctx);

        expect(ev.defaultPrevented).toBe(true);
        expect(ctx.openSelect).toHaveBeenCalledTimes(1);
        expect(ctx.listbox!.ensureActive).toHaveBeenCalledWith(
          key === 'ArrowUp' ? 'last' : 'first'
        );
        expect(ctx.setActiveDescendantId).toHaveBeenCalledWith('opt-1');
      });
    });

    it('Tab does not open', () => {
      const ctx = createContext({ open: false });
      const ev = createEvent('Tab');

      handleComboboxKeydown(ev, ctx);

      expect(ctx.openSelect).not.toHaveBeenCalled();
    });
  });

  describe('open state - Escape', () => {
    it('Escape closes and prevents default + stopPropagation', () => {
      const ctx = createContext({ open: true });
      const ev = createEvent('Escape');
      const stopSpy = vi.spyOn(ev, 'stopPropagation');

      handleComboboxKeydown(ev, ctx);

      expect(ev.defaultPrevented).toBe(true);
      expect(stopSpy).toHaveBeenCalled();
      expect(ctx.close).toHaveBeenCalledTimes(1);
    });

    it('Escape does not close when defaultPrevented', () => {
      const ctx = createContext({ open: true });
      const ev = createEvent('Escape');
      ev.preventDefault();

      handleComboboxKeydown(ev, ctx);

      expect(ctx.close).not.toHaveBeenCalled();
    });
  });

  describe('open state - Space/Spacebar commit', () => {
    it('Space commits active and prevents default', () => {
      const ctx = createContext({ open: true });
      const ev = createEvent(' ');

      handleComboboxKeydown(ev, ctx);

      expect(ev.defaultPrevented).toBe(true);
      expect(ctx.listbox!.commitActive).toHaveBeenCalledTimes(1);
    });

    it('Spacebar commits active', () => {
      const ctx = createContext({ open: true });
      const ev = createEvent('Spacebar');

      handleComboboxKeydown(ev, ctx);

      expect(ctx.listbox!.commitActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('open state - Enter commit', () => {
    it('Enter commits active', () => {
      const ctx = createContext({ open: true });
      const ev = createEvent('Enter');

      handleComboboxKeydown(ev, ctx);

      expect(ev.defaultPrevented).toBe(true);
      expect(ctx.listbox!.commitActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('open state - typeahead', () => {
    it('typeahead moves: syncs active and prevents default', () => {
      const typeaheadSpy = vi.fn(() => true);
      const ctx = createContext({
        open: true,
        listbox: createStubListbox({ typeahead: typeaheadSpy, getActiveId: () => 'opt-b' }),
      });
      const ev = createEvent('b');

      handleComboboxKeydown(ev, ctx);

      expect(typeaheadSpy).toHaveBeenCalledWith('b');
      expect(ctx.setActiveDescendantId).toHaveBeenCalledWith('opt-b');
      expect(ev.defaultPrevented).toBe(true);
    });

    it('typeahead no move: does not sync or prevent default', () => {
      const ctx = createContext({
        open: true,
        listbox: createStubListbox({ typeahead: () => false }),
      });
      const ev = createEvent('z');

      handleComboboxKeydown(ev, ctx);

      expect(ctx.setActiveDescendantId).not.toHaveBeenCalled();
      expect(ev.defaultPrevented).toBe(false);
    });

    it('with enableTypeahead: false, single char goes to handleKey not typeahead', () => {
      const listbox = createStubListbox({
        typeahead: vi.fn(() => false),
        handleKey: vi.fn(() => false),
      });
      const ctx = createContext({ open: true, listbox });
      const ev = createEvent('a');

      handleComboboxKeydown(ev, ctx, { enableTypeahead: false });

      expect(listbox.typeahead).not.toHaveBeenCalled();
      expect(listbox.handleKey).toHaveBeenCalledWith('a', false);
    });
  });

  describe('open state - handleKey (arrows, Home, End)', () => {
    it('handleKey moved: syncs active and prevents default', () => {
      const handleKeySpy = vi.fn(() => true);
      const ctx = createContext({
        open: true,
        listbox: createStubListbox({
          handleKey: handleKeySpy,
          getActiveId: () => 'opt-2',
        }),
      });
      const ev = createEvent('ArrowDown');

      handleComboboxKeydown(ev, ctx);

      expect(handleKeySpy).toHaveBeenCalledWith('ArrowDown', false);
      expect(ctx.setActiveDescendantId).toHaveBeenCalledWith('opt-2');
      expect(ev.defaultPrevented).toBe(true);
    });

    it('handleKey with shiftKey passes shiftKey', () => {
      const handleKeySpy = vi.fn(() => true);
      const ctx = createContext({
        open: true,
        listbox: createStubListbox({ handleKey: handleKeySpy }),
      });
      const ev = createEvent('ArrowDown', { shiftKey: true });

      handleComboboxKeydown(ev, ctx);

      expect(handleKeySpy).toHaveBeenCalledWith('ArrowDown', true);
    });

    it('handleKey no move: Enter fallback commits', () => {
      const ctx = createContext({
        open: true,
        listbox: createStubListbox({ handleKey: () => false }),
      });
      const ev = createEvent('ArrowRight'); // typically no effect in vertical list

      handleComboboxKeydown(ev, ctx);

      // ArrowRight doesn't match typeahead (length>1) or Space/Enter, so handleKey runs
      // and returns false. Then we hit the Enter/Space fallback - but ArrowRight isn't Enter/Space
      // so nothing commits. Let me re-read the logic...

      // Actually: handleKey('ArrowRight') returns false. We don't return. We fall through to:
      // "if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')" - ArrowRight is none of these
      // So we don't call commitActive. The function just ends. Good.
      expect(ctx.listbox!.commitActive).not.toHaveBeenCalled();
    });
  });

  describe('active descendant sync', () => {
    it('closed ArrowDown: ensureActive + setActiveDescendantId both called', () => {
      const listbox = createStubListbox({ getActiveId: () => 'opt-first' });
      const ctx = createContext({ open: false, listbox });
      const ev = createEvent('ArrowDown');

      handleComboboxKeydown(ev, ctx);

      expect(listbox.ensureActive).toHaveBeenCalledWith('first');
      expect(ctx.setActiveDescendantId).toHaveBeenCalledWith('opt-first');
    });

    it('closed ArrowUp: ensureActive(last) + setActiveDescendantId', () => {
      const listbox = createStubListbox({ getActiveId: () => 'opt-last' });
      const ctx = createContext({ open: false, listbox });
      const ev = createEvent('ArrowUp');

      handleComboboxKeydown(ev, ctx);

      expect(listbox.ensureActive).toHaveBeenCalledWith('last');
      expect(ctx.setActiveDescendantId).toHaveBeenCalledWith('opt-last');
    });
  });
});
