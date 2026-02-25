import { describe, expect, it } from 'vitest';
import { applyTngOtpSlotValue, sanitizeTngOtpValue, TngInputOtpComponent } from './tng-input-otp.component';

describe('tng-input-otp component', () => {
  it('exports the input-otp component', () => {
    expect(typeof TngInputOtpComponent).toBe('function');
  });

  it('sanitizes otp values to alphanumeric characters', () => {
    expect(sanitizeTngOtpValue('1-2 3')).toBe('123');
    expect(sanitizeTngOtpValue('A!B@C#')).toBe('ABC');
  });

  it('applies slot values safely', () => {
    const current = ['1', '', ''] as const;
    expect(applyTngOtpSlotValue(current, 1, '9')).toEqual(['1', '9', '']);
    expect(applyTngOtpSlotValue(current, 6, '9')).toEqual(current);
  });
});
