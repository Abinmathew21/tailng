import type { TngChartData } from '@tailng-ui/charts';
import {
  getChartSeriesFieldInputRows,
  resolveChartSeriesDocConfig,
  type ChartSeriesDocConfig,
} from '../../series/chart-series-docs.data';

const basicLineChartConfig = resolveChartSeriesDocConfig(
  'line',
  'basic-line',
);
if (basicLineChartConfig === null) {
  throw new Error('Missing Basic Line chart docs config.');
}

export const BASIC_LINE_CHART_CONFIG: ChartSeriesDocConfig = basicLineChartConfig;

export const BASIC_LINE_FIELD_INPUTS = getChartSeriesFieldInputRows(BASIC_LINE_CHART_CONFIG);

export const BASIC_LINE_DEMO_DATA: TngChartData = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 58 },
  { label: 'Mar', value: 64 },
  { label: 'Apr', value: 86 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 91 },
];

export const BASIC_LINE_IMPORT_CODE = [
  `import { ${BASIC_LINE_CHART_CONFIG.importName}, type TngChartData } from '@tailng-ui/charts';`,
  '',
  'const data: TngChartData = [',
  "  { label: 'Jan', value: 42 },",
  "  { label: 'Feb', value: 58 },",
  "  { label: 'Mar', value: 64 },",
  "  { label: 'Apr', value: 86 },",
  "  { label: 'May', value: 72 },",
  "  { label: 'Jun', value: 91 },",
  '];',
].join('\n');

export const BASIC_LINE_USAGE_CODE = [
  '@Component({',
  `  imports: [${BASIC_LINE_CHART_CONFIG.importName}],`,
  `  template: \`<${BASIC_LINE_CHART_CONFIG.selector}`,
  '    [data]="data"',
  '    xField="label"',
  '    yField="value"',
  '    [height]="320"',
  '  />`,',
  '})',
  'export class BasicLineDashboardChart {',
  '  protected readonly data = data;',
  '}',
].join('\n');
