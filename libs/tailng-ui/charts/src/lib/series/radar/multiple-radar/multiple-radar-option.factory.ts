import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MULTIPLE_RADAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Radar",
  coordinateSystem: "radar",
  features: [],
  name: "Multiple Radar",
  selector: "tng-multiple-radar-chart",
  seriesType: "radar",
  slug: "multiple-radar",
});

export type TngMultipleRadarChartOptionInput = TngCatalogChartOptionInput;

export function createTngMultipleRadarChartOption(input: TngMultipleRadarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MULTIPLE_RADAR_CHART_PRESET);
}
