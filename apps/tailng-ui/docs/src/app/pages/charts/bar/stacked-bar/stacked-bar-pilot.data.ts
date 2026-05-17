import type { TngChartData } from '@tailng-ui/charts';
import {
  getChartSeriesFieldInputRows,
  resolveChartSeriesDocConfig,
  type ChartSeriesDocConfig,
} from '../../series/chart-series-docs.data';

export const STACKED_BAR_CHART_CONFIG: ChartSeriesDocConfig = resolveChartSeriesDocConfig(
  'bar',
  'stacked-bar',
)!;

export const STACKED_BAR_FIELD_INPUTS = getChartSeriesFieldInputRows(STACKED_BAR_CHART_CONFIG);

export const STACKED_BAR_DEMO_DATA: TngChartData = [
  { label: 'North', value: 26 },
  { label: 'West', value: 34 },
  { label: 'South', value: 30 },
  { label: 'East', value: 22 },
  { label: 'Central', value: 28 },
];

export const STACKED_BAR_IMPORT_CODE = [
  `import { ${STACKED_BAR_CHART_CONFIG.importName}, type TngChartData } from '@tailng-ui/charts';`,
  '',
  'const data: TngChartData = [',
  "  { label: 'North', value: 26 },",
  "  { label: 'West', value: 34 },",
  "  { label: 'South', value: 30 },",
  "  { label: 'East', value: 22 },",
  "  { label: 'Central', value: 28 },",
  '];',
].join('\n');

export const STACKED_BAR_USAGE_CODE = [
  '@Component({',
  `  imports: [${STACKED_BAR_CHART_CONFIG.importName}],`,
  `  template: \`<${STACKED_BAR_CHART_CONFIG.selector}`,
  '    [data]="data"',
  '    xField="label"',
  '    yField="value"',
  '    [height]="320"',
  '  />\`,',
  '})',
  'export class StackedBarRegionalChart {',
  '  protected readonly data = data;',
  '}',
].join('\n');
