import type { TngChartLegendItem, TngChartSeries } from './chart-series.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from './chart.tokens';
import type { TngChartData, TngChartDatum, TngChartOption, TngChartOptionOverride } from './chart.types';

export function isTngRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getTngChartFieldValue(datum: TngChartDatum, field: string): unknown {
  return datum[field];
}

export function getTngChartStringValue(datum: TngChartDatum, field: string): string {
  const value = getTngChartFieldValue(datum, field);

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return '';
}

export function getTngChartNumberValue(datum: TngChartDatum, field: string): number | null {
  const value = getTngChartFieldValue(datum, field);

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

export function getTngChartUniqueStrings(data: TngChartData, field: string): readonly string[] {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const datum of data) {
    const value = getTngChartStringValue(datum, field);
    if (!seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }

  return values;
}

export function createTngChartDataItem(
  value: unknown,
  datum: TngChartDatum,
): Readonly<Record<string, unknown>> {
  return {
    [TNG_CHART_SOURCE_DATUM_KEY]: datum,
    value,
  };
}

export function createTngChartSeriesFromField(
  yField: string | null,
  series: readonly TngChartSeries[] | null,
): readonly TngChartSeries[] {
  if (series !== null && series.length > 0) {
    return series;
  }

  if (yField === null || yField.length === 0) {
    return [];
  }

  return [
    {
      key: yField,
      label: yField,
      yField,
    },
  ];
}

export function createTngChartLegendItems(
  series: readonly TngChartSeries[],
  palette: readonly string[],
  hiddenSeries: ReadonlySet<string>,
): readonly TngChartLegendItem[] {
  return series.map((seriesItem, index) => ({
    color: seriesItem.color ?? palette[index % palette.length] ?? null,
    disabled: false,
    hidden: seriesItem.hidden === true || hiddenSeries.has(seriesItem.key),
    key: seriesItem.key,
    label: seriesItem.label ?? seriesItem.key,
  }));
}

export function isTngChartSeriesVisible(
  series: TngChartSeries,
  hiddenSeries: ReadonlySet<string>,
): boolean {
  return series.hidden !== true && !hiddenSeries.has(series.key);
}

export function resolveTngChartHeight(height: number | string): string {
  return typeof height === 'number' ? `${height}px` : height;
}

export function resolveTngChartSeriesValueField(series: TngChartSeries): string {
  return series.yField ?? series.valueField ?? series.key;
}

export function requireTngChartField(
  field: string,
  fieldName: string,
  chartName: string,
): string {
  if (field.trim().length > 0) {
    return field;
  }

  throw new Error(`tng-${chartName}-chart requires ${fieldName}.`);
}

export function applyTngChartOptionOverride(
  option: TngChartOption,
  optionOverride: TngChartOptionOverride | null,
): TngChartOption {
  if (optionOverride === null) {
    return option;
  }

  try {
    return optionOverride(option);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown option override error.';
    throw new Error(`Tng chart optionOverride failed: ${message}`);
  }
}
