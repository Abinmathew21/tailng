import { describe, expect, it } from 'vitest';
import {
  coerceTngRadioNullableBoolean,
  normalizeTngRadioStringValue,
  resolveTngRadioDataState,
  resolveTngRadioInvalidState,
} from '../tng-radio';

describe('tng-radio primitive normalization', () => {
  it('normalizes nullable string inputs', () => {
    expect(normalizeTngRadioStringValue(undefined)).toBeNull();
    expect(normalizeTngRadioStringValue(null)).toBeNull();
    expect(normalizeTngRadioStringValue('')).toBeNull();
    expect(normalizeTngRadioStringValue('  plan-basic  ')).toBe('plan-basic');
  });

  it('coerces nullable boolean inputs used by aria and invalid state', () => {
    expect(coerceTngRadioNullableBoolean(undefined)).toBeNull();
    expect(coerceTngRadioNullableBoolean(null)).toBeNull();
    expect(coerceTngRadioNullableBoolean('')).toBe(true);
    expect(coerceTngRadioNullableBoolean('true')).toBe(true);
    expect(coerceTngRadioNullableBoolean(true)).toBe(true);
    expect(coerceTngRadioNullableBoolean('false')).toBe(false);
    expect(coerceTngRadioNullableBoolean(false)).toBe(false);
    expect(coerceTngRadioNullableBoolean('not-valid')).toBeNull();
  });

  it('maps checked state to data-state hook', () => {
    expect(resolveTngRadioDataState(true)).toBe('checked');
    expect(resolveTngRadioDataState(false)).toBe('unchecked');
  });

  it('resolves invalid state with invalid input taking precedence over aria-invalid', () => {
    expect(resolveTngRadioInvalidState(true, false)).toBe(true);
    expect(resolveTngRadioInvalidState(false, true)).toBe(false);
    expect(resolveTngRadioInvalidState(null, true)).toBe(true);
    expect(resolveTngRadioInvalidState(null, false)).toBe(false);
    expect(resolveTngRadioInvalidState(null, null)).toBe(false);
  });
});
