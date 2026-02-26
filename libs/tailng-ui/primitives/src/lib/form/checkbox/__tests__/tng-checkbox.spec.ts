import { describe, expect, it } from 'vitest';
import { resolveTngCheckboxAriaChecked, resolveTngCheckboxDataState } from '../tng-checkbox';

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
});
