import { Component } from '@angular/core';
import { TngStackedBarChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  CHART_SERIES_TAILWIND_LAYOUT_CSS,
  CHART_SERIES_TAILWIND_SHELL_CLASS,
  createChartSeriesCodeTabs,
} from '../../../../series/shared/chart-series-examples.util';
import { ChartSeriesThemeBase } from '../../../../series/shared/chart-series-theme.base';
import {
  STACKED_BAR_CHART_CONFIG,
  STACKED_BAR_DEMO_DATA,
  STACKED_BAR_DEMO_SERIES,
  STACKED_BAR_IMPORT_CODE,
  STACKED_BAR_USAGE_CODE,
} from '../../stacked-bar-chart.data';

@Component({
  selector: 'app-stacked-bar-overview-page',
  imports: [
    TngStackedBarChartComponent,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stacked-bar-overview-page.component.html',
  styleUrl: './stacked-bar-overview-page.component.css',
})
export class StackedBarOverviewPageComponent extends ChartSeriesThemeBase {
  protected readonly data = STACKED_BAR_DEMO_DATA;
  protected readonly series = STACKED_BAR_DEMO_SERIES;
  protected readonly chartHeight = 300;
  protected readonly tailwindShellClass = CHART_SERIES_TAILWIND_SHELL_CLASS;
  protected readonly importCode = STACKED_BAR_IMPORT_CODE;
  protected readonly usageCode = STACKED_BAR_USAGE_CODE;
  protected readonly featureSummary =
    STACKED_BAR_CHART_CONFIG.features.length > 0
      ? STACKED_BAR_CHART_CONFIG.features.join(', ')
      : 'standard preset';

  protected readonly simplePlainCodeTabs = createChartSeriesCodeTabs({
    baseName: 'overview-stacked-bar-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngStackedBarChart, type TngChartData, type TngChartSeries } from '@tailng-ui/charts';",
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
      '',
      '@Component({',
      '  imports: [TngStackedBarChart],',
      "  templateUrl: './overview-stacked-bar-plain.component.html',",
      "  styleUrl: './overview-stacked-bar-plain.component.css',",
      '})',
      'export class OverviewStackedBarPlainComponent {',
      '  protected readonly data = data;',
      '  protected readonly series = series;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-series-overview-example-chart chart-series-overview-example-chart--plain">',
      '  <tng-stacked-bar-chart',
      '    [data]="data"',
      '    xField="label"',
      '    [series]="series"',
      '    [height]="300"',
      '  />',
      '</div>',
    ].join('\n'),
    cssCode: [
      '.chart-series-overview-example-chart--plain {',
      '  min-height: 20rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly simpleTailwindCodeTabs = createChartSeriesCodeTabs({
    baseName: 'overview-stacked-bar-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngStackedBarChart, type TngChartData, type TngChartSeries } from '@tailng-ui/charts';",
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
      '',
      '@Component({',
      '  imports: [TngStackedBarChart],',
      "  templateUrl: './overview-stacked-bar-tailwind.component.html',",
      '})',
      'export class OverviewStackedBarTailwindComponent {',
      '  protected readonly data = data;',
      '  protected readonly series = series;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-shell">',
      '  <tng-stacked-bar-chart',
      '    [data]="data"',
      '    xField="label"',
      '    [series]="series"',
      '    [height]="300"',
      '  />',
      '</div>',
    ].join('\n'),
    cssCode: CHART_SERIES_TAILWIND_LAYOUT_CSS,
  });
}
