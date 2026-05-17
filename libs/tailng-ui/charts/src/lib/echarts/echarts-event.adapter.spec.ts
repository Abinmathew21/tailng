import { describe, expect, it } from 'vitest';
import { createTngChartPointEvent } from './echarts-event.adapter';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../core/chart.tokens';

describe('createTngChartPointEvent', () => {
  it('normalizes ECharts point events', () => {
    const datum = { country: 'India', value: 10 };
    const event = createTngChartPointEvent({
      data: {
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        value: 10,
      },
      dataIndex: 2,
      seriesId: 'population',
      seriesName: 'Population',
    });

    expect(event.datum).toEqual(datum);
    expect(event.index).toBe(2);
    expect(event.seriesKey).toBe('population');
    expect(event.seriesName).toBe('Population');
    expect(event.value).toBe(10);
  });
});
