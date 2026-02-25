import { describe, expect, it } from 'vitest';
import { TngLineChartComponent } from './tng-line-chart.component';

describe('tng-line-chart component', () => {
  it('exports the line chart wrapper component', () => {
    expect(typeof TngLineChartComponent).toBe('function');
  });
});
