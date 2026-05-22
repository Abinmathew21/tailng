import { describe, expect, it } from 'vitest';
import { createTngHeatmapChartOption } from './heatmap-option.factory';

describe('createTngHeatmapChartOption', () => {
  it('creates heatmap categories and values', () => {
    const option = createTngHeatmapChartOption({
      data: [
        { day: 'Mon', hour: '9am', value: 4 },
        { day: 'Tue', hour: '10am', value: 8 },
      ],
      legend: false,
      optionOverride: null,
      tooltip: true,
      valueField: 'value',
      visualMap: true,
      xField: 'day',
      yField: 'hour',
    });

    expect(option).toMatchObject({
      xAxis: {
        data: ['Mon', 'Tue'],
      },
      yAxis: {
        data: ['9am', '10am'],
      },
      visualMap: {
        max: 8,
        min: 4,
      },
    });
  });
});
