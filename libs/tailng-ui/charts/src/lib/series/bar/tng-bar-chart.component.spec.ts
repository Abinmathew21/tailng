import { describe, expect, it } from 'vitest';
import { TngBarChartComponent } from './tng-bar-chart.component';

describe('tng-bar-chart component', () => {
  it('exports the bar chart wrapper component', () => {
    expect(typeof TngBarChartComponent).toBe('function');
  });
});
