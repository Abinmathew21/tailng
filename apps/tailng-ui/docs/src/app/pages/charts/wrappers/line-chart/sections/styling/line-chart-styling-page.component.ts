import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import {
  CHART_THEME_VARIABLES,
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_THEME_VARIABLE_NAMES,
  type ChartThemeVariableRow,
} from '../../../shared/chart-wrapper-docs.config';

type ChartStyleHook = Readonly<{
  hook: string;
  detail: string;
}>;

@Component({
  selector: 'app-line-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './line-chart-styling-page.component.html',
  styleUrl: './line-chart-styling-page.component.css',
})
export class LineChartStylingPageComponent implements OnDestroy {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['line-chart'];

  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sharedThemeVariables = CHART_THEME_VARIABLES.filter((row) =>
    SHARED_CHART_THEME_VARIABLE_NAMES.includes(row.name),
  );

  protected readonly chartThemeVariables = computed<readonly ChartThemeVariableRow[]>(() => {
    const names = new Set(this.chart.themeVariableNames);
    return CHART_THEME_VARIABLES.filter((row) => names.has(row.name));
  });

  protected readonly styleHooks = computed<readonly ChartStyleHook[]>(() => [
    {
      hook: `<${this.chart.selector}>`,
      detail: 'Public host element. Set layout classes and inherited CSS variables here.',
    },
    {
      hook: `.${this.chart.hostClass}`,
      detail: 'Internal chart root class used by the wrapper around surface and legend.',
    },
    {
      hook: '.tng-chart-surface__host',
      detail:
        'ECharts mount node. Prefer inherited variables and optionOverride over sizing this directly.',
    },
    {
      hook: '.tng-chart-legend__item',
      detail: 'Legend button state and spacing hook for wrappers with legends enabled.',
    },
    {
      hook: '.tng-chart-legend__item--hidden',
      detail: 'Legend item state applied when a series is toggled off.',
    },
  ]);

  protected readonly cssVariableCode = computed(() => {
    return [
      `.analytics-panel ${this.chart.selector} {`,
      ...this.chartThemeVariables()
        .slice(0, 6)
        .map((row) => `  ${row.name}: ${row.sampleValue};`),
      '}',
    ].join('\n');
  });

  protected readonly overrideCode = [
    "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
    '',
    'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
    '  ...option,',
    '  tooltip: {',
    "    ...(option['tooltip'] as Record<string, unknown> | undefined),",
    '    confine: true,',
    '  },',
    '});',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
