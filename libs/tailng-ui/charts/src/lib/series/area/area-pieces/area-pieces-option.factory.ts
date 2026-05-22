import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_AREA_PIECES_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area"],
  name: "Area Pieces",
  selector: "tng-area-pieces-chart",
  seriesType: "line",
  slug: "area-pieces",
});

export type TngAreaPiecesChartOptionInput = TngCatalogChartOptionInput;

export function createTngAreaPiecesChartOption(input: TngAreaPiecesChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_AREA_PIECES_CHART_PRESET);
}
