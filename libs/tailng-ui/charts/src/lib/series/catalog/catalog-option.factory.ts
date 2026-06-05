import type {
  TngCatalogChartOptionInput,
  TngCatalogChartPreset,
  TngCatalogCoordinateSystem,
  TngCatalogSeriesType,
} from './catalog-chart.types';
import type { TngChartSeries } from '../../core/chart-series.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  createTngChartDataItem,
  createTngChartSeriesFromField,
  getTngChartFieldValue,
  getTngChartNumberValue,
  getTngChartStringValue,
  getTngChartUniqueStrings,
  isTngChartSeriesVisible,
  resolveTngChartSeriesValueField,
} from '../../core/chart.utils';

type TngOptionRecord = Record<string, unknown>;
type TngCatalogSeriesCreator = (
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
) => readonly TngOptionRecord[];

const DEFAULT_X_FIELD = 'x';
const DEFAULT_Y_FIELD = 'y';
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_NAME_FIELD = 'name';
const DEFAULT_CATEGORY_FIELD = 'category';
const DEFAULT_SOURCE_FIELD = 'source';
const DEFAULT_TARGET_FIELD = 'target';

export function defineTngCatalogChartPreset(
  preset: TngCatalogChartPreset,
): TngCatalogChartPreset {
  return preset;
}

function hasFeature(preset: TngCatalogChartPreset, feature: string): boolean {
  return preset.features.includes(feature as never);
}

function resolveInputField(value: string | null | undefined, fallback: string): string {
  return value !== null && value !== undefined && value.trim().length > 0 ? value : fallback;
}

function resolveCoordinateSystem(coordinateSystem: TngCatalogCoordinateSystem): string | undefined {
  return coordinateSystem === 'none' ? undefined : coordinateSystem;
}

function createBaseOption(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): TngOptionRecord {
  const tooltip = input.tooltip !== false;

  return {
    legend: {
      show: input.legend !== false,
      type: hasFeature(preset, 'scrollLegend') ? 'scroll' : 'plain',
    },
    title: {
      show: false,
    },
    tooltip: tooltip
      ? {
          trigger: preset.seriesType === 'line' || preset.seriesType === 'bar' ? 'axis' : 'item',
        }
      : {
          show: false,
        },
  };
}

function createAxisOption(
  type: string,
  data?: readonly string[],
): Readonly<Record<string, unknown>> {
  return data === undefined
    ? { type }
    : {
        data,
        type,
      };
}

function createValueAxisOption(
  values: readonly number[],
): Readonly<Record<string, unknown>> {
  if (values.length === 0) {
    return createAxisOption('value');
  }

  const range = createValueRange(values);
  const span = range.max - range.min;
  const padding = span === 0 ? Math.max(Math.abs(range.max) * 0.1, 1) : span * 0.08;

  return {
    max: range.max + padding,
    min: range.min - padding,
    type: 'value',
  };
}

function createValueRange(values: readonly number[]): Readonly<{ max: number; min: number }> {
  if (values.length === 0) {
    return { max: 0, min: 0 };
  }

  return {
    max: Math.max(...values),
    min: Math.min(...values),
  };
}

function resolveCartesianGridBottom(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): number {
  const hasDataZoom = hasFeature(preset, 'dataZoom');
  const hasLegend = input.legend !== false;

  if (hasDataZoom && hasLegend) {
    return 96;
  }

  if (hasDataZoom) {
    return 64;
  }

  return hasLegend ? 72 : 24;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readCoordinatePair(value: unknown): readonly [number, number] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const x = toFiniteNumber(value[0]);
  const y = toFiniteNumber(value[1]);

  return x === null || y === null ? null : [x, y];
}

function createLinesCartesianAxes(input: TngCatalogChartOptionInput): TngOptionRecord {
  const sourceField = resolveInputField(input.sourceField, DEFAULT_SOURCE_FIELD);
  const targetField = resolveInputField(input.targetField, DEFAULT_TARGET_FIELD);
  const xValues: number[] = [];
  const yValues: number[] = [];

  for (const datum of input.data) {
    const source = readCoordinatePair(getTngChartFieldValue(datum, sourceField));
    const target = readCoordinatePair(getTngChartFieldValue(datum, targetField));

    if (source !== null) {
      xValues.push(source[0]);
      yValues.push(source[1]);
    }

    if (target !== null) {
      xValues.push(target[0]);
      yValues.push(target[1]);
    }
  }

  return {
    xAxis: createValueAxisOption(xValues),
    yAxis: createValueAxisOption(yValues),
  };
}

