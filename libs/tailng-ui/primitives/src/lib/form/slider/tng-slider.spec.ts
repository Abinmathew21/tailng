import { describe, expect, it } from 'vitest';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
  TngSlider,
} from './tng-slider';

describe('tng-slider primitive helpers', () => {
  it('exports the slider primitive', () => {
    expect(typeof TngSlider).toBe('function');
  });

  it('normalizes min/max/step values', () => {
    expect(normalizeTngSliderMin(Number.NaN)).toBe(0);
    expect(normalizeTngSliderMax(Number.POSITIVE_INFINITY)).toBe(100);
    expect(normalizeTngSliderStep(0)).toBe(1);
  });
});
