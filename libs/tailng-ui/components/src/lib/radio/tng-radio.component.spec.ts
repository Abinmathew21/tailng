import { describe, expect, it } from 'vitest';
import { readTngRadioChecked, TngRadio } from './tng-radio.component';

describe('tng-radio component', () => {
  it('exports the public TngRadio symbol', () => {
    expect(typeof TngRadio).toBe('function');
  });

  it('reads checked state from a radio input event target', () => {
    const element = document.createElement('input');
    element.type = 'radio';
    element.checked = true;

    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { value: element });

    expect(readTngRadioChecked(changeEvent)).toBe(true);
  });

  it('returns null for non-input event targets', () => {
    const badEvent = new Event('change');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngRadioChecked(badEvent)).toBeNull();
  });
});
