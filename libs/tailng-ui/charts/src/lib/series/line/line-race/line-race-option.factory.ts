import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LINE_RACE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["race"],
  name: "Line Race",
  selector: "tng-line-race-chart",
  seriesType: "line",
  slug: "line-race",
});

export type TngLineRaceChartOptionInput = TngCatalogChartOptionInput;

export function createTngLineRaceChartOption(input: TngLineRaceChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LINE_RACE_CHART_PRESET);
}
