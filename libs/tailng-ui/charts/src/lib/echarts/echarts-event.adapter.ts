import type { TngChartPointEvent } from '../core/chart-event.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../core/chart.tokens';
import type { TngChartDatum } from '../core/chart.types';
import { isTngRecord } from '../core/chart.utils';

function readNullableString(source: Readonly<Record<string, unknown>>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNullableNumber(source: Readonly<Record<string, unknown>>, key: string): number | null {
  const value = source[key];
  return typeof value === 'number' ? value : null;
}

function readDatum(data: unknown): TngChartDatum | null {
  if (!isTngRecord(data)) {
    return null;
  }

  const sourceDatum = data[TNG_CHART_SOURCE_DATUM_KEY];
  return isTngRecord(sourceDatum) ? sourceDatum : data;
}

export function createTngChartPointEvent(nativeEvent: unknown): TngChartPointEvent {
  if (!isTngRecord(nativeEvent)) {
    return {
      datum: null,
      index: null,
      nativeEvent,
      seriesKey: null,
      seriesName: null,
      value: null,
    };
  }

  const data = nativeEvent['data'];

  return {
    datum: readDatum(data),
    index: readNullableNumber(nativeEvent, 'dataIndex'),
    nativeEvent,
    seriesKey: readNullableString(nativeEvent, 'seriesId'),
    seriesName: readNullableString(nativeEvent, 'seriesName'),
    value: nativeEvent['value'] ?? (isTngRecord(data) ? data['value'] : null),
  };
}
