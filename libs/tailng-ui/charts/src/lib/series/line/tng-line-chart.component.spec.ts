import { describe, expect, it } from 'vitest';
import { TngLineChart } from './tng-line-chart.component';

describe('tng-line-chart component', () => {
  it('exports the line chart wrapper component', () => {
    expect(typeof TngLineChart).toBe('function');
  });
});