function createVisualMapOption(
  discrete: boolean,
  enabled: boolean,
  values: readonly number[],
): TngOptionRecord {
  if (!enabled) {
    return {};
  }

  const range = createValueRange(values);

  return {
    visualMap: {
      calculable: !discrete,
      max: range.max,
      min: range.min,
      type: discrete ? 'piecewise' : 'continuous',
    },
  };
}

function createCartesianOption(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): TngOptionRecord {
  const grid = {
    bottom: resolveCartesianGridBottom(input, preset),
    containLabel: true,
    left: 24,
    right: hasFeature(preset, 'multiAxis') ? 56 : 24,
    top: 24,
  };

  // Lines series on a cartesian coordinate system use value axes, not category.
  if (preset.seriesType === 'lines') {
    return { grid, ...createLinesCartesianAxes(input) };
  }

  const xField = resolveInputField(input.xField, DEFAULT_X_FIELD);
  const categories = getTngChartUniqueStrings(input.data, xField);
  const xAxisType = hasFeature(preset, 'timeAxis')
    ? 'time'
    : hasFeature(preset, 'logAxis')
      ? 'log'
      : 'category';
  const yAxisType = hasFeature(preset, 'logAxis') ? 'log' : 'value';

  return {
    grid,
    xAxis: createAxisOption(xAxisType, xAxisType === 'category' ? categories : undefined),
    yAxis: createAxisOption(yAxisType),
  };
}

function createPolarOption(): TngOptionRecord {
  return {
    angleAxis: {
      type: 'category',
    },
    polar: {},
    radiusAxis: {},
  };
}

function createCalendarOption(input: TngCatalogChartOptionInput): TngOptionRecord {
  const xField = resolveInputField(input.xField, DEFAULT_X_FIELD);
  const values = input.data.map((datum) => getTngChartStringValue(datum, xField)).filter(Boolean);

  return {
    calendar: {
      cellSize: ['auto', 18],
      range: values.length > 0 ? values : undefined,
    },
    visualMap: {
      show: false,
    },
  };
}

function createGeoOption(): TngOptionRecord {
  return {
    geo: {
      map: 'world',
      roam: true,
    },
  };
}

function createMatrixOption(): TngOptionRecord {
  return {
    matrix: {
      left: 48,
      right: 24,
      top: 24,
    },
  };
}

function createCoordinateOption(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): TngOptionRecord {
  if (preset.coordinateSystem === 'calendar') {
    return createCalendarOption(input);
  }

  if (preset.coordinateSystem === 'geo') {
    return createGeoOption();
  }

  if (preset.coordinateSystem === 'matrix') {
    return createMatrixOption();
  }

  if (preset.coordinateSystem === 'polar') {
    return createPolarOption();
  }

  if (preset.coordinateSystem === 'cartesian2d') {
    return createCartesianOption(input, preset);
  }

  return {};
}

function createLineOrAreaSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const yField = resolveInputField(input.yField, DEFAULT_Y_FIELD);

  return [
    {
      areaStyle: hasFeature(preset, 'area') ? {} : undefined,
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => createTngChartDataItem(getTngChartNumberValue(datum, yField) ?? 0, datum)),
      large: hasFeature(preset, 'large'),
      markLine: hasFeature(preset, 'markLine') ? { data: [{ type: 'average' }] } : undefined,
      name: yField,
      sampling: hasFeature(preset, 'large') ? 'lttb' : undefined,
      smooth: hasFeature(preset, 'smooth'),
      stack: hasFeature(preset, 'stacked') ? 'total' : undefined,
      step: hasFeature(preset, 'step') ? 'middle' : false,
      type: 'line',
    },
  ];
}

