import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { CHART_SERIES_THEME_VARIABLES } from '../../../../series/chart-series-docs.data';
import { ChartSeriesThemeBase } from '../../../../series/shared/chart-series-theme.base';
import { BASIC_LINE_CHART_CONFIG } from '../../basic-line-chart.data';

@Component({
  selector: 'app-basic-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-line-styling-page.component.html',
  styleUrl: './basic-line-styling-page.component.css',
})
export class BasicLineStylingPageComponent extends ChartSeriesThemeBase {
  protected readonly chart = BASIC_LINE_CHART_CONFIG;
  protected readonly themeVariables = CHART_SERIES_THEME_VARIABLES;
  protected readonly cssVariableCode = [
    '.analytics-panel tng-basic-line-chart {',
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
    '    lineStyle: { width: 3 },',
    '  })),',
    '});',
  ].join('\n');
}
