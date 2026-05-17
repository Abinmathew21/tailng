import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CUSTOMIZED_RADAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Radar",
  coordinateSystem: "radar",
  features: [],
  name: "Customized Radar",
  selector: "tng-customized-radar-chart",
  seriesType: "radar",
  slug: "customized-radar",
});

export type TngCustomizedRadarChartOptionInput = TngCatalogChartOptionInput;

export function createTngCustomizedRadarChartOption(input: TngCustomizedRadarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CUSTOMIZED_RADAR_CHART_PRESET);
}