function createBarSeriesItem(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
  series: TngChartSeries,
): TngOptionRecord {
  const yField = resolveTngChartSeriesValueField(series);

  return {
    coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
    data: input.data.map((datum) => createTngChartDataItem(getTngChartNumberValue(datum, yField) ?? 0, datum)),
    id: series.key,
    itemStyle:
      series.color === null || series.color === undefined
        ? undefined
        : {
            color: series.color,
          },
    large: hasFeature(preset, 'large'),
    name: series.label ?? series.key,
    realtimeSort: hasFeature(preset, 'race') || hasFeature(preset, 'sorted'),
    stack: hasFeature(preset, 'stacked') || hasFeature(preset, 'normalized') ? series.stack ?? 'total' : undefined,
    type: preset.seriesType,
  };
}

function createBarSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const yField = resolveInputField(input.yField, DEFAULT_Y_FIELD);
  const hiddenSeries = input.hiddenSeries ?? new Set<string>();

  return createTngChartSeriesFromField(yField, input.series ?? null)
    .filter((series) => isTngChartSeriesVisible(series, hiddenSeries))
    .map((series) => createBarSeriesItem(input, preset, series));
}

function createPieLikeSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const nameField = resolveInputField(input.nameField, DEFAULT_NAME_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);

  return [
    {
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        name: getTngChartStringValue(datum, nameField),
        value: getTngChartNumberValue(datum, valueField) ?? 0,
      })),
      radius: hasFeature(preset, 'half') || hasFeature(preset, 'ring') || preset.name.includes('Donut')
        ? ['45%', '70%']
        : hasFeature(preset, 'nightingale')
          ? ['20%', '70%']
          : '70%',
      roseType: hasFeature(preset, 'nightingale') ? 'radius' : undefined,
      startAngle: hasFeature(preset, 'half') ? 180 : 90,
      type: preset.seriesType,
    },
  ];
}

function createScatterSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const xField = resolveInputField(input.xField, DEFAULT_X_FIELD);
  const yField = resolveInputField(input.yField, DEFAULT_Y_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);

  return [
    {
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        value: [
          getTngChartNumberValue(datum, xField) ?? getTngChartStringValue(datum, xField),
          getTngChartNumberValue(datum, yField) ?? 0,
          getTngChartNumberValue(datum, valueField) ?? undefined,
        ],
      })),
      large: hasFeature(preset, 'large'),
      symbolSize: hasFeature(preset, 'matrix') ? 8 : hasFeature(preset, 'effect') ? 10 : undefined,
      type: preset.seriesType,
    },
  ];
}

function createHeatmapSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const xField = resolveInputField(input.xField, DEFAULT_X_FIELD);
  const yField = resolveInputField(input.yField, DEFAULT_Y_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);
  const xCategories = getTngChartUniqueStrings(input.data, xField);
  const yCategories = getTngChartUniqueStrings(input.data, yField);

  return [
    {
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        value: [
          xCategories.indexOf(getTngChartStringValue(datum, xField)),
          yCategories.indexOf(getTngChartStringValue(datum, yField)),
          getTngChartNumberValue(datum, valueField) ?? 0,
        ],
      })),
      progressive: hasFeature(preset, 'large') ? 400 : undefined,
      type: 'heatmap',
    },
  ];
}

function createNodeLinkSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const sourceField = resolveInputField(input.sourceField, DEFAULT_SOURCE_FIELD);
  const targetField = resolveInputField(input.targetField, DEFAULT_TARGET_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);
  const names = Array.from(
    new Set(
      input.data.flatMap((datum) => [
        getTngChartStringValue(datum, sourceField),
        getTngChartStringValue(datum, targetField),
      ]),
    ),
  ).filter(Boolean);

  return [
    {
      data: names.map((name) => ({ name })),
      edges: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        source: getTngChartStringValue(datum, sourceField),
        target: getTngChartStringValue(datum, targetField),
        value: getTngChartNumberValue(datum, valueField) ?? 1,
      })),
      layout: hasFeature(preset, 'force') ? 'force' : 'none',
      links: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        source: getTngChartStringValue(datum, sourceField),
        target: getTngChartStringValue(datum, targetField),
        value: getTngChartNumberValue(datum, valueField) ?? 1,
      })),
      orient: hasFeature(preset, 'vertical') ? 'vertical' : 'horizontal',
      type: preset.seriesType,
    },
  ];
}

function createGaugeSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const nameField = resolveInputField(input.nameField, DEFAULT_NAME_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);
  const datum = input.data[0] ?? {};

  return [
    {
      data: [
        {
          [TNG_CHART_SOURCE_DATUM_KEY]: datum,
          name: getTngChartStringValue(datum, nameField),
          value: getTngChartNumberValue(datum, valueField) ?? 0,
        },
      ],
      progress: hasFeature(preset, 'progress') || hasFeature(preset, 'ring') ? { show: true } : undefined,
      type: 'gauge',
    },
  ];
}

function createValueArraySeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);

  return [
    {
      data: input.data.map((datum) => {
        const value = getTngChartFieldValue(datum, valueField);
        return createTngChartDataItem(Array.isArray(value) ? value : [0, 0, 0, 0], datum);
      }),
      large: hasFeature(preset, 'large'),
      type: preset.seriesType,
    },
  ];
}

function createHierarchySeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const nameField = resolveInputField(input.nameField, DEFAULT_NAME_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);

  return [
    {
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        name: getTngChartStringValue(datum, nameField),
        value: getTngChartNumberValue(datum, valueField) ?? 0,
      })),
      orient: hasFeature(preset, 'vertical') ? 'vertical' : undefined,
      radius: hasFeature(preset, 'radial') ? ['20%', '80%'] : undefined,
      type: preset.seriesType,
    },
  ];
}

function createLinesSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const sourceField = resolveInputField(input.sourceField, DEFAULT_SOURCE_FIELD);
  const targetField = resolveInputField(input.targetField, DEFAULT_TARGET_FIELD);
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);

  return [
    {
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        coords: [
          getTngChartFieldValue(datum, sourceField),
          getTngChartFieldValue(datum, targetField),
        ],
        value: getTngChartNumberValue(datum, valueField) ?? undefined,
      })),
      large: hasFeature(preset, 'large'),
      progressive: hasFeature(preset, 'large') ? 1000 : undefined,
      type: 'lines',
    },
  ];
}

function createDefaultSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const valueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);
  const categoryField = resolveInputField(input.categoryField, DEFAULT_CATEGORY_FIELD);

  return [
    {
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        name: getTngChartStringValue(datum, categoryField),
        value: getTngChartNumberValue(datum, valueField) ?? 0,
      })),
      type: preset.seriesType,
    },
  ];
}

const seriesCreators: Readonly<Partial<Record<TngCatalogSeriesType, TngCatalogSeriesCreator>>> = {
  bar: createBarSeries,
  boxplot: createValueArraySeries,
  candlestick: createValueArraySeries,
  chord: createNodeLinkSeries,
  effectScatter: createScatterSeries,
  funnel: createPieLikeSeries,
  gauge: createGaugeSeries,
  graph: createNodeLinkSeries,
  heatmap: createHeatmapSeries,
  line: createLineOrAreaSeries,
  lines: createLinesSeries,
  pictorialBar: createBarSeries,
  pie: createPieLikeSeries,
  sankey: createNodeLinkSeries,
  scatter: createScatterSeries,
  sunburst: createHierarchySeries,
  tree: createHierarchySeries,
  treemap: createHierarchySeries,
};

function createCatalogSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  return (seriesCreators[preset.seriesType] ?? createDefaultSeries)(input, preset);
}

export function createTngCatalogChartOption(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): TngChartOption {
  const discreteVisualMap = hasFeature(preset, 'discreteVisualMap');
  const visualMapEnabled = discreteVisualMap || hasFeature(preset, 'visualMap');
  const visualMapValueField = resolveInputField(input.valueField, DEFAULT_VALUE_FIELD);
  const visualMapValues = visualMapEnabled
    ? input.data
        .map((datum) => getTngChartNumberValue(datum, visualMapValueField))
        .filter((value): value is number => value !== null)
    : [];
  const option: TngChartOption = {
    ...createBaseOption(input, preset),
    ...createCoordinateOption(input, preset),
    ...createVisualMapOption(discreteVisualMap, visualMapEnabled, visualMapValues),
    series: createCatalogSeries(input, preset),
  };

  return applyTngChartOptionOverride(option, input.optionOverride ?? null);
}
