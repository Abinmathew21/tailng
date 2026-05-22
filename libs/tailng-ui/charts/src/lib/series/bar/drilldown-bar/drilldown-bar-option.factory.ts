import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DRILLDOWN_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["drilldown"],
  name: "Drilldown Bar",
  selector: "tng-drilldown-bar-chart",
  seriesType: "bar",
  slug: "drilldown-bar",
});

export type TngDrilldownBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngDrilldownBarChartOption(input: TngDrilldownBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DRILLDOWN_BAR_CHART_PRESET);
}
