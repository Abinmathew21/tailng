import type { TngChartResolvedTheme } from './chart-theme.types';
import {
  TNG_CHART_CSS_VARIABLES,
  TNG_CHART_DEFAULT_THEME,
} from './chart.tokens';
import {
  getTngChartComputedStyle,
  readTngChartCssVariable,
} from './read-chart-css-vars';

type TngChartAccentColors = Readonly<{
  dangerColor: string;
  infoColor: string;
  primaryColor: string;
  successColor: string;
  warningColor: string;
}>;

type TngChartBaseColors = Readonly<{
  backgroundColor: string;
  borderColor: string;
  foregroundColor: string;
  mutedColor: string;
  surfaceColor: string;
}>;

type TngChartDerivedColors = Readonly<{
  axisLabelColor: string;
  axisLineColor: string;
  gridLineColor: string;
  heatmapHighColor: string;
  heatmapLowColor: string;
  heatmapMidColor: string;
  tooltipBackgroundColor: string;
  tooltipBorderColor: string;
}>;

type TngChartCssVariableKey = keyof typeof TNG_CHART_CSS_VARIABLES;

function readThemeColor(
  style: CSSStyleDeclaration | null,
  key: TngChartCssVariableKey,
  fallback: string,
): string {
  return readTngChartCssVariable(style, TNG_CHART_CSS_VARIABLES[key], fallback);
}

function readThemeAccentColors(style: CSSStyleDeclaration | null): TngChartAccentColors {
  return {
    dangerColor: readThemeColor(style, 'danger', TNG_CHART_DEFAULT_THEME.dangerColor),
    infoColor: readThemeColor(style, 'info', TNG_CHART_DEFAULT_THEME.infoColor),
    primaryColor: readThemeColor(style, 'primary', TNG_CHART_DEFAULT_THEME.primaryColor),
    successColor: readThemeColor(style, 'success', TNG_CHART_DEFAULT_THEME.successColor),
    warningColor: readThemeColor(style, 'warning', TNG_CHART_DEFAULT_THEME.warningColor),
  };
}

function readThemeBaseColors(style: CSSStyleDeclaration | null): TngChartBaseColors {
  return {
    backgroundColor: readThemeColor(style, 'background', TNG_CHART_DEFAULT_THEME.backgroundColor),
    borderColor: readThemeColor(style, 'border', TNG_CHART_DEFAULT_THEME.borderColor),
    foregroundColor: readThemeColor(style, 'foreground', TNG_CHART_DEFAULT_THEME.foregroundColor),
    mutedColor: readThemeColor(style, 'muted', TNG_CHART_DEFAULT_THEME.mutedColor),
    surfaceColor: readThemeColor(style, 'surface', TNG_CHART_DEFAULT_THEME.surfaceColor),
  };
}

function readThemeDerivedColors(style: CSSStyleDeclaration | null): TngChartDerivedColors {
  return {
    axisLabelColor: readThemeColor(style, 'axisLabel', TNG_CHART_DEFAULT_THEME.axisLabelColor),
    axisLineColor: readThemeColor(style, 'axisLine', TNG_CHART_DEFAULT_THEME.axisLineColor),
    gridLineColor: readThemeColor(style, 'gridLine', TNG_CHART_DEFAULT_THEME.gridLineColor),
    heatmapHighColor: readThemeColor(style, 'heatmapHigh', TNG_CHART_DEFAULT_THEME.heatmapHighColor),
    heatmapLowColor: readThemeColor(style, 'heatmapLow', TNG_CHART_DEFAULT_THEME.heatmapLowColor),
    heatmapMidColor: readThemeColor(style, 'heatmapMid', TNG_CHART_DEFAULT_THEME.heatmapMidColor),
    tooltipBackgroundColor: readThemeColor(
      style,
      'tooltipBackground',
      TNG_CHART_DEFAULT_THEME.tooltipBackgroundColor,
    ),
    tooltipBorderColor: readThemeColor(
      style,
      'tooltipBorder',
      TNG_CHART_DEFAULT_THEME.tooltipBorderColor,
    ),
  };
}

function readThemePalette(
  style: CSSStyleDeclaration | null,
  accentColors: TngChartAccentColors,
): readonly string[] {
  return [
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series1,
      TNG_CHART_DEFAULT_THEME.palette[0] ?? accentColors.primaryColor,
    ),
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series2,
      TNG_CHART_DEFAULT_THEME.palette[1] ?? accentColors.successColor,
    ),
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series3,
      TNG_CHART_DEFAULT_THEME.palette[2] ?? accentColors.warningColor,
    ),
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series4,
      TNG_CHART_DEFAULT_THEME.palette[3] ?? accentColors.dangerColor,
    ),
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series5,
      TNG_CHART_DEFAULT_THEME.palette[4] ?? accentColors.infoColor,
    ),
    readTngChartCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.series6,
      TNG_CHART_DEFAULT_THEME.palette[5] ?? accentColors.primaryColor,
    ),
  ];
}

export function resolveTngChartTheme(element: Element | null | undefined): TngChartResolvedTheme {
  const style = getTngChartComputedStyle(element);
  const accentColors = readThemeAccentColors(style);
  const baseColors = readThemeBaseColors(style);
  const derivedColors = readThemeDerivedColors(style);

  return {
    axisLabelColor: derivedColors.axisLabelColor,
    axisLineColor: derivedColors.axisLineColor,
    backgroundColor: baseColors.backgroundColor,
    borderColor: baseColors.borderColor,
    dangerColor: accentColors.dangerColor,
    foregroundColor: baseColors.foregroundColor,
    gridLineColor: derivedColors.gridLineColor,
    heatmapHighColor: derivedColors.heatmapHighColor,
    heatmapLowColor: derivedColors.heatmapLowColor,
    heatmapMidColor: derivedColors.heatmapMidColor,
    infoColor: accentColors.infoColor,
    mutedColor: baseColors.mutedColor,
    mutedTextColor: baseColors.mutedColor,
    palette: readThemePalette(style, accentColors),
    primaryColor: accentColors.primaryColor,
    successColor: accentColors.successColor,
    surfaceColor: baseColors.surfaceColor,
    textColor: baseColors.foregroundColor,
    tooltipBackgroundColor: derivedColors.tooltipBackgroundColor,
    tooltipBorderColor: derivedColors.tooltipBorderColor,
    warningColor: accentColors.warningColor,
  };
}
