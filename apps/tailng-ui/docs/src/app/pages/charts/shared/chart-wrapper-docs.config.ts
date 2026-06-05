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
  hostClass: string;
  importName: string;
  requiredFields: string;
  useCase: string;
  overviewLead: string;
  exampleTitle: string;
  exampleDescription: string;
  stylingLead: string;
  stylingNotes: readonly string[];
  themeVariableNames: readonly string[];
  templateAttrs: string;
  usageTemplate: string;
}>;

export type ChartThemeVariableRow = Readonly<{
  name: string;
  fallbackChain: string;
  detail: string;
  sampleValue: string;
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

export const CHART_FUNNEL_DATA: TngChartData = [
  { stage: 'Awareness', value: 100 },
  { stage: 'Interest', value: 72 },
  { stage: 'Evaluation', value: 48 },
  { stage: 'Purchase', value: 26 },
];

export const CHART_CANDLESTICK_DATA: TngChartData = [
  { day: 'Mon', value: [20, 34, 10, 38] },
  { day: 'Tue', value: [30, 22, 18, 35] },
  { day: 'Wed', value: [22, 40, 20, 44] },
  { day: 'Thu', value: [40, 28, 24, 42] },
  { day: 'Fri', value: [28, 46, 22, 48] },
];

export const CHART_BOXPLOT_DATA: TngChartData = [
  { group: 'Q1', value: [10, 20, 30, 40, 50] },
  { group: 'Q2', value: [15, 25, 35, 45, 55] },
  { group: 'Q3', value: [8, 22, 32, 42, 60] },
  { group: 'Q4', value: [20, 28, 38, 48, 65] },
];

export const CHART_GAUGE_DATA: TngChartData = [
  { name: 'Progress', value: 72 },
];

export const CHART_SANKEY_DATA: TngChartData = [
  { source: 'Visits', target: 'Signups', value: 100 },
  { source: 'Signups', target: 'Trials', value: 60 },
  { source: 'Trials', target: 'Paid', value: 30 },
  { source: 'Visits', target: 'Bounce', value: 40 },
];

export const CHART_CHORD_DATA: TngChartData = [
  { source: 'Product', target: 'Sales', value: 40 },
  { source: 'Sales', target: 'Support', value: 25 },
  { source: 'Support', target: 'Product', value: 15 },
  { source: 'Product', target: 'Marketing', value: 30 },
  { source: 'Marketing', target: 'Sales', value: 35 },
];

export const CHART_GRAPH_DATA: TngChartData = [
  { source: 'Core', target: 'Auth', value: 1 },
  { source: 'Core', target: 'API', value: 1 },
  { source: 'API', target: 'Cache', value: 1 },
  { source: 'API', target: 'DB', value: 1 },
  { source: 'Auth', target: 'DB', value: 1 },
];

export const CHART_PICTORIAL_BAR_DATA: TngChartData = [
  { category: 'Mon', value: 18 },
  { category: 'Tue', value: 32 },
  { category: 'Wed', value: 27 },
  { category: 'Thu', value: 41 },
  { category: 'Fri', value: 35 },
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
      hostClass: 'tng-line-chart-host',
      importName: 'TngLineChart',
      requiredFields: 'data, xField',
      useCase: 'Trend charts over categories or time buckets.',
      overviewLead:
        'Map records to category and value fields. The wrapper builds ECharts options, legend state, and theme tokens for you.',
      exampleTitle: 'Revenue trend',
      exampleDescription: 'Smoothed line chart with quarterly category data.',
      stylingLead:
        'Line charts read palette, axis, grid, tooltip, and text variables from the rendered chart scope.',
      stylingNotes: [
        'Use series variables for default line colors; explicit series.color values still win for individual series.',
        'Use axis and grid variables when the line chart sits on a tinted analytics surface.',
        'Use optionOverride for stroke width, point symbol, grid spacing, or any lower-level ECharts option.',
      ],
      themeVariableNames: [
        '--tng-chart-series-1',
        '--tng-chart-series-2',
        '--tng-chart-axis-label',
        '--tng-chart-axis-line',
        '--tng-chart-grid-line',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
      templateAttrs: 'xField="quarter" yField="revenue" smooth',
      usageTemplate:
        '<tng-line-chart [data]="data" xField="quarter" yField="revenue" smooth [height]="320" />',
    },
    'bar-chart': {
      slug: 'bar-chart',
      selector: 'tng-bar-chart',
      hostClass: 'tng-bar-chart-host',
      importName: 'TngBarChart',
      requiredFields: 'data, xField',
      useCase: 'Category comparison, stacked bars, and horizontal bars.',
      overviewLead:
        'Pass one or more series definitions for grouped bars. Legend toggles flow through chart context.',
      exampleTitle: 'Regional activity',
      exampleDescription: 'Grouped bar chart with context-driven legend toggles.',
      stylingLead:
        'Bar charts use the shared palette for grouped or stacked series and the axis variables for category/value scaffolding.',
      stylingNotes: [
        'Use series variables for grouped bar colors; explicit series.color values still win for individual bars.',
        'Axis and grid variables are especially useful for horizontal bars and dense comparison views.',
        'Use optionOverride for bar width, stack spacing, rounded corners, or grid padding.',
      ],
      themeVariableNames: [
        '--tng-chart-series-1',
        '--tng-chart-series-2',
        '--tng-chart-series-3',
        '--tng-chart-axis-label',
        '--tng-chart-axis-line',
        '--tng-chart-grid-line',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
      templateAttrs: 'xField="region" [series]="regionSeries"',
      usageTemplate:
        '<tng-bar-chart [data]="data" xField="region" [series]="series" [height]="320" />',
    },
    'area-chart': {
      slug: 'area-chart',
      selector: 'tng-area-chart',
      hostClass: 'tng-area-chart-host',
      importName: 'TngAreaChart',
      requiredFields: 'data, xField',
      useCase: 'Filled line charts and cumulative trends.',
      overviewLead:
        'Area charts share the line chart field contract with filled regions under the series.',
      exampleTitle: 'Revenue shape',
      exampleDescription: 'Filled area chart for cumulative or volume emphasis.',
      stylingLead:
        'Area charts use line-series variables plus axis, grid, tooltip, and text variables for the surrounding chart chrome.',
      stylingNotes: [
        'The series palette drives both the line and the generated fill tone unless optionOverride customizes areaStyle.',
        'Use muted axis labels and subtle grid lines when area fills need to remain the visual focus.',
        'Use optionOverride for area opacity, gradient fills, symbols, and stacked area details.',
      ],
      themeVariableNames: [
        '--tng-chart-series-1',
        '--tng-chart-series-2',
        '--tng-chart-axis-label',
        '--tng-chart-axis-line',
        '--tng-chart-grid-line',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
      templateAttrs: 'xField="quarter" yField="revenue" smooth',
      usageTemplate:
        '<tng-area-chart [data]="data" xField="quarter" yField="revenue" smooth [height]="320" />',
    },
    'pie-chart': {
      slug: 'pie-chart',
      selector: 'tng-pie-chart',
      hostClass: 'tng-pie-chart-host',
      importName: 'TngPieChart',
      requiredFields: 'data, nameField, valueField',
      useCase: 'Part-to-whole breakdowns with optional donut mode.',
      overviewLead:
        'Use name and value fields for slices. Enable donut mode when you need a center label or focal metric.',
      exampleTitle: 'Product mix',
      exampleDescription: 'Donut chart for part-to-whole category data.',
      stylingLead:
        'Pie charts mostly consume series palette and tooltip variables because the wrapper has no cartesian axes.',
      stylingNotes: [
        'Use series variables to set slice colors in order; explicit legacy slice.color values still win for individual slices.',
        'Use innerRadius and outerRadius inputs for donut sizing before reaching for optionOverride.',
        'Use optionOverride for label placement, rose charts, center labels, or custom emphasis states.',
      ],
      themeVariableNames: [
        '--tng-chart-series-1',
        '--tng-chart-series-2',
        '--tng-chart-series-3',
        '--tng-chart-series-4',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
      templateAttrs: 'nameField="category" valueField="value" donut',
      usageTemplate:
        '<tng-pie-chart [data]="data" nameField="category" valueField="value" donut [height]="320" />',
    },
    'scatter-chart': {
      slug: 'scatter-chart',
      selector: 'tng-scatter-chart',
      hostClass: 'tng-scatter-chart-host',
      importName: 'TngScatterChart',
      requiredFields: 'data, xField, yField',
      useCase: 'Correlation, distribution, and bubble-like plots.',
      overviewLead: 'Scatter charts accept optional sizeField for bubble-like symbol scaling.',
      exampleTitle: 'Engagement shape',
      exampleDescription: 'Scatter plot with data-driven symbol sizing.',
      stylingLead:
        'Scatter charts combine palette variables with cartesian axis and grid variables. Per-point color data can override the palette.',
      stylingNotes: [
        'Use colorField when the dataset already contains point colors; otherwise the chart falls back to the theme palette.',
        'Use sizeField for bubble-like scaling and optionOverride for symbol shape or opacity.',
        'Keep grid-line contrast modest so dense point clouds stay readable.',
      ],
      themeVariableNames: [
        '--tng-chart-series-1',
        '--tng-chart-axis-label',
        '--tng-chart-axis-line',
        '--tng-chart-grid-line',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
      templateAttrs: 'xField="visits" yField="conversion" sizeField="volume"',
      usageTemplate:
        '<tng-scatter-chart [data]="data" xField="visits" yField="conversion" sizeField="volume" [height]="320" />',
    },
    'heatmap-chart': {
      slug: 'heatmap-chart',
      selector: 'tng-heatmap-chart',
      hostClass: 'tng-heatmap-chart-host',
      importName: 'TngHeatmapChart',
      requiredFields: 'data, xField, yField, valueField',
      useCase: 'Matrix intensity views with a visual map.',
      overviewLead:
        'Heatmaps map categorical x/y pairs to intensity values with an automatic visual map.',
      exampleTitle: 'Activity grid',
      exampleDescription: 'Matrix intensity by day and hour.',
      stylingLead:
        'Heatmaps add low, mid, and high intensity variables on top of the shared axis, grid, tooltip, and text variables.',
      stylingNotes: [
        'Use heatmap variables to tune the visualMap gradient without rebuilding the option object.',
        'Set visualMap to false if the surrounding UI already explains the intensity scale.',
        'Use optionOverride for cell label visibility, visualMap placement, or custom min/max behavior.',
      ],
      themeVariableNames: [
        '--tng-chart-heatmap-low',
        '--tng-chart-heatmap-mid',
        '--tng-chart-heatmap-high',
        '--tng-chart-axis-label',
        '--tng-chart-axis-line',
        '--tng-chart-grid-line',
        '--tng-chart-tooltip-bg',
        '--tng-chart-tooltip-border',
      ],
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
    defaultValue: 'null',
    notes: 'Pass-through ECharts init theme object or registered theme name.',
  },
  {
    name: 'tooltip',
    type: 'boolean',
    defaultValue: 'true',
    notes: 'Enable the generated tooltip option.',
  },
  {
    name: 'emptyMessage',
    type: 'string',
    defaultValue: "'No chart data available.'",
    notes: 'Message shown when the mapped data collection is empty.',
  },
  {
    name: 'merge',
    type: 'boolean',
    defaultValue: 'false',
    notes: 'Use ECharts option merge mode instead of replacing generated options.',
  },
  {
    name: 'runtimeLoader',
    type: 'TngChartRuntimeLoader',
    defaultValue: 'internal',
    notes: 'Override the ECharts runtime loader for custom bundles or tests.',
  },
  {
    name: 'optionOverride',
    type: 'TngChartOptionOverride',
    defaultValue: '—',
    notes: 'Function hook that receives the generated option and returns the final option.',
  },
];

export const CHART_THEME_VARIABLES: readonly ChartThemeVariableRow[] = [
  {
    name: '--tng-chart-background',
    fallbackChain:
      '--tng-semantic-background-canvas -> --tng-semantic-background-base -> --color-bg',
    detail: 'ECharts background color for the plot.',
    sampleValue: 'var(--tng-semantic-background-base)',
  },
  {
    name: '--tng-chart-surface',
    fallbackChain: '--tng-semantic-background-surface -> --color-surface',
    detail: 'Surface fallback used by tooltip and chart chrome.',
    sampleValue: 'var(--tng-semantic-background-surface)',
  },
  {
    name: '--tng-chart-fg',
    fallbackChain: '--tng-semantic-foreground-primary -> --color-fg',
    detail: 'Primary ECharts text color.',
    sampleValue: 'var(--tng-semantic-foreground-primary)',
  },
  {
    name: '--tng-chart-muted',
    fallbackChain:
      '--tng-semantic-foreground-muted -> --tng-semantic-foreground-secondary -> --color-muted',
    detail: 'Legend text, muted text, and secondary labels.',
    sampleValue: 'var(--tng-semantic-foreground-secondary)',
  },
  {
    name: '--tng-chart-border',
    fallbackChain:
      '--tng-semantic-border-subtle -> --tng-semantic-border-default -> --color-border',
    detail: 'Shared border fallback for axes, grid, and tooltip borders.',
    sampleValue: 'var(--tng-semantic-border-subtle)',
  },
  {
    name: '--tng-chart-primary',
    fallbackChain: '--tng-semantic-accent-brand -> --color-primary -> --tng-color-primary500',
    detail: 'Primary accent resolved into the chart theme.',
    sampleValue: 'var(--tng-semantic-accent-brand)',
  },
  {
    name: '--tng-chart-success',
    fallbackChain: '--tng-semantic-accent-success -> --color-success',
    detail: 'Success accent available to chart theme and palette fallbacks.',
    sampleValue: 'var(--tng-semantic-accent-success)',
  },
  {
    name: '--tng-chart-warning',
    fallbackChain: '--tng-semantic-accent-warning -> --color-warning',
    detail: 'Warning accent available to chart theme and palette fallbacks.',
    sampleValue: 'var(--tng-semantic-accent-warning)',
  },
  {
    name: '--tng-chart-danger',
    fallbackChain: '--tng-semantic-accent-danger -> --color-danger',
    detail: 'Danger accent available to chart theme and palette fallbacks.',
    sampleValue: 'var(--tng-semantic-accent-danger)',
  },
  {
    name: '--tng-chart-info',
    fallbackChain: '--color-info -> --tng-color-sky500 -> --tng-color-cyan500',
    detail: 'Info accent used by the fifth palette color and heatmap midpoint fallback.',
    sampleValue: 'var(--tng-color-sky500)',
  },
  {
    name: '--tng-chart-axis-label',
    fallbackChain:
      '--tng-semantic-foreground-muted -> --tng-semantic-foreground-secondary -> --color-muted',
    detail: 'Axis tick label color.',
    sampleValue: 'var(--tng-semantic-foreground-secondary)',
  },
  {
    name: '--tng-chart-axis-line',
    fallbackChain:
      '--tng-chart-border -> --tng-semantic-border-subtle -> --tng-semantic-border-default -> --color-border',
    detail: 'Axis line and tick color.',
    sampleValue: 'var(--tng-semantic-border-default)',
  },
  {
    name: '--tng-chart-grid-line',
    fallbackChain:
      '--tng-chart-border -> --tng-semantic-border-subtle -> --tng-semantic-border-default -> --color-border',
    detail: 'Split line color for cartesian charts.',
    sampleValue: 'color-mix(in srgb, var(--tng-semantic-border-subtle) 70%, transparent)',
  },
  {
    name: '--tng-chart-tooltip-bg',
    fallbackChain: '--tng-chart-surface -> --tng-semantic-background-surface -> --color-surface',
    detail: 'Tooltip background color.',
    sampleValue: 'var(--tng-semantic-background-surface)',
  },
  {
    name: '--tng-chart-tooltip-border',
    fallbackChain:
      '--tng-chart-border -> --tng-semantic-border-subtle -> --tng-semantic-border-default -> --color-border',
    detail: 'Tooltip border color.',
    sampleValue: 'var(--tng-semantic-border-default)',
  },
  {
    name: '--tng-chart-series-1',
    fallbackChain: '--tng-semantic-accent-brand -> --color-primary',
    detail: 'First palette color for series, slices, or points.',
    sampleValue: 'var(--tng-semantic-accent-brand)',
  },
  {
    name: '--tng-chart-series-2',
    fallbackChain: '--tng-semantic-accent-success -> --color-success',
    detail: 'Second palette color.',
    sampleValue: 'var(--tng-semantic-accent-success)',
  },
  {
    name: '--tng-chart-series-3',
    fallbackChain: '--tng-semantic-accent-warning -> --color-warning',
    detail: 'Third palette color.',
    sampleValue: 'var(--tng-semantic-accent-warning)',
  },
  {
    name: '--tng-chart-series-4',
    fallbackChain: '--tng-semantic-accent-danger -> --color-danger',
    detail: 'Fourth palette color.',
    sampleValue: 'var(--tng-semantic-accent-danger)',
  },
  {
    name: '--tng-chart-series-5',
    fallbackChain: '--tng-chart-info -> --color-info -> --tng-color-sky500',
    detail: 'Fifth palette color.',
    sampleValue: 'var(--tng-chart-info, var(--tng-color-sky500))',
  },
  {
    name: '--tng-chart-series-6',
    fallbackChain: '--tng-color-violet500 -> --tng-color-purple500',
    detail: 'Sixth palette color.',
    sampleValue: 'var(--tng-color-violet500)',
  },
  {
    name: '--tng-chart-heatmap-low',
    fallbackChain:
      '--tng-semantic-background-muted -> --tng-semantic-background-surface -> --color-surface',
    detail: 'Low value color in the heatmap visual map.',
    sampleValue: 'var(--tng-semantic-background-muted)',
  },
  {
    name: '--tng-chart-heatmap-mid',
    fallbackChain: '--tng-chart-info -> --color-info -> --tng-color-sky500 -> --tng-color-cyan500',
    detail: 'Mid value color in the heatmap visual map.',
    sampleValue: 'var(--tng-chart-info, var(--tng-color-sky500))',
  },
  {
    name: '--tng-chart-heatmap-high',
    fallbackChain: '--tng-semantic-accent-brand -> --color-primary',
    detail: 'High value color in the heatmap visual map.',
    sampleValue: 'var(--tng-semantic-accent-brand)',
  },
];

export const SHARED_CHART_THEME_VARIABLE_NAMES: readonly string[] = [
  '--tng-chart-background',
  '--tng-chart-surface',
  '--tng-chart-fg',
  '--tng-chart-muted',
  '--tng-chart-border',
  '--tng-chart-primary',
  '--tng-chart-success',
  '--tng-chart-warning',
  '--tng-chart-danger',
  '--tng-chart-info',
];
