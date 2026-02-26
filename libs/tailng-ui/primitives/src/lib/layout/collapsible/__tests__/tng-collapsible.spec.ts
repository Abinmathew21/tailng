import { describe, expect, it } from 'vitest';
import {
  TngCollapsible,
  TngCollapsibleContent,
  TngCollapsibleTrigger,
  resolveTngCollapsibleAriaExpanded,
  resolveTngCollapsibleDataState,
} from '../tng-collapsible';

describe('tng-collapsible primitives', () => {
  it('exports collapsible directives', () => {
    expect(typeof TngCollapsible).toBe('function');
    expect(typeof TngCollapsibleTrigger).toBe('function');
    expect(typeof TngCollapsibleContent).toBe('function');
  });

  it('resolves aria/data state', () => {
    expect(resolveTngCollapsibleAriaExpanded(true)).toBe('true');
    expect(resolveTngCollapsibleAriaExpanded(false)).toBe('false');
    expect(resolveTngCollapsibleDataState(true)).toBe('open');
    expect(resolveTngCollapsibleDataState(false)).toBe('closed');
  });
});
