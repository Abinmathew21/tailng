import { describe, expect, it } from 'vitest';
import {
  coerceTngCheckboxNullableBoolean,
  resolveTngCheckboxAriaChecked,
  resolveTngCheckboxDataState,
  resolveTngCheckboxInvalidState,
} from '../tng-checkbox';

describe('tng-checkbox primitive tri-state helpers', () => {
  it('maps checked and indeterminate state to aria-checked', () => {
    expect(resolveTngCheckboxAriaChecked(false, false)).toBe('false');
    expect(resolveTngCheckboxAriaChecked(true, false)).toBe('true');
    expect(resolveTngCheckboxAriaChecked(false, true)).toBe('mixed');
  });

  it('maps checked and indeterminate state to data-state', () => {
    expect(resolveTngCheckboxDataState(false, false)).toBe('unchecked');
    expect(resolveTngCheckboxDataState(true, false)).toBe('checked');
    expect(resolveTngCheckboxDataState(false, true)).toBe('mixed');
  });

  it('coerces nullable boolean inputs', () => {
    expect(coerceTngCheckboxNullableBoolean(true)).toBe(true);
    expect(coerceTngCheckboxNullableBoolean(false)).toBe(false);
    expect(coerceTngCheckboxNullableBoolean('true')).toBe(true);
    expect(coerceTngCheckboxNullableBoolean('false')).toBe(false);
    expect(coerceTngCheckboxNullableBoolean('')).toBe(true);
    expect(coerceTngCheckboxNullableBoolean(undefined)).toBeNull();
    expect(coerceTngCheckboxNullableBoolean(null)).toBeNull();
    expect(coerceTngCheckboxNullableBoolean('invalid')).toBeNull();
  });

  it('resolves invalid state precedence as invalid > ariaInvalid > false', () => {
    expect(resolveTngCheckboxInvalidState(true, false)).toBe(true);
    expect(resolveTngCheckboxInvalidState(false, true)).toBe(false);
    expect(resolveTngCheckboxInvalidState(null, true)).toBe(true);
    expect(resolveTngCheckboxInvalidState(null, false)).toBe(false);
    expect(resolveTngCheckboxInvalidState(null, null)).toBe(false);
  });
});
