import { describe, expect, it } from 'vitest';
import { createListboxController } from './listbox';

describe('a11y/listbox (composed)', () => {
  it('selects in single mode on click', () => {
    const c = createListboxController<string>({
      hostId: 'lb-1',
      selectionMode: 'single',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleClick('b');

    expect(c.getSelectedValues()).toEqual(['B']);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('a')['aria-selected']).toBe(false);
  });

  it('toggles in multiple mode on click', () => {
    const c = createListboxController<string>({
      hostId: 'lb-2',
      selectionMode: 'multiple',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleClick('a');
    c.handleClick('b');

    expect(new Set(c.getSelectedValues())).toEqual(new Set(['A', 'B']));
    expect(c.getOptionAttributes('a')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
  });

  it('moves active with list-navigation actions and does not auto-select by default', () => {
    const c = createListboxController<string>({
      hostId: 'lb-3',
      selectionMode: 'single',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    // With active-descendant, active starts null; ArrowDown sets active to first enabled.
    c.handleKeyDown({ key: 'ArrowDown' });

    expect(c.getActiveId()).toBe('a');
    expect(c.getSelectedValues()).toEqual([]);
  });

  it('selects active on Enter', () => {
    const c = createListboxController<string>({
      hostId: 'lb-4',
      selectionMode: 'single',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    // ArrowDown -> active 'a'
    c.handleKeyDown({ key: 'ArrowDown' });
    // ArrowDown -> active 'b'
    c.handleKeyDown({ key: 'ArrowDown' });
    c.handleKeyDown({ key: 'Enter' });

    expect(c.getActiveId()).toBe('b');
    expect(c.getSelectedValues()).toEqual(['B']);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
  });

  it('skips disabled options during navigation', () => {
    const c = createListboxController<string>({
      hostId: 'lb-5',
      selectionMode: 'single',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B', disabled: true });
    c.registerOption({ id: 'c', value: 'C' });

    // First ArrowDown -> active 'a'
    c.handleKeyDown({ key: 'ArrowDown' });
    // Next ArrowDown should skip 'b' (disabled) and go to 'c'
    c.handleKeyDown({ key: 'ArrowDown' });

    expect(c.getActiveId()).toBe('c');
    expect(c.getOptionAttributes('b')['aria-disabled']).toBe(true);
  });

  it('range-selects with shift+click in multiple mode', () => {
    const c = createListboxController<string>({
      hostId: 'lb-6',
      selectionMode: 'multiple',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });
    c.registerOption({ id: 'c', value: 'C' });

    // Anchor is set by first selection
    c.handleClick('a');
    // Shift-click range to 'c' should select a..c (merge)
    c.handleClick('c', true);

    expect(new Set(c.getSelectedValues())).toEqual(new Set(['A', 'B', 'C']));
  });

  it('select-all selects only enabled options', () => {
    const c = createListboxController<string>({
      hostId: 'lb-7',
      selectionMode: 'multiple',
    });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B', disabled: true });
    c.registerOption({ id: 'c', value: 'C' });

    c.handleKeyDown({ key: 'a', ctrlKey: true });

    expect(new Set(c.getSelectedValues())).toEqual(new Set(['A', 'C']));
    expect(c.getOptionAttributes('a')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(false);
    expect(c.getOptionAttributes('c')['aria-selected']).toBe(true);
  });
});