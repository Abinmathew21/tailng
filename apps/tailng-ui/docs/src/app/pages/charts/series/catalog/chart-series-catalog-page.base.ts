import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { ChartSeriesThemeBase } from '../shared/chart-series-theme.base';
import { resolveChartSeriesDocConfigFromUrl } from '../chart-series-docs.data';
import { buildCatalogDemoData } from './chart-series-catalog.util';
import { CHART_SERIES_TAILWIND_SHELL_CLASS } from '../shared/chart-series-examples.util';

export abstract class ChartSeriesCatalogPageBase extends ChartSeriesThemeBase {
  private readonly router = inject(Router);

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly chart = computed(() => resolveChartSeriesDocConfigFromUrl(this.currentUrl()));

  protected readonly demoData = computed(() => {
    const config = this.chart();
    return config ? buildCatalogDemoData(config) : [];
  });

  protected readonly chartHeight = 300;
  protected readonly tailwindShellClass = CHART_SERIES_TAILWIND_SHELL_CLASS;

  protected readonly featureSummary = computed(() => {
    const config = this.chart();
    if (!config) {
      return 'standard preset';
    }

    return config.features.length > 0 ? config.features.join(', ') : 'standard preset';
  });
}
