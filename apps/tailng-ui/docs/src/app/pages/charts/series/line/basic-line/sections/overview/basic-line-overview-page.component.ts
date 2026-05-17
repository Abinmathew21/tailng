import { Component } from '@angular/core';
import { TngBasicLineChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import {
  CHART_PILOT_PLAIN_LAYOUT_CSS,
  CHART_PILOT_TAILWIND_LAYOUT_CSS,
  CHART_PILOT_TAILWIND_SHELL_CLASS,
  createChartPilotCodeTabs,
} from '../../../../pilot/shared/chart-series-pilot-examples.util';
import {
  BASIC_LINE_CHART_CONFIG,
  BASIC_LINE_DEMO_DATA,
  BASIC_LINE_IMPORT_CODE,
  BASIC_LINE_USAGE_CODE,
} from '../../basic-line-pilot.data';

@Component({
  selector: 'app-basic-line-overview-page',
  imports: [
    TngBasicLineChartComponent,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './basic-line-overview-page.component.html',
  styleUrl: './basic-line-overview-page.component.css',
})
export class BasicLineOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly data = BASIC_LINE_DEMO_DATA;
  protected readonly chartHeight = 300;
  protected readonly tailwindShellClass = CHART_PILOT_TAILWIND_SHELL_CLASS;
  protected readonly importCode = BASIC_LINE_IMPORT_CODE;
  protected readonly usageCode = BASIC_LINE_USAGE_CODE;
  protected readonly featureSummary =
    BASIC_LINE_CHART_CONFIG.features.length > 0
      ? BASIC_LINE_CHART_CONFIG.features.join(', ')
      : 'standard preset';

  protected readonly simplePlainCodeTabs = createChartPilotCodeTabs({
    baseName: 'overview-basic-line-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngBasicLineChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { label: 'Jan', value: 42 },",
      "  { label: 'Feb', value: 58 },",
      "  { label: 'Mar', value: 64 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngBasicLineChart],',
      "  templateUrl: './overview-basic-line-plain.component.html',",
      "  styleUrl: './overview-basic-line-plain.component.css',",
      '})',
      'export class OverviewBasicLinePlainComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-pilot-overview-example-chart chart-pilot-overview-example-chart--plain">',
      '  <tng-basic-line-chart',
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
    baseName: 'overview-basic-line-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngBasicLineChart, type TngChartData } from '@tailng-ui/charts';",
      '',
      'const data: TngChartData = [',
      "  { label: 'Jan', value: 42 },",
      "  { label: 'Feb', value: 58 },",
      "  { label: 'Mar', value: 64 },",
      '];',
      '',
      '@Component({',
      '  imports: [TngBasicLineChart],',
      "  templateUrl: './overview-basic-line-tailwind.component.html',",
      '})',
      'export class OverviewBasicLineTailwindComponent {',
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-shell">',
      '  <tng-basic-line-chart',
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
