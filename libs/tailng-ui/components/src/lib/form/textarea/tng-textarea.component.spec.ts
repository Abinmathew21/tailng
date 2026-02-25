import { describe, expect, it } from 'vitest';
import { readTngTextareaEventValue, TngTextareaComponent } from './tng-textarea.component';

describe('tng-textarea component', () => {
  it('exports the public TngTextarea symbol', () => {
    expect(typeof TngTextareaComponent).toBe('function');
  });

  it('reads textarea value from DOM event targets', () => {
    const element = document.createElement('textarea');
    element.value = 'long form input';

    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', { value: element });

    expect(readTngTextareaEventValue(inputEvent)).toBe('long form input');
  });

  it('returns null for non-textarea event targets', () => {
    const badEvent = new Event('input');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngTextareaEventValue(badEvent)).toBeNull();
  });
});
