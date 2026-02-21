import { describe, expect, it } from 'vitest';
import {
  normalizeTngTooltipDelay,
  shouldCloseTngTooltipForKey,
  TngTooltip,
} from './tng-tooltip.component';

describe('tng-tooltip component', () => {
  it('exports the tooltip component', () => {
    expect(typeof TngTooltip).toBe('function');
  });

  it('normalizes invalid delay values', () => {
    expect(normalizeTngTooltipDelay(-1)).toBe(0);
    expect(normalizeTngTooltipDelay(Number.NaN)).toBe(0);
    expect(normalizeTngTooltipDelay(125)).toBe(125);
  });

  it('closes on escape key only', () => {
    expect(shouldCloseTngTooltipForKey('Escape')).toBe(true);
    expect(shouldCloseTngTooltipForKey('Enter')).toBe(false);
  });
});
