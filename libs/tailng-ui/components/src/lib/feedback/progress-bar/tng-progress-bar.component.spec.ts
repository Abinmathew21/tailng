import { describe, expect, it } from 'vitest';
import { toTngProgressBarPercent, TngProgressBarComponent } from './tng-progress-bar.component';

describe('tng-progress-bar component', () => {
  it('exports the public TngProgressBar symbol', () => {
    expect(typeof TngProgressBarComponent).toBe('function');
  });

  it('maps values to percentage for the indicator width', () => {
    expect(toTngProgressBarPercent(0, 100, 25)).toBe(25);
    expect(toTngProgressBarPercent(50, 150, 100)).toBe(50);
    expect(toTngProgressBarPercent(0, 0, 10)).toBe(100);
  });
});
