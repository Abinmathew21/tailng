import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { CHART_SERIES_THEME_VARIABLES } from '../../../../chart-series-docs.data';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';

@Component({
  selector: 'app-donut-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './donut-styling-page.component.html',
  styleUrl: './donut-styling-page.component.css',
})
export class DonutStylingPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly themeVariables = CHART_SERIES_THEME_VARIABLES;
  protected readonly cssVariableCode = [
    '.product-mix-panel tng-donut-chart {',
    ...CHART_SERIES_THEME_VARIABLES.slice(0, 8).map((row) => `  ${row.name}: ${row.sampleValue};`),
    '}',
  ].join('\n');
  protected readonly overrideCode = [
    "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
    '',
    'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
    '  ...option,',
    '  series: (option.series as unknown[] | undefined)?.map((series) => ({',
    '    ...(series as Record<string, unknown>),',
    '    label: { show: true, formatter: \'{b}: {d}%\' },',
    '  })),',
    '});',
  ].join('\n');
}
