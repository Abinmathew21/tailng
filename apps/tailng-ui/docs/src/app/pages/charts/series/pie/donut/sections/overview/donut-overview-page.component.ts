import { Component } from '@angular/core';
import { TngDonutChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import {
  CHART_PILOT_TAILWIND_LAYOUT_CSS,
  CHART_PILOT_TAILWIND_SHELL_CLASS,
  createChartPilotCodeTabs,
} from '../../../../pilot/shared/chart-series-pilot-examples.util';
import {
  DONUT_CHART_CONFIG,
  DONUT_DEMO_DATA,
  DONUT_IMPORT_CODE,
  DONUT_USAGE_CODE,
} from '../../donut-pilot.data';

@Component({
  selector: 'app-donut-overview-page',
  imports: [
    TngDonutChartComponent,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './donut-overview-page.component.html',
  styleUrl: './donut-overview-page.component.css',
})
export class DonutOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly data = DONUT_DEMO_DATA;
  protected readonly chartHeight = 300;
  protected readonly tailwindShellClass = CHART_PILOT_TAILWIND_SHELL_CLASS;
  protected readonly importCode = DONUT_IMPORT_CODE;
  protected readonly usageCode = DONUT_USAGE_CODE;
  protected readonly featureSummary =
    DONUT_CHART_CONFIG.features.length > 0
      ? DONUT_CHART_CONFIG.features.join(', ')
      : 'standard preset';

  protected readonly simplePlainCodeTabs = createChartPilotCodeTabs({
    baseName: 'overview-donut-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngDonutChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { name: 'Core', value: 44 },",
      "  { name: 'Pro', value: 31 },",
      "  { name: 'Enterprise', value: 18 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngDonutChart],',
      "  templateUrl: './overview-donut-plain.component.html',",
      "  styleUrl: './overview-donut-plain.component.css',",
      '})',
      'export class OverviewDonutPlainComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-pilot-overview-example-chart chart-pilot-overview-example-chart--plain">',
      '  <tng-donut-chart',
      '    [data]="data"',
      '    nameField="name"',
      '    valueField="value"',
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
    baseName: 'overview-donut-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngDonutChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { name: 'Core', value: 44 },",
      "  { name: 'Pro', value: 31 },",
      "  { name: 'Enterprise', value: 18 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngDonutChart],',
      "  templateUrl: './overview-donut-tailwind.component.html',",
      '})',
      'export class OverviewDonutTailwindComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-shell">',
      '  <tng-donut-chart',
      '    [data]="data"',
      '    nameField="name"',
      '    valueField="value"',
      '    [height]="300"',
      '  />',
      '</div>',
    ].join('\n'),
    cssCode: CHART_PILOT_TAILWIND_LAYOUT_CSS,
  });
}
