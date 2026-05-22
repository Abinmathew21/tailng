import { describe, expect, it } from 'vitest';
import { TngPieChartComponent } from './tng-pie-chart.component';

describe('tng-pie-chart component', () => {
  it('exports the pie chart component', () => {
    expect(typeof TngPieChartComponent).toBe('function');
  });
});
