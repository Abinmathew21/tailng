import { Component } from '@angular/core';
import { TngBasicLineChartComponent } from '@tailng-ui/charts';
import { type DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import { BASIC_LINE_DEMO_DATA } from '../../basic-line-pilot.data';

@Component({
  selector: 'app-basic-line-examples-page',
  imports: [
    TngBasicLineChartComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './basic-line-examples-page.component.html',
  styleUrl: './basic-line-examples-page.component.css',
})
export class BasicLineExamplesPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly chartHeight = 320;
  protected readonly data = BASIC_LINE_DEMO_DATA;

  protected readonly defaultExampleTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'basic-line-example.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngBasicLineChart, type TngChartData } from '@tailng-ui/charts';",
        '',
        'const data: TngChartData = [',
        "  { label: 'Jan', value: 42 },",
        "  { label: 'Feb', value: 58 },",
        "  { label: 'Mar', value: 64 },",
        "  { label: 'Apr', value: 86 },",
        "  { label: 'May', value: 72 },",
        "  { label: 'Jun', value: 91 },",
        '];',
        '',
        '@Component({',
        "  selector: 'app-basic-line-example',",
        '  imports: [TngBasicLineChart],',
        "  template: `<tng-basic-line-chart",
        '    [data]="data"',
        '    xField="label"',
        '    yField="value"',
        '    [height]="320"',
        '  />`,',
        '})',
        'export class BasicLineExampleComponent {',
        '  protected readonly data = data;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'basic-line-example.component.html',
      code: [
        '<tng-basic-line-chart',
        '  [data]="data"',
        '  xField="label"',
        '  yField="value"',
        '  [height]="320"',
        '/>',
      ].join('\n'),
    },
  ]);
}
