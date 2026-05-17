import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { filter, map, startWith } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import {
  CHART_SERIES_THEME_VARIABLES,
  resolveChartSeriesDocConfigFromUrl,
} from '../../chart-series-docs.data';

@Component({
  selector: 'app-chart-series-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chart-series-styling-page.component.html',
  styleUrl: '../../shared/chart-series-section.css',
})
export class ChartSeriesStylingPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly documentRef = inject(DOCUMENT);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly chart = computed(() => resolveChartSeriesDocConfigFromUrl(this.currentUrl()));
  protected readonly themeVariables = CHART_SERIES_THEME_VARIABLES;
  protected readonly cssVariableCode = computed(() => {
    const chart = this.chart();
    if (!chart) {
      return '';
    }

    return [
      `.analytics-panel ${chart.selector} {`,
      ...this.themeVariables.slice(0, 8).map((row) => `  ${row.name}: ${row.sampleValue};`),
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

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
