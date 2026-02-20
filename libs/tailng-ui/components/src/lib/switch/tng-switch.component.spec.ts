import { describe, expect, it } from 'vitest';
import { toggleTngSwitchState, TngSwitch } from './tng-switch.component';

describe('tng-switch component', () => {
  it('exports the switch component', () => {
    expect(typeof TngSwitch).toBe('function');
  });

  it('toggles checked state', () => {
    expect(toggleTngSwitchState(true)).toBe(false);
    expect(toggleTngSwitchState(false)).toBe(true);
  });
});
