import { describe, expect, it } from 'vitest';
import { resolveTngToggleAriaLabel, toggleTngToggleState, TngToggleComponent } from './tng-toggle.component';

describe('tng-toggle component', () => {
  it('exports the toggle component', () => {
    expect(typeof TngToggleComponent).toBe('function');
  });

  it('toggles pressed state', () => {
    expect(toggleTngToggleState(true)).toBe(false);
    expect(toggleTngToggleState(false)).toBe(true);
  });

  it('resolves aria labels from pressed state', () => {
    expect(resolveTngToggleAriaLabel(true, 'Enabled', 'Disabled')).toBe('Enabled');
    expect(resolveTngToggleAriaLabel(false, 'Enabled', 'Disabled')).toBe('Disabled');
  });
});
