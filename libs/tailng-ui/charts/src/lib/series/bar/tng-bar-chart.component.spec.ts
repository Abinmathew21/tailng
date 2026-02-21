import { describe, expect, it } from 'vitest';
import { TngBarChart } from './tng-bar-chart.component';

describe('tng-bar-chart component', () => {
  it('exports the bar chart wrapper component', () => {
    expect(typeof TngBarChart).toBe('function');
  });
});
