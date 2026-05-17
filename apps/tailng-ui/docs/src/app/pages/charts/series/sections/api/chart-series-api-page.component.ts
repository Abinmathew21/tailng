import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import {
  CHART_SERIES_SHARED_INPUTS,
  getChartSeriesFieldInputRows,
  resolveChartSeriesDocConfigFromUrl,
} from '../../chart-series-docs.data';

@Component({
  selector: 'app-chart-series-api-page',
  templateUrl: './chart-series-api-page.component.html',
  styleUrl: '../../shared/chart-series-section.css',
})
export class ChartSeriesApiPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly chart = computed(() => resolveChartSeriesDocConfigFromUrl(this.currentUrl()));
  protected readonly fieldInputs = computed(() => {
    const chart = this.chart();
    return chart ? getChartSeriesFieldInputRows(chart) : [];
  });
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
