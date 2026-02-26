import { describe, expect, it } from 'vitest';
import {
  resolveTngTooltipAriaDescribedBy,
  resolveTngTooltipDataState,
  resolveTngTooltipHidden,
  TngTooltipContent,
  TngTooltipTrigger,
} from '../tng-tooltip';

describe('tng-tooltip primitive helpers', () => {
  it('exports tooltip trigger and content primitives', () => {
    expect(typeof TngTooltipTrigger).toBe('function');
    expect(typeof TngTooltipContent).toBe('function');
  });

  it('maps open state to attributes', () => {
    expect(resolveTngTooltipDataState(true)).toBe('open');
    expect(resolveTngTooltipDataState(false)).toBe('closed');
    expect(resolveTngTooltipHidden(true)).toBeNull();
    expect(resolveTngTooltipHidden(false)).toBe('');
  });

  it('resolves aria-describedby only when open and id is valid', () => {
    expect(resolveTngTooltipAriaDescribedBy(false, 'tip-1')).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, null)).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, '  ')).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, 'tip-1')).toBe('tip-1');
  });
});
