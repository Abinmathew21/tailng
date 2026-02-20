import { describe, expect, it } from 'vitest';
import { resolveTngSwitchAriaChecked, resolveTngSwitchDataState, TngSwitch } from './tng-switch';

describe('tng-switch primitive helpers', () => {
  it('exports the switch primitive', () => {
    expect(typeof TngSwitch).toBe('function');
  });

  it('maps checked states to aria and data-state values', () => {
    expect(resolveTngSwitchAriaChecked(true)).toBe('true');
    expect(resolveTngSwitchAriaChecked(false)).toBe('false');
    expect(resolveTngSwitchDataState(true)).toBe('checked');
    expect(resolveTngSwitchDataState(false)).toBe('unchecked');
  });
});
