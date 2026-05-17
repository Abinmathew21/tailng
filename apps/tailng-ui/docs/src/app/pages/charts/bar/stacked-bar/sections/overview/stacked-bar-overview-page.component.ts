import { Component } from '@angular/core';
import { TngStackedBarChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../series/pilot/shared/chart-series-pilot-theme.base';
import {
  CHART_PILOT_TAILWIND_LAYOUT_CSS,
  CHART_PILOT_TAILWIND_SHELL_CLASS,
  createChartPilotCodeTabs,
} from '../../../../series/pilot/shared/chart-series-pilot-examples.util';
import {
  STACKED_BAR_CHART_CONFIG,
  STACKED_BAR_DEMO_DATA,
  STACKED_BAR_IMPORT_CODE,
  STACKED_BAR_USAGE_CODE,
} from '../../stacked-bar-pilot.data';

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
export class StackedBarOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly data = STACKED_BAR_DEMO_DATA;
  protected readonly chartHeight = 300;
  protected readonly tailwindShellClass = CHART_PILOT_TAILWIND_SHELL_CLASS;
  protected readonly importCode = STACKED_BAR_IMPORT_CODE;
  protected readonly usageCode = STACKED_BAR_USAGE_CODE;
  protected readonly featureSummary =
    STACKED_BAR_CHART_CONFIG.features.length > 0
      ? STACKED_BAR_CHART_CONFIG.features.join(', ')
      : 'standard preset';

  protected readonly simplePlainCodeTabs = createChartPilotCodeTabs({
    baseName: 'overview-stacked-bar-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngStackedBarChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { label: 'North', value: 26 },",
      "  { label: 'West', value: 34 },",
      "  { label: 'South', value: 30 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngStackedBarChart],',
      "  templateUrl: './overview-stacked-bar-plain.component.html',",
      "  styleUrl: './overview-stacked-bar-plain.component.css',",
      '})',
      'export class OverviewStackedBarPlainComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-pilot-overview-example-chart chart-pilot-overview-example-chart--plain">',
      '  <tng-stacked-bar-chart',
      '    [data]="data"',
      '    xField="label"',
      '    yField="value"',
      '    [height]="300"',
      '  />',
      '</div>',
    ].join('\n'),
    cssCode: [
      '.chart-pilot-overview-example-chart--plain {',
      '  min-height: 20rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly simpleTailwindCodeTabs = createChartPilotCodeTabs({
    baseName: 'overview-stacked-bar-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngStackedBarChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { label: 'North', value: 26 },",
      "  { label: 'West', value: 34 },",
      "  { label: 'South', value: 30 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngStackedBarChart],',
      "  templateUrl: './overview-stacked-bar-tailwind.component.html',",
      '})',
      'export class OverviewStackedBarTailwindComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-shell">',
      '  <tng-stacked-bar-chart',
      '    [data]="data"',
      '    xField="label"',
      '    yField="value"',
      '    [height]="300"',
      '  />',
      '</div>',
    ].join('\n'),
    cssCode: CHART_PILOT_TAILWIND_LAYOUT_CSS,
  });
}
