import type { TngChartData, TngChartSeries } from '@tailng-ui/charts';
import {
  getChartSeriesFieldInputRows,
  resolveChartSeriesDocConfig,
  type ChartSeriesDocConfig,
} from '../../series/chart-series-docs.data';

const stackedBarChartConfig = resolveChartSeriesDocConfig('bar', 'stacked-bar');
if (stackedBarChartConfig === null) {
  throw new Error('Missing Stacked Bar chart docs config.');
}

export const STACKED_BAR_CHART_CONFIG: ChartSeriesDocConfig = stackedBarChartConfig;

export const STACKED_BAR_FIELD_INPUTS = getChartSeriesFieldInputRows(STACKED_BAR_CHART_CONFIG);

export const STACKED_BAR_DEMO_DATA: TngChartData = [
  { label: 'North', services: 14, subscriptions: 26, support: 8 },
  { label: 'West', services: 18, subscriptions: 34, support: 12 },
  { label: 'South', services: 16, subscriptions: 30, support: 10 },
  { label: 'East', services: 12, subscriptions: 22, support: 7 },
  { label: 'Central', services: 15, subscriptions: 28, support: 9 },
];

export const STACKED_BAR_DEMO_SERIES: readonly TngChartSeries[] = [
  { key: 'subscriptions', label: 'Subscriptions', yField: 'subscriptions' },
  { key: 'services', label: 'Services', yField: 'services' },
  { key: 'support', label: 'Support', yField: 'support' },
];

export const STACKED_BAR_IMPORT_CODE = [
  `import { ${STACKED_BAR_CHART_CONFIG.importName}, type TngChartData, type TngChartSeries } from '@tailng-ui/charts';`,
  '',
  'const data: TngChartData = [',
  "  { label: 'North', subscriptions: 26, services: 14, support: 8 },",
  "  { label: 'West', subscriptions: 34, services: 18, support: 12 },",
  "  { label: 'South', subscriptions: 30, services: 16, support: 10 },",
  '];',
  '',
  'const series: readonly TngChartSeries[] = [',
  "  { key: 'subscriptions', label: 'Subscriptions', yField: 'subscriptions' },",
  "  { key: 'services', label: 'Services', yField: 'services' },",
  "  { key: 'support', label: 'Support', yField: 'support' },",
  '];',
].join('\n');

export const STACKED_BAR_USAGE_CODE = [
  '@Component({',
  `  imports: [${STACKED_BAR_CHART_CONFIG.importName}],`,
  `  template: \`<${STACKED_BAR_CHART_CONFIG.selector}`,
  '    [data]="data"',
  '    xField="label"',
  '    [series]="series"',
  '    [height]="320"',
  '  />`,',
  '})',
  'export class StackedBarRegionalChart {',
  '  protected readonly data = data;',
  '  protected readonly series = series;',
  '}',
].join('\n');
