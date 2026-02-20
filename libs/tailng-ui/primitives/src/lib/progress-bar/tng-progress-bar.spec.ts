import { describe, expect, it } from 'vitest';
import {
  resolveTngProgressBarRange,
  TngProgressBar,
  TngProgressBarIndicator,
} from './tng-progress-bar';

describe('tng-progress-bar primitives', () => {
  it('exports public progress bar directives', () => {
    expect(typeof TngProgressBar).toBe('function');
    expect(typeof TngProgressBarIndicator).toBe('function');
  });

  it('normalizes progress range boundaries', () => {
    expect(resolveTngProgressBarRange(0, 100, 24)).toEqual({
      max: 100,
      min: 0,
      value: 24,
    });
    expect(resolveTngProgressBarRange(80, 20, 120)).toEqual({
      max: 80,
      min: 80,
      value: 80,
    });
  });
});
