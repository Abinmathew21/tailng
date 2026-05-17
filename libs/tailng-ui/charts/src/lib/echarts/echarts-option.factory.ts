import type { TngChartResolvedTheme } from '../core/chart-theme.types';
import type { TngChartOption } from '../core/chart.types';

type TngOptionRecord = Record<string, unknown>;

function isRecord(value: unknown): value is TngOptionRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeOptionValue(base: unknown, override: unknown): unknown {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    return override.map((overrideItem, index) => mergeOptionValue(base[index], overrideItem));
  }

  if (isRecord(base) && isRecord(override)) {
    return mergeOptionRecords(base, override);
  }

  return override;
}

function createTngAxisThemeOption(theme: TngChartResolvedTheme): Readonly<Record<string, unknown>> {
  return {
    axisLabel: {
      color: theme.mutedColor,
    },
    axisLine: {
      lineStyle: {
        color: theme.borderColor,
      },
    },
    splitLine: {
      lineStyle: {
        color: theme.borderColor,
      },
    },
  };
}

function createTngTooltipThemeOption(theme: TngChartResolvedTheme): Readonly<Record<string, unknown>> {
  return {
    backgroundColor: theme.surfaceColor,
    borderColor: theme.borderColor,
    textStyle: {
      color: theme.foregroundColor,
    },
  };
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

export function createTngEchartsThemeOption(theme: TngChartResolvedTheme): TngChartOption {
  return {
    backgroundColor: 'transparent',
    color: [...theme.palette],
    textStyle: {
      color: theme.foregroundColor,
      fontFamily: 'inherit',
    },
    tooltip: createTngTooltipThemeOption(theme),
    visualMap: {
      inRange: {
        color: [theme.surfaceColor, theme.infoColor, theme.primaryColor],
      },
      textStyle: {
        color: theme.mutedColor,
      },
    },
    xAxis: createTngAxisThemeOption(theme),
    yAxis: createTngAxisThemeOption(theme),
  } as TngChartOption;
}

export function createTngEchartsOption(
  option: TngChartOption,
  theme: TngChartResolvedTheme,
): TngChartOption {
  return mergeOptionRecords(
    createTngEchartsThemeOption(theme) as TngOptionRecord,
    option as TngOptionRecord,
  ) as TngChartOption;
}
