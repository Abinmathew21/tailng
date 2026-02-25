import { describe, expect, it } from 'vitest';
import { readTngCheckboxChange, TngCheckboxComponent } from './tng-checkbox.component';

describe('tng-checkbox component', () => {
  it('exports the public TngCheckboxComponent symbol', () => {
    expect(typeof TngCheckboxComponent).toBe('function');
  });

  it('reads checked and indeterminate state from a checkbox event target', () => {
    const element = document.createElement('input');
    element.type = 'checkbox';
    element.checked = true;
    element.indeterminate = true;

    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { value: element });

    expect(readTngCheckboxChange(changeEvent)).toEqual({
      checked: true,
      indeterminate: true,
    });
  });

  it('returns null for non-input event targets', () => {
    const badEvent = new Event('change');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngCheckboxChange(badEvent)).toBeNull();
  });
});
