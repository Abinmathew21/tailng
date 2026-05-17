import type { TngChartData, TngChartSeries } from '@tailng-ui/charts';

export type ChartWrapperSlug =
  | 'line-chart'
  | 'bar-chart'
  | 'area-chart'
  | 'pie-chart'
  | 'scatter-chart'
  | 'heatmap-chart';

export type ChartWrapperDocConfig = Readonly<{
  slug: ChartWrapperSlug;
  selector: string;
  importName: string;
  requiredFields: string;
  useCase: string;
  overviewLead: string;
  exampleTitle: string;
  exampleDescription: string;
  templateAttrs: string;
  usageTemplate: string;
}>;

export const CHART_REVENUE_DATA: TngChartData = [
  { quarter: 'Q1', revenue: 42, margin: 18 },
  { quarter: 'Q2', revenue: 58, margin: 23 },
  { quarter: 'Q3', revenue: 64, margin: 27 },
  { quarter: 'Q4', revenue: 86, margin: 31 },
];

export const CHART_PRODUCT_MIX_DATA: TngChartData = [
  { category: 'Core', value: 44 },
  { category: 'Pro', value: 31 },
  { category: 'Enterprise', value: 18 },
  { category: 'Services', value: 7 },
];

export const CHART_REGION_DATA: TngChartData = [
  { region: 'North', active: 26, retained: 18 },
  { region: 'West', active: 34, retained: 24 },
  { region: 'South', active: 30, retained: 21 },
  { region: 'East', active: 22, retained: 15 },
];

export const CHART_ENGAGEMENT_DATA: TngChartData = [
  { visits: 12, conversion: 8, volume: 36 },
  { visits: 18, conversion: 13, volume: 58 },
  { visits: 24, conversion: 18, volume: 72 },
  { visits: 31, conversion: 23, volume: 90 },
  { visits: 37, conversion: 28, volume: 110 },
];

export const CHART_REGION_SERIES: readonly TngChartSeries[] = [
  { key: 'active', label: 'Active', yField: 'active' },
  { key: 'retained', label: 'Retained', yField: 'retained' },
];

export const CHART_HEATMAP_DATA: TngChartData = [
  { day: 'Mon', hour: '9a', value: 12 },
  { day: 'Mon', hour: '12p', value: 28 },
  { day: 'Tue', hour: '9a', value: 18 },
  { day: 'Tue', hour: '12p', value: 34 },
  { day: 'Wed', hour: '9a', value: 22 },
  { day: 'Wed', hour: '12p', value: 41 },
];

