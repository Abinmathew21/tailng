import { describe, expect, it } from 'vitest';
import { resolveTngToggleAriaPressed, resolveTngToggleDataState, TngToggle } from './tng-toggle';

describe('tng-toggle primitive helpers', () => {
  it('exports the toggle primitive', () => {
    expect(typeof TngToggle).toBe('function');
  });

  it('maps pressed states to aria and data-state values', () => {
    expect(resolveTngToggleAriaPressed(true)).toBe('true');
    expect(resolveTngToggleAriaPressed(false)).toBe('false');
    expect(resolveTngToggleDataState(true)).toBe('on');
    expect(resolveTngToggleDataState(false)).toBe('off');
  });
});
