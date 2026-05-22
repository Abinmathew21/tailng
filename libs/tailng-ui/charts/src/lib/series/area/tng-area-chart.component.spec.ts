import { describe, expect, it } from 'vitest';
import { TngAreaChartComponent } from './tng-area-chart.component';

describe('tng-area-chart component', () => {
  it('exports the area chart component', () => {
    expect(typeof TngAreaChartComponent).toBe('function');
  });
});
