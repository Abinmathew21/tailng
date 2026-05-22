import type { TngChartResolvedTheme } from '../core/chart-theme.types';
import type { TngChartOption } from '../core/chart.types';

function createTngAxisThemeOption(theme: TngChartResolvedTheme): Readonly<Record<string, unknown>> {
  return {
    axisLabel: {
      color: theme.axisLabelColor,
    },
    axisLine: {
      lineStyle: {
        color: theme.axisLineColor,
      },
    },
    axisTick: {
      lineStyle: {
        color: theme.axisLineColor,
      },
    },
    splitLine: {
      lineStyle: {
        color: theme.gridLineColor,
      },
    },
  };
}

function createTngTooltipThemeOption(theme: TngChartResolvedTheme): Readonly<Record<string, unknown>> {
  return {
    backgroundColor: theme.tooltipBackgroundColor,
    borderColor: theme.tooltipBorderColor,
    textStyle: {
      color: theme.textColor,
    },
  };
}

export function createTngEchartsThemeOption(theme: TngChartResolvedTheme): TngChartOption {
  return {
    backgroundColor: 'transparent',
    color: [...theme.palette],
    legend: {
      textStyle: {
        color: theme.mutedTextColor,
      },
    },
    textStyle: {
      color: theme.textColor,
      fontFamily: 'inherit',
    },
    title: {
      subtextStyle: {
        color: theme.mutedTextColor,
      },
      textStyle: {
        color: theme.textColor,
      },
    },
    tooltip: createTngTooltipThemeOption(theme),
    xAxis: createTngAxisThemeOption(theme),
    yAxis: createTngAxisThemeOption(theme),
  } as TngChartOption;
}

export function createTngEchartsVisualMapThemeOption(theme: TngChartResolvedTheme): TngChartOption {
  return {
    visualMap: {
      inRange: {
        color: [theme.heatmapLowColor, theme.heatmapMidColor, theme.heatmapHighColor],
      },
      textStyle: {
        color: theme.mutedTextColor,
      },
    },
  } as TngChartOption;
}
