import type { TngChartData } from '@tailng-ui/charts';
import {
  getChartSeriesFieldInputRows,
  resolveChartSeriesDocConfig,
  type ChartSeriesDocConfig,
} from '../../series/chart-series-docs.data';

const donutChartConfig = resolveChartSeriesDocConfig('pie', 'donut');
if (donutChartConfig === null) {
  throw new Error('Missing Donut chart docs config.');
}

export const DONUT_CHART_CONFIG: ChartSeriesDocConfig = donutChartConfig;

export const DONUT_FIELD_INPUTS = getChartSeriesFieldInputRows(DONUT_CHART_CONFIG);

export const DONUT_DEMO_DATA: TngChartData = [
  { name: 'Core', value: 44 },
  { name: 'Pro', value: 31 },
  { name: 'Enterprise', value: 18 },
  { name: 'Services', value: 7 },
];

export const DONUT_IMPORT_CODE = [
  `import { ${DONUT_CHART_CONFIG.importName}, type TngChartData } from '@tailng-ui/charts';`,
  '',
  'const data: TngChartData = [',
  "  { name: 'Core', value: 44 },",
  "  { name: 'Pro', value: 31 },",
  "  { name: 'Enterprise', value: 18 },",
  "  { name: 'Services', value: 7 },",
  '];',
].join('\n');

export const DONUT_USAGE_CODE = [
  '@Component({',
  `  imports: [${DONUT_CHART_CONFIG.importName}],`,
  `  template: \`<${DONUT_CHART_CONFIG.selector}`,
  '    [data]="data"',
  '    nameField="name"',
  '    valueField="value"',
  '    [height]="320"',
  '  />`,',
  '})',
  'export class DonutProductMixChart {',
  '  protected readonly data = data;',
  '}',
].join('\n');
