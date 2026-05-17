import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_RADAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Radar",
  coordinateSystem: "radar",
  features: [],
  name: "Basic Radar",
  selector: "tng-basic-radar-chart",
  seriesType: "radar",
  slug: "basic-radar",
});

export type TngBasicRadarChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicRadarChartOption(input: TngBasicRadarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_RADAR_CHART_PRESET);
}
