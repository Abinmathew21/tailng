import { describe, expect, it } from 'vitest';
import {
  TngButtonToggle,
  TngButtonToggleGroup,
  resolveTngButtonToggleAriaPressed,
  resolveTngButtonToggleDataState,
} from '../tng-button-toggle';

describe('tng-button-toggle primitives', () => {
  it('exports button toggle directives', () => {
    expect(typeof TngButtonToggle).toBe('function');
    expect(typeof TngButtonToggleGroup).toBe('function');
  });

  it('resolves aria/data state', () => {
    expect(resolveTngButtonToggleAriaPressed(true)).toBe('true');
    expect(resolveTngButtonToggleAriaPressed(false)).toBe('false');
    expect(resolveTngButtonToggleDataState(true)).toBe('on');
    expect(resolveTngButtonToggleDataState(false)).toBe('off');
  });
});
