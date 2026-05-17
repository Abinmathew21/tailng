import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { CHART_SERIES_THEME_VARIABLES } from '../../../../chart-series-docs.data';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';

@Component({
  selector: 'app-stacked-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stacked-bar-styling-page.component.html',
  styleUrl: './stacked-bar-styling-page.component.css',
})
export class StackedBarStylingPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly themeVariables = CHART_SERIES_THEME_VARIABLES;
  protected readonly cssVariableCode = [
    '.analytics-panel tng-stacked-bar-chart {',
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
    '    itemStyle: { borderRadius: [6, 6, 0, 0] },',
    '  })),',
    '});',
  ].join('\n');
}
