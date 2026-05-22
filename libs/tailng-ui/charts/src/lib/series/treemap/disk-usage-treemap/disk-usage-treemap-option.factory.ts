import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DISK_USAGE_TREEMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Treemap",
  coordinateSystem: "geo",
  features: [],
  name: "Disk Usage Treemap",
  selector: "tng-disk-usage-treemap-chart",
  seriesType: "treemap",
  slug: "disk-usage-treemap",
});

export type TngDiskUsageTreemapChartOptionInput = TngCatalogChartOptionInput;

export function createTngDiskUsageTreemapChartOption(input: TngDiskUsageTreemapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DISK_USAGE_TREEMAP_CHART_PRESET);
}
