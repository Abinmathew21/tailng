import { describe, expect, it } from 'vitest';
import {
  resolveTngProgressSpinnerRange,
  TngProgressSpinner,
} from '../tng-progress-spinner';

describe('tng-progress-spinner primitive', () => {
  it('exports the public TngProgressSpinner symbol', () => {
    expect(typeof TngProgressSpinner).toBe('function');
  });

  it('normalizes progress range boundaries', () => {
    expect(resolveTngProgressSpinnerRange(0, 100, 15)).toEqual({
      max: 100,
      min: 0,
      value: 15,
    });
    expect(resolveTngProgressSpinnerRange(120, 20, -4)).toEqual({
      max: 120,
      min: 120,
      value: 120,
    });
  });
});
