import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_HEXAGONAL_BINNING_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Hexagonal Binning",
  selector: "tng-hexagonal-binning-chart",
  seriesType: "custom",
  slug: "hexagonal-binning",
});

export type TngHexagonalBinningChartOptionInput = TngCatalogChartOptionInput;

export function createTngHexagonalBinningChartOption(input: TngHexagonalBinningChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_HEXAGONAL_BINNING_CHART_PRESET);
}
