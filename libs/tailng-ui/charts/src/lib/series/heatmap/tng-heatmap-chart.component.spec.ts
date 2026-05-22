import { describe, expect, it } from 'vitest';
import { TngHeatmapChartComponent } from './tng-heatmap-chart.component';

describe('tng-heatmap-chart component', () => {
  it('exports the heatmap chart component', () => {
    expect(typeof TngHeatmapChartComponent).toBe('function');
  });
});
