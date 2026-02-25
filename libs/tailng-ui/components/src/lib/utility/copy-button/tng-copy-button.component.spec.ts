import { describe, expect, it } from 'vitest';
import { coerceTngCopyButtonResetDelay, TngCopyButtonComponent } from './tng-copy-button.component';

describe('tng-copy-button component', () => {
  it('exports the public TngCopyButtonComponent symbol', () => {
    expect(typeof TngCopyButtonComponent).toBe('function');
  });

  it('coerces reset delay values', () => {
    expect(coerceTngCopyButtonResetDelay(Number.NaN)).toBe(1500);
    expect(coerceTngCopyButtonResetDelay(-5)).toBe(0);
    expect(coerceTngCopyButtonResetDelay(1800.2)).toBe(1800);
    expect(coerceTngCopyButtonResetDelay('950')).toBe(950);
  });
});
