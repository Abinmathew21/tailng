import { Component, computed } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { CHART_SERIES_THEME_VARIABLES } from '../chart-series-docs.data';
import { ChartSeriesCatalogPageBase } from './chart-series-catalog-page.base';

@Component({
  selector: 'app-chart-series-catalog-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chart-series-catalog-styling-page.component.html',
  styleUrl: './chart-series-catalog-styling-page.component.css',
})
export class ChartSeriesCatalogStylingPageComponent extends ChartSeriesCatalogPageBase {
  protected readonly themeVariables = CHART_SERIES_THEME_VARIABLES;

  protected readonly cssVariableCode = computed(() => {
    const config = this.chart();
    if (!config) {
      return '';
    }

    return [
      `.analytics-panel ${config.selector} {`,
      ...CHART_SERIES_THEME_VARIABLES.slice(0, 8).map(
        (row) => `  ${row.name}: ${row.sampleValue};`,
      ),
      '}',
    ].join('\n');
  });

  protected readonly overrideCode = computed(() => {
    const config = this.chart();
    if (!config) {
      return '';
    }

    if (config.seriesType === 'pie') {
      return [
        "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
        '',
        'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
        '  ...option,',
        "  series: (option['series'] as unknown[] | undefined)?.map((series) => ({",
        '    ...(series as Record<string, unknown>),',
        "    label: { show: true, formatter: '{b}: {d}%' },",
        '  })),',
        '});',
      ].join('\n');
    }

    if (config.seriesType === 'bar') {
      return [
        "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
        '',
        'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
        '  ...option,',
        "  series: (option['series'] as unknown[] | undefined)?.map((series) => ({",
        '    ...(series as Record<string, unknown>),',
        '    itemStyle: { borderRadius: [6, 6, 0, 0] },',
        '  })),',
        '});',
      ].join('\n');
    }

    return [
      "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
      '',
      'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
      '  ...option,',
      "  series: (option['series'] as unknown[] | undefined)?.map((series) => ({",
      '    ...(series as Record<string, unknown>),',
      '    lineStyle: { width: 3 },',
      '    symbolSize: 8,',
      '  })),',
      '});',
    ].join('\n');
  });
}
