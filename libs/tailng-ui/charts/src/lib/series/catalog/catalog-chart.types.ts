import type { TngChartSeries } from '../../core/chart-series.types';
import type { TngChartData, TngChartOptionOverride } from '../../core/chart.types';

export type TngCatalogSeriesType =
  | 'bar'
  | 'boxplot'
  | 'candlestick'
  | 'chord'
  | 'custom'
  | 'effectScatter'
  | 'funnel'
  | 'gauge'
  | 'graph'
  | 'heatmap'
  | 'line'
  | 'lines'
  | 'map'
  | 'parallel'
  | 'pictorialBar'
  | 'pie'
  | 'radar'
  | 'sankey'
  | 'scatter'
  | 'sunburst'
  | 'themeRiver'
  | 'tree'
  | 'treemap';

export type TngCatalogCoordinateSystem =
  | 'calendar'
  | 'cartesian2d'
  | 'geo'
  | 'matrix'
  | 'none'
  | 'parallel'
  | 'polar'
  | 'radar'
  | 'singleAxis';

export type TngCatalogChartFeature =
  | 'area'
  | 'barometer'
  | 'brush'
  | 'calendar'
  | 'clock'
  | 'confidenceBand'
  | 'dataZoom'
  | 'discreteVisualMap'
  | 'drilldown'
  | 'dynamic'
  | 'effect'
  | 'geo'
  | 'gradient'
  | 'half'
  | 'horizontal'
  | 'jitter'
  | 'large'
  | 'level'
  | 'logAxis'
  | 'markLine'
  | 'matrix'
  | 'multiAxis'
  | 'negative'
  | 'nested'
  | 'nightingale'
  | 'normalized'
  | 'polar'
  | 'progress'
  | 'race'
  | 'radial'
  | 'regression'
  | 'ring'
  | 'rounded'
  | 'scrollLegend'
  | 'smooth'
  | 'sorted'
  | 'stacked'
  | 'step'
  | 'timeAxis'
  | 'vertical'
  | 'visualMap'
  | 'waterfall';

export type TngCatalogChartPreset = Readonly<{
  category: string;
  coordinateSystem: TngCatalogCoordinateSystem;
  features: readonly TngCatalogChartFeature[];
  name: string;
  selector: string;
  seriesType: TngCatalogSeriesType;
  slug: string;
}>;

export type TngCatalogChartOptionInput = Readonly<{
  categoryField?: string | null;
  data: TngChartData;
  hiddenSeries?: ReadonlySet<string>;
  legend?: boolean;
  nameField?: string | null;
  optionOverride?: TngChartOptionOverride | null;
  series?: readonly TngChartSeries[] | null;
  sourceField?: string | null;
  targetField?: string | null;
  tooltip?: boolean;
  valueField?: string | null;
  xField?: string | null;
  yField?: string | null;
}>;
