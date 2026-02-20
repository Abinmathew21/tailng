import { describe, expect, it } from 'vitest';
import { readTngSliderEventValue, TngSlider } from './tng-slider.component';

describe('tng-slider component', () => {
  it('exports the slider component', () => {
    expect(typeof TngSlider).toBe('function');
  });

  it('reads slider values from input events', () => {
    const element = document.createElement('input');
    element.value = '42';

    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', { value: element });

    expect(readTngSliderEventValue(inputEvent)).toBe(42);
  });

  it('returns null for non-slider event targets', () => {
    const badEvent = new Event('input');
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(readTngSliderEventValue(badEvent)).toBeNull();
  });
});
