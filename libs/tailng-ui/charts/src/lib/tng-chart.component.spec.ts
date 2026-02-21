import { describe, expect, it } from 'vitest';
import {
  resolveTngChartNotMerge,
  resolveTngChartRenderer,
  shouldAttachTngChartResizeObserver,
  TngChart,
} from './tng-chart.component';

describe('tng-chart component', () => {
  it('exports the chart component', () => {
    expect(typeof TngChart).toBe('function');
  });

  it('normalizes chart renderer input', () => {
    expect(resolveTngChartRenderer('svg')).toBe('svg');
    expect(resolveTngChartRenderer('canvas')).toBe('canvas');
    expect(resolveTngChartRenderer('webgl')).toBe('canvas');
  });

  it('maps merge input into echarts notMerge option', () => {
    expect(resolveTngChartNotMerge(true)).toBe(false);
    expect(resolveTngChartNotMerge(false)).toBe(true);
  });

  it('attaches resize observer only when enabled and supported', () => {
    expect(shouldAttachTngChartResizeObserver(true, true)).toBe(true);
    expect(shouldAttachTngChartResizeObserver(false, true)).toBe(false);
    expect(shouldAttachTngChartResizeObserver(true, false)).toBe(false);
  });
});
