import type { TngChartResolvedTheme } from '../core/chart-theme.types';
import {
  TNG_CHART_CSS_VARIABLES,
  TNG_CHART_DEFAULT_THEME,
} from '../core/chart.tokens';

type TngCssVarGroup = readonly string[];

function readCssVariable(
  style: CSSStyleDeclaration | null,
  names: TngCssVarGroup,
  fallback: string,
): string {
  if (style === null) {
    return fallback;
  }

  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value.length > 0) {
      return value;
    }
  }

  return fallback;
}

function getComputedStyleSafe(element: Element | null | undefined): CSSStyleDeclaration | null {
  if (
    element === null ||
    element === undefined ||
    typeof globalThis.getComputedStyle !== 'function'
  ) {
    return null;
  }

  return globalThis.getComputedStyle(element);
}

function readThemeAccentColors(style: CSSStyleDeclaration | null): Readonly<{
  dangerColor: string;
  infoColor: string;
  primaryColor: string;
  successColor: string;
  warningColor: string;
}> {
  return {
    dangerColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.danger,
      TNG_CHART_DEFAULT_THEME.dangerColor,
    ),
    infoColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.info,
      TNG_CHART_DEFAULT_THEME.infoColor,
    ),
    primaryColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.primary,
      TNG_CHART_DEFAULT_THEME.primaryColor,
    ),
    successColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.success,
      TNG_CHART_DEFAULT_THEME.successColor,
    ),
    warningColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.warning,
      TNG_CHART_DEFAULT_THEME.warningColor,
    ),
  };
}

function readThemeBaseColors(style: CSSStyleDeclaration | null): Readonly<{
  backgroundColor: string;
  borderColor: string;
  foregroundColor: string;
  mutedColor: string;
  surfaceColor: string;
}> {
  return {
    backgroundColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.background,
      TNG_CHART_DEFAULT_THEME.backgroundColor,
    ),
    borderColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.border,
      TNG_CHART_DEFAULT_THEME.borderColor,
    ),
    foregroundColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.foreground,
      TNG_CHART_DEFAULT_THEME.foregroundColor,
    ),
    mutedColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.muted,
      TNG_CHART_DEFAULT_THEME.mutedColor,
    ),
    surfaceColor: readCssVariable(
      style,
      TNG_CHART_CSS_VARIABLES.surface,
      TNG_CHART_DEFAULT_THEME.surfaceColor,
    ),
  };
}

export function resolveTngEchartsTheme(
  element: Element | null | undefined,
): TngChartResolvedTheme {
  const style = getComputedStyleSafe(element);
  const accentColors = readThemeAccentColors(style);
  const baseColors = readThemeBaseColors(style);

  return {
    backgroundColor: baseColors.backgroundColor,
    borderColor: baseColors.borderColor,
    dangerColor: accentColors.dangerColor,
    foregroundColor: baseColors.foregroundColor,
    infoColor: accentColors.infoColor,
    mutedColor: baseColors.mutedColor,
    palette: [
      accentColors.primaryColor,
      accentColors.successColor,
      accentColors.warningColor,
      accentColors.dangerColor,
      accentColors.infoColor,
      '#8b5cf6',
    ],
    primaryColor: accentColors.primaryColor,
    successColor: accentColors.successColor,
    surfaceColor: baseColors.surfaceColor,
    warningColor: accentColors.warningColor,
  };
}
