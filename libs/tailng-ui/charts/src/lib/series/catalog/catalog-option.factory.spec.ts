import { describe, expect, it } from 'vitest';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from './catalog-option.factory';

const stackedBarPreset = defineTngCatalogChartPreset({
  category: 'Bar',
  coordinateSystem: 'cartesian2d',
  features: ['stacked'],
  name: 'Stacked Bar',
  selector: 'tng-stacked-bar-chart',
  seriesType: 'bar',
  slug: 'stacked-bar',
});

const visualMapPreset = defineTngCatalogChartPreset({
  category: 'Sunburst',
  coordinateSystem: 'none',
  features: ['visualMap'],
  name: 'VisualMap Sunburst',
  selector: 'tng-visual-map-sunburst-chart',
  seriesType: 'sunburst',
  slug: 'visual-map-sunburst',
});

const discreteVisualMapPreset = defineTngCatalogChartPreset({
  category: 'Heatmap',
  coordinateSystem: 'cartesian2d',
  features: ['discreteVisualMap'],
  name: 'Discrete Color Heatmap',
  selector: 'tng-discrete-color-heatmap-chart',
  seriesType: 'heatmap',
  slug: 'discrete-color-heatmap',
});

describe('createTngCatalogChartOption', () => {
  it('does not create visualMap for catalog charts without a visualMap feature', () => {
    const option = createTngCatalogChartOption(
      {
        data: [
          { label: 'North', value: 26 },
          { label: 'West', value: 34 },
        ],
        xField: 'label',
        yField: 'value',
      },
      stackedBarPreset,
    ) as Readonly<Record<string, unknown>>;

    expect(option['visualMap']).toBeUndefined();
  });

  it('creates stacked bar series from series metadata', () => {
    const option = createTngCatalogChartOption(
      {
        data: [
          { label: 'North', services: 14, subscriptions: 26 },
          { label: 'West', services: 18, subscriptions: 34 },
        ],
        series: [
          { key: 'subscriptions', label: 'Subscriptions', yField: 'subscriptions' },
          { key: 'services', label: 'Services', yField: 'services' },
        ],
        xField: 'label',
      },
      stackedBarPreset,
    ) as Readonly<Record<string, unknown>>;
    const series = option['series'] as readonly Readonly<Record<string, unknown>>[];
    const grid = option['grid'] as Readonly<Record<string, unknown>>;

    expect(grid['bottom']).toBe(72);
    expect(series).toHaveLength(2);
    expect(series[0]).toMatchObject({
      id: 'subscriptions',
      name: 'Subscriptions',
      stack: 'total',
      type: 'bar',
    });
    expect(series[1]).toMatchObject({
      id: 'services',
      name: 'Services',
      stack: 'total',
      type: 'bar',
    });
  });

  it('creates a ranged visualMap for visualMap catalog presets', () => {
    const option = createTngCatalogChartOption(
      {
        data: [
          { name: 'Core', value: 8 },
          { name: 'Edge', value: 21 },
        ],
        nameField: 'name',
        valueField: 'value',
      },
      visualMapPreset,
    ) as Readonly<Record<string, unknown>>;
    const visualMap = option['visualMap'] as Readonly<Record<string, unknown>>;

    expect(visualMap).toMatchObject({
      calculable: true,
      max: 21,
      min: 8,
      type: 'continuous',
    });
  });

  it('uses piecewise visualMap for discrete visualMap catalog presets', () => {
    const option = createTngCatalogChartOption(
      {
        data: [
          { label: 'North', product: 'A', value: 2 },
          { label: 'West', product: 'B', value: 5 },
        ],
        valueField: 'value',
        xField: 'label',
        yField: 'product',
      },
      discreteVisualMapPreset,
    ) as Readonly<Record<string, unknown>>;
    const visualMap = option['visualMap'] as Readonly<Record<string, unknown>>;

    expect(visualMap).toMatchObject({
      calculable: false,
      max: 5,
      min: 2,
      type: 'piecewise',
    });
  });
});
