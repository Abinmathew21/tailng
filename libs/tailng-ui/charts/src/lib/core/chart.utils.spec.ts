import { describe, expect, it } from 'vitest';
import { applyTngChartOptionOverride } from './chart.utils';

describe('chart utils', () => {
  it('returns the original option when no override is provided', () => {
    const option = { series: [] };

    expect(applyTngChartOptionOverride(option, null)).toBe(option);
  });

  it('wraps optionOverride failures with chart context', () => {
    expect(() =>
      applyTngChartOptionOverride({ series: [] }, () => {
        throw new Error('boom');
      }),
    ).toThrow('Tng chart optionOverride failed: boom');
  });
});
