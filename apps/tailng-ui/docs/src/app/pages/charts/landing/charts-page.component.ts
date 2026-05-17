import { Component } from '@angular/core';
import {
  TngAreaChartComponent,
  TngBarChartComponent,
  TngLineChartComponent,
  TngPieChartComponent,
  TngScatterChartComponent,
  type TngChartData,
  type TngChartSeries,
} from '@tailng-ui/charts';

type ApiRow = Readonly<{
  name: string;
  required: string;
  useCase: string;
}>;

type Capability = Readonly<{
  label: string;
  value: string;
}>;

@Component({
  selector: 'app-charts-page',
  imports: [
    TngAreaChartComponent,
    TngBarChartComponent,
    TngLineChartComponent,
    TngPieChartComponent,
    TngScatterChartComponent,
  ],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css',
})
export class ChartsPageComponent {
  protected readonly capabilities: readonly Capability[] = [
    { label: 'Renderers', value: 'Canvas default, SVG opt-in' },
    { label: 'Wrappers', value: 'Line, bar, area, pie, scatter, heatmap' },
    { label: 'Composition', value: 'Root, surface, legend context' },
    { label: 'Runtime', value: 'ECharts isolated internally' },
  ];

  protected readonly revenueData: TngChartData = [
    { quarter: 'Q1', revenue: 42, margin: 18 },
    { quarter: 'Q2', revenue: 58, margin: 23 },
    { quarter: 'Q3', revenue: 64, margin: 27 },
    { quarter: 'Q4', revenue: 86, margin: 31 },
  ];

  protected readonly productMixData: TngChartData = [
    { category: 'Core', value: 44 },
    { category: 'Pro', value: 31 },
    { category: 'Enterprise', value: 18 },
    { category: 'Services', value: 7 },
  ];

  protected readonly regionData: TngChartData = [
    { region: 'North', active: 26, retained: 18 },
    { region: 'West', active: 34, retained: 24 },
    { region: 'South', active: 30, retained: 21 },
    { region: 'East', active: 22, retained: 15 },
  ];

  protected readonly engagementData: TngChartData = [
    { visits: 12, conversion: 8, volume: 36 },
    { visits: 18, conversion: 13, volume: 58 },
    { visits: 24, conversion: 18, volume: 72 },
    { visits: 31, conversion: 23, volume: 90 },
    { visits: 37, conversion: 28, volume: 110 },
  ];

  protected readonly regionSeries: readonly TngChartSeries[] = [
    { key: 'active', label: 'Active', yField: 'active' },
    { key: 'retained', label: 'Retained', yField: 'retained' },
  ];

  protected readonly apiRows: readonly ApiRow[] = [
    {
      name: 'tng-line-chart',
      required: 'data, xField',
      useCase: 'Trend charts over categories or time buckets.',
    },
    {
      name: 'tng-bar-chart',
      required: 'data, xField',
      useCase: 'Category comparison, stacked bars, horizontal bars.',
    },
    {
      name: 'tng-area-chart',
      required: 'data, xField',
      useCase: 'Filled line charts and cumulative trends.',
    },
    {
      name: 'tng-pie-chart',
      required: 'data, nameField, valueField',
      useCase: 'Part-to-whole breakdowns with optional donut mode.',
    },
    {
      name: 'tng-scatter-chart',
      required: 'data, xField, yField',
      useCase: 'Correlation, distribution, and bubble-like plots.',
    },
    {
      name: 'tng-heatmap-chart',
      required: 'data, xField, yField, valueField',
      useCase: 'Matrix intensity views with a visual map.',
    },
  ];

  protected readonly installCode = 'pnpm add @tailng-ui/charts echarts';

  protected readonly wrapperCode = [
    "import { TngLineChart, type TngChartData } from '@tailng-ui/charts';",
    '',
    'const data: TngChartData = [',
    "  { quarter: 'Q1', revenue: 42 },",
    "  { quarter: 'Q2', revenue: 58 },",
    '];',
    '',
    '@Component({',
    '  imports: [TngLineChart],',
    "  template: `<tng-line-chart [data]=\"data\" xField=\"quarter\" yField=\"revenue\" smooth />`,",
    '})',
    'export class RevenueChartExample {',
    '  protected readonly data = data;',
    '}',
  ].join('\n');

  protected readonly headlessCode = [
    '<tng-chart-root [optionFactory]="optionFactory" [legendItems]="legendItems">',
    '  <tng-chart-surface />',
    '  <tng-chart-legend />',
    '</tng-chart-root>',
  ].join('\n');
}
