import type {
  TngCatalogChartOptionInput,
  TngCatalogChartPreset,
  TngCatalogCoordinateSystem,
  TngCatalogSeriesType,
} from './catalog-chart.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  createTngChartDataItem,
  getTngChartFieldValue,
  getTngChartNumberValue,
  getTngChartStringValue,
  getTngChartUniqueStrings,
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

function createCartesianOption(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): TngOptionRecord {
  const xField = resolveInputField(input.xField, DEFAULT_X_FIELD);
  const categories = getTngChartUniqueStrings(input.data, xField);
  const xAxisType = hasFeature(preset, 'timeAxis')
    ? 'time'
    : hasFeature(preset, 'logAxis')
      ? 'log'
      : 'category';
  const yAxisType = hasFeature(preset, 'logAxis') ? 'log' : 'value';

  return {
    grid: {
      bottom: hasFeature(preset, 'dataZoom') ? 64 : 24,
      containLabel: true,
      left: 24,
      right: hasFeature(preset, 'multiAxis') ? 56 : 24,
      top: 24,
    },
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

function createBarSeries(
  input: TngCatalogChartOptionInput,
  preset: TngCatalogChartPreset,
): readonly TngOptionRecord[] {
  const yField = resolveInputField(input.yField, DEFAULT_Y_FIELD);

  return [
    {
      coordinateSystem: resolveCoordinateSystem(preset.coordinateSystem),
      data: input.data.map((datum) => createTngChartDataItem(getTngChartNumberValue(datum, yField) ?? 0, datum)),
      large: hasFeature(preset, 'large'),
      name: yField,
      realtimeSort: hasFeature(preset, 'race') || hasFeature(preset, 'sorted'),
      stack: hasFeature(preset, 'stacked') || hasFeature(preset, 'normalized') ? 'total' : undefined,
      type: preset.seriesType,
    },
  ];
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
  const option: TngChartOption = {
    ...createBaseOption(input, preset),
    ...createCoordinateOption(input, preset),
    series: createCatalogSeries(input, preset),
  };

  return applyTngChartOptionOverride(option, input.optionOverride ?? null);
}
