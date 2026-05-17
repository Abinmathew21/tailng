import { Component } from '@angular/core';
import { TngDonutChartComponent } from '@tailng-ui/charts';
import { type DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import { DONUT_DEMO_DATA } from '../../donut-pilot.data';

@Component({
  selector: 'app-donut-examples-page',
  imports: [TngDonutChartComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './donut-examples-page.component.html',
  styleUrl: './donut-examples-page.component.css',
})
export class DonutExamplesPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly chartHeight = 320;
  protected readonly data = DONUT_DEMO_DATA;

  protected readonly defaultExampleTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'donut-example.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngDonutChart, type TngChartData } from '@tailng-ui/charts';",
        '',
        'const data: TngChartData = [',
        "  { name: 'Core', value: 44 },",
        "  { name: 'Pro', value: 31 },",
        "  { name: 'Enterprise', value: 18 },",
        "  { name: 'Services', value: 7 },",
        '];',
        '',
        '@Component({',
        "  selector: 'app-donut-example',",
        '  imports: [TngDonutChart],',
        "  template: `<tng-donut-chart",
        '    [data]="data"',
        '    nameField="name"',
        '    valueField="value"',
        '    [height]="320"',
        '  />`,',
        '})',
        'export class DonutExampleComponent {',
        '  protected readonly data = data;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'donut-example.component.html',
      code: [
        '<tng-donut-chart',
        '  [data]="data"',
        '  nameField="name"',
        '  valueField="value"',
        '  [height]="320"',
        '/>',
      ].join('\n'),
    },
  ]);
}
