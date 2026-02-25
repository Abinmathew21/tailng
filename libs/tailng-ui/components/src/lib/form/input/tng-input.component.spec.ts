import { describe, expect, it } from 'vitest';
import { readTngInputEventValue, TngInputComponent } from './tng-input.component';

describe('tng-input component', () => {
  it('exports the public TngInput symbol', () => {
    expect(typeof TngInputComponent).toBe('function');
  });

  it('reads input value from DOM event targets', () => {
    const element = document.createElement('input');
    element.value = 'tailng';

    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', { value: element });

    expect(readTngInputEventValue(inputEvent)).toBe('tailng');
  });

  it('returns null for non-input event targets', () => {
    const badEvent = new Event('input');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngInputEventValue(badEvent)).toBeNull();
  });
});
