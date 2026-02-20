import { describe, expect, it } from 'vitest';
import { normalizeTngRadioStringValue } from './tng-radio';

describe('tng-radio primitive normalization', () => {
  it('normalizes nullable string inputs', () => {
    expect(normalizeTngRadioStringValue(undefined)).toBeNull();
    expect(normalizeTngRadioStringValue(null)).toBeNull();
    expect(normalizeTngRadioStringValue('')).toBeNull();
    expect(normalizeTngRadioStringValue('  plan-basic  ')).toBe('plan-basic');
  });
});
