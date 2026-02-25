import { describe, expect, it } from 'vitest';
import {
  toTngProgressSpinnerDashOffset,
  toTngProgressSpinnerPercent,
  TngProgressSpinnerComponent,
} from './tng-progress-spinner.component';

describe('tng-progress-spinner component', () => {
  it('exports the public TngProgressSpinner symbol', () => {
    expect(typeof TngProgressSpinnerComponent).toBe('function');
  });

  it('maps values to determinate spinner metrics', () => {
    expect(toTngProgressSpinnerPercent(0, 100, 25)).toBe(25);
    expect(toTngProgressSpinnerPercent(20, 120, 70)).toBe(50);
    expect(toTngProgressSpinnerPercent(0, 0, 10)).toBe(100);
    expect(toTngProgressSpinnerDashOffset(0)).toBeGreaterThan(0);
    expect(toTngProgressSpinnerDashOffset(100)).toBe(0);
  });
});
