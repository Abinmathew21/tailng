import { describe, expect, it } from 'vitest';
import { TngScatterChartComponent } from './tng-scatter-chart.component';

describe('tng-scatter-chart component', () => {
  it('exports the scatter chart component', () => {
    expect(typeof TngScatterChartComponent).toBe('function');
  });
});
