import { createTngEchartsThemeOption, createTngEchartsVisualMapThemeOption } from './echarts-theme';
import type { TngChartResolvedTheme } from '../core/chart-theme.types';
import type { TngChartOption } from '../core/chart.types';

type TngOptionRecord = Record<string, unknown>;

function isRecord(value: unknown): value is TngOptionRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionHasVisualMap(option: Readonly<TngOptionRecord>): boolean {
  return (
    Object.prototype.hasOwnProperty.call(option, 'visualMap') && option['visualMap'] !== undefined
  );
}

function mergeOptionValue(base: unknown, override: unknown): unknown {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    const baseItems = base as readonly unknown[];
    const overrideItems = override as readonly unknown[];

    return overrideItems.map((overrideItem, index) => mergeOptionValue(baseItems[index], overrideItem));
  }

  if (isRecord(base) && Array.isArray(override)) {
    const overrideItems = override as readonly unknown[];

    return overrideItems.map((overrideItem) =>
      isRecord(overrideItem) ? mergeOptionRecords(base, overrideItem) : overrideItem,
    );
  }

  if (isRecord(base) && isRecord(override)) {
    return mergeOptionRecords(base, override);
  }

  return override;
}

export function mergeOptionRecords(
  base: Readonly<TngOptionRecord>,
  override: Readonly<TngOptionRecord>,
): TngOptionRecord {
  const merged: TngOptionRecord = { ...base };

  for (const [key, value] of Object.entries(override)) {
    merged[key] = mergeOptionValue(base[key], value);
  }

  return merged;
}
export { createTngEchartsThemeOption };

export function createTngEchartsOption(
  option: TngChartOption,
  theme: TngChartResolvedTheme,
): TngChartOption {
  const optionRecord = option as TngOptionRecord;
  const themeOption = createTngEchartsThemeOption(theme) as TngOptionRecord;
  const themedBaseOption = optionHasVisualMap(optionRecord)
    ? mergeOptionRecords(
        themeOption,
        createTngEchartsVisualMapThemeOption(theme) as TngOptionRecord,
      )
    : themeOption;

  return mergeOptionRecords(themedBaseOption, optionRecord) as TngChartOption;
}
