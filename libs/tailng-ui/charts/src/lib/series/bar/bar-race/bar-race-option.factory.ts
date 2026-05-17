import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BAR_RACE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["race"],
  name: "Bar Race",
  selector: "tng-bar-race-chart",
  seriesType: "bar",
  slug: "bar-race",
});

export type TngBarRaceChartOptionInput = TngCatalogChartOptionInput;

export function createTngBarRaceChartOption(input: TngBarRaceChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BAR_RACE_CHART_PRESET);
}
