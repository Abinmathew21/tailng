import { describe, expect, it } from 'vitest';
import {
  readTngRadioChecked,
  shouldEmitTngRadioCheckedChange,
  TngRadioComponent,
} from './tng-radio.component';

describe('tng-radio component', () => {
  it('exports the public TngRadio symbol', () => {
    expect(typeof TngRadioComponent).toBe('function');
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

  it('returns null for non-event values passed to the event parser', () => {
    expect(readTngRadioChecked(undefined)).toBeNull();
    expect(readTngRadioChecked('change')).toBeNull();
  });

  it('guards checkedChange emission for disabled and readonly radio wrappers', () => {
    expect(shouldEmitTngRadioCheckedChange(false, false)).toBe(true);
    expect(shouldEmitTngRadioCheckedChange(true, false)).toBe(false);
    expect(shouldEmitTngRadioCheckedChange(false, true)).toBe(false);
    expect(shouldEmitTngRadioCheckedChange(true, true)).toBe(false);
  });
});
