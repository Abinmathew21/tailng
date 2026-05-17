import { Component } from '@angular/core';
import { TngStackedBarChartComponent } from '@tailng-ui/charts';
import { type DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import { STACKED_BAR_DEMO_DATA } from '../../stacked-bar-pilot.data';

@Component({
  selector: 'app-stacked-bar-examples-page',
  imports: [
    TngStackedBarChartComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stacked-bar-examples-page.component.html',
  styleUrl: './stacked-bar-examples-page.component.css',
})
export class StackedBarExamplesPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly chartHeight = 320;
  protected readonly data = STACKED_BAR_DEMO_DATA;

  protected readonly defaultExampleTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stacked-bar-example.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngStackedBarChart, type TngChartData } from '@tailng-ui/charts';",
        '',
        'const data: TngChartData = [',
        "  { label: 'North', value: 26 },",
        "  { label: 'West', value: 34 },",
        "  { label: 'South', value: 30 },",
        "  { label: 'East', value: 22 },",
        "  { label: 'Central', value: 28 },",
        '];',
        '',
        '@Component({',
        "  selector: 'app-stacked-bar-example',",
        '  imports: [TngStackedBarChart],',
        "  template: `<tng-stacked-bar-chart",
        '    [data]="data"',
        '    xField="label"',
        '    yField="value"',
        '    [height]="320"',
        '  />`,',
        '})',
        'export class StackedBarExampleComponent {',
        '  protected readonly data = data;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stacked-bar-example.component.html',
      code: [
        '<tng-stacked-bar-chart',
        '  [data]="data"',
        '  xField="label"',
        '  yField="value"',
        '  [height]="320"',
        '/>',
      ].join('\n'),
    },
  ]);
}