export const CHART_WRAPPER_DOC_CONFIGS: Readonly<Record<ChartWrapperSlug, ChartWrapperDocConfig>> =
  {
    'line-chart': {
      slug: 'line-chart',
      selector: 'tng-line-chart',
      importName: 'TngLineChart',
      requiredFields: 'data, xField',
      useCase: 'Trend charts over categories or time buckets.',
      overviewLead:
        'Map records to category and value fields. The wrapper builds ECharts options, legend state, and theme tokens for you.',
      exampleTitle: 'Revenue trend',
      exampleDescription: 'Smoothed line chart with quarterly category data.',
      templateAttrs: 'xField="quarter" yField="revenue" smooth',
      usageTemplate:
        '<tng-line-chart [data]="data" xField="quarter" yField="revenue" smooth [height]="320" />',
    },
    'bar-chart': {
      slug: 'bar-chart',
      selector: 'tng-bar-chart',
      importName: 'TngBarChart',
      requiredFields: 'data, xField',
      useCase: 'Category comparison, stacked bars, and horizontal bars.',
      overviewLead:
        'Pass one or more series definitions for grouped bars. Legend toggles flow through chart context.',
      exampleTitle: 'Regional activity',
      exampleDescription: 'Grouped bar chart with context-driven legend toggles.',
      templateAttrs: 'xField="region" [series]="regionSeries"',
      usageTemplate:
        '<tng-bar-chart [data]="data" xField="region" [series]="series" [height]="320" />',
    },
    'area-chart': {
      slug: 'area-chart',
      selector: 'tng-area-chart',
      importName: 'TngAreaChart',
      requiredFields: 'data, xField',
      useCase: 'Filled line charts and cumulative trends.',
      overviewLead:
        'Area charts share the line chart field contract with filled regions under the series.',
      exampleTitle: 'Revenue shape',
      exampleDescription: 'Filled area chart for cumulative or volume emphasis.',
      templateAttrs: 'xField="quarter" yField="revenue" smooth',
      usageTemplate:
        '<tng-area-chart [data]="data" xField="quarter" yField="revenue" smooth [height]="320" />',
    },
    'pie-chart': {
      slug: 'pie-chart',
      selector: 'tng-pie-chart',
      importName: 'TngPieChart',
      requiredFields: 'data, nameField, valueField',
      useCase: 'Part-to-whole breakdowns with optional donut mode.',
      overviewLead:
        'Use name and value fields for slices. Enable donut mode when you need a center label or focal metric.',
      exampleTitle: 'Product mix',
      exampleDescription: 'Donut chart for part-to-whole category data.',
      templateAttrs: 'nameField="category" valueField="value" donut',
      usageTemplate:
        '<tng-pie-chart [data]="data" nameField="category" valueField="value" donut [height]="320" />',
    },
    'scatter-chart': {
      slug: 'scatter-chart',
      selector: 'tng-scatter-chart',
      importName: 'TngScatterChart',
      requiredFields: 'data, xField, yField',
      useCase: 'Correlation, distribution, and bubble-like plots.',
      overviewLead:
        'Scatter charts accept optional sizeField for bubble-like symbol scaling.',
      exampleTitle: 'Engagement shape',
      exampleDescription: 'Scatter plot with data-driven symbol sizing.',
      templateAttrs: 'xField="visits" yField="conversion" sizeField="volume"',
      usageTemplate:
        '<tng-scatter-chart [data]="data" xField="visits" yField="conversion" sizeField="volume" [height]="320" />',
    },
    'heatmap-chart': {
      slug: 'heatmap-chart',
      selector: 'tng-heatmap-chart',
      importName: 'TngHeatmapChart',
      requiredFields: 'data, xField, yField, valueField',
      useCase: 'Matrix intensity views with a visual map.',
      overviewLead:
        'Heatmaps map categorical x/y pairs to intensity values with an automatic visual map.',
      exampleTitle: 'Activity grid',
      exampleDescription: 'Matrix intensity by day and hour.',
      templateAttrs: 'xField="hour" yField="day" valueField="value"',
      usageTemplate:
        '<tng-heatmap-chart [data]="data" xField="hour" yField="day" valueField="value" [height]="320" />',
    },
  };

export function resolveChartWrapperDocConfig(slug: string): ChartWrapperDocConfig | null {
  if (slug in CHART_WRAPPER_DOC_CONFIGS) {
    return CHART_WRAPPER_DOC_CONFIGS[slug as ChartWrapperSlug];
  }
  return null;
}

export const SHARED_CHART_INPUTS: readonly {
  name: string;
  type: string;
  defaultValue: string;
  notes: string;
}[] = [
  {
    name: 'data',
    type: 'TngChartData',
    defaultValue: '—',
    notes: 'Array of records mapped by field inputs.',
  },
  {
    name: 'height',
    type: 'TngChartHeight',
    defaultValue: '320',
    notes: 'Canvas height in pixels or CSS length.',
  },
  {
    name: 'legend',
    type: 'boolean',
    defaultValue: 'true',
    notes: 'Show built-in legend when series metadata is available.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    notes: 'Swap the chart surface for the loading state.',
  },
  {
    name: 'renderer',
    type: "'canvas' | 'svg'",
    defaultValue: "'canvas'",
    notes: 'ECharts renderer selection.',
  },
  {
    name: 'theme',
    type: 'TngChartTheme',
    defaultValue: 'resolved',
    notes: 'Override TailNG theme tokens for chart colors.',
  },
  {
    name: 'optionOverride',
    type: 'TngChartOptionOverride',
    defaultValue: '—',
    notes: 'Deep-merge escape hatch into generated ECharts options.',
  },
];
