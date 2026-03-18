import { describe, expect, it } from 'vitest';
import { createListboxController } from './listbox';

describe('a11y/listbox (composed) — single selection', () => {
  it('selects in single mode on click', () => {
    const c = createListboxController<string>({ hostId: 'lb-1', selectionMode: 'single' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleClick('b');

    expect(c.getSelectedValues()).toEqual(['B']);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('a')['aria-selected']).toBe(false);
  });

  it('moves active with list-navigation actions and does not auto-select by default', () => {
    const c = createListboxController<string>({ hostId: 'lb-3', selectionMode: 'single' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleKeyDown({ key: 'ArrowDown' });

    expect(c.getActiveId()).toBe('a');
    expect(c.getSelectedValues()).toEqual([]);
  });

  it('selects active on Enter', () => {
    const c = createListboxController<string>({ hostId: 'lb-4', selectionMode: 'single' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleKeyDown({ key: 'ArrowDown' });
    c.handleKeyDown({ key: 'ArrowDown' });
    c.handleKeyDown({ key: 'Enter' });

    expect(c.getActiveId()).toBe('b');
    expect(c.getSelectedValues()).toEqual(['B']);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
  });

  it('skips disabled options during navigation', () => {
    const c = createListboxController<string>({ hostId: 'lb-5', selectionMode: 'single' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B', disabled: true });
    c.registerOption({ id: 'c', value: 'C' });

    c.handleKeyDown({ key: 'ArrowDown' });
    c.handleKeyDown({ key: 'ArrowDown' });

    expect(c.getActiveId()).toBe('c');
    expect(c.getOptionAttributes('b')['aria-disabled']).toBe(true);
  });
});

describe('a11y/listbox (composed) — multiple selection', () => {
  it('toggles in multiple mode on click', () => {
    const c = createListboxController<string>({ hostId: 'lb-2', selectionMode: 'multiple' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    c.handleClick('a');
    c.handleClick('b');

    expect(new Set(c.getSelectedValues())).toEqual(new Set(['A', 'B']));
    expect(c.getOptionAttributes('a')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(true);
  });

  it('range-selects with shift+click', () => {
    const c = createListboxController<string>({ hostId: 'lb-6', selectionMode: 'multiple' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });
    c.registerOption({ id: 'c', value: 'C' });

    c.handleClick('a');
    c.handleClick('c', true);

    expect(new Set(c.getSelectedValues())).toEqual(new Set(['A', 'B', 'C']));
  });

  it('select-all selects only enabled options', () => {
    const c = createListboxController<string>({ hostId: 'lb-7', selectionMode: 'multiple' });

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

describe('a11y/listbox (composed) — smoke + ARIA attributes', () => {
  it('exposes aria-selected and aria-disabled via getOptionAttributes', () => {
    const c = createListboxController<string>({ hostId: 'lb-8', selectionMode: 'multiple' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B', disabled: true });

    c.handleClick('a');

    expect(c.getOptionAttributes('a')['aria-selected']).toBe(true);
    expect(c.getOptionAttributes('b')['aria-disabled']).toBe(true);
    expect(c.getOptionAttributes('b')['aria-selected']).toBe(false);
  });

  it('activeId is null until navigation activates an enabled option', () => {
    const c = createListboxController<string>({ hostId: 'lb-9', selectionMode: 'single' });

    c.registerOption({ id: 'a', value: 'A' });
    c.registerOption({ id: 'b', value: 'B' });

    expect(c.getActiveId()).toBeNull();

    c.handleKeyDown({ key: 'ArrowDown' });
    expect(c.getActiveId()).toBe('a');
  });
});