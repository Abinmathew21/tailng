import { describe, expect, it } from 'vitest';
import { normalizeTngOtpLength, TngInputOtp } from './tng-input-otp';

describe('tng-input-otp primitive helpers', () => {
  it('exports the input-otp primitive', () => {
    expect(typeof TngInputOtp).toBe('function');
  });

  it('normalizes otp length into safe bounds', () => {
    expect(normalizeTngOtpLength(Number.NaN)).toBe(6);
    expect(normalizeTngOtpLength(0)).toBe(1);
    expect(normalizeTngOtpLength(20)).toBe(12);
  });
});
