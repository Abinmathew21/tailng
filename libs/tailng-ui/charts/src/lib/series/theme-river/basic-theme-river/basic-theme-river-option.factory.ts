import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_THEME_RIVER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "ThemeRiver",
  coordinateSystem: "none",
  features: [],
  name: "Basic ThemeRiver",
  selector: "tng-basic-theme-river-chart",
  seriesType: "themeRiver",
  slug: "basic-theme-river",
});

export type TngBasicThemeRiverChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicThemeRiverChartOption(input: TngBasicThemeRiverChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_THEME_RIVER_CHART_PRESET);
}
