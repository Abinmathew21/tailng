import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  TngAreaChartComponent,
  TngBarChartComponent,
  TngHeatmapChartComponent,
  TngLineChartComponent,
  TngPieChartComponent,
  TngScatterChartComponent,
} from '@tailng-ui/charts';
import { filter, map, startWith } from 'rxjs/operators';
import {
  CHART_ENGAGEMENT_DATA,
  CHART_HEATMAP_DATA,
  CHART_PRODUCT_MIX_DATA,
  CHART_REGION_DATA,
  CHART_REGION_SERIES,
  CHART_REVENUE_DATA,
  resolveChartWrapperDocConfig,
  type ChartWrapperDocConfig,
} from '../chart-wrapper-docs.config';
import { resolveChartWrapperSlugFromUrl } from '../chart-wrapper-route.util';

@Component({
  selector: 'app-chart-wrapper-examples-page',
  imports: [
    TngLineChartComponent,
    TngBarChartComponent,
    TngAreaChartComponent,
    TngPieChartComponent,
    TngScatterChartComponent,
    TngHeatmapChartComponent,
  ],
  templateUrl: './chart-wrapper-examples-page.component.html',
  styleUrl: './chart-doc-section.css',
})
export class ChartWrapperExamplesPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly config = computed<ChartWrapperDocConfig | null>(() => {
    const slug = resolveChartWrapperSlugFromUrl(this.currentUrl());
    return slug ? resolveChartWrapperDocConfig(slug) : null;
  });

  protected readonly revenueData = CHART_REVENUE_DATA;
  protected readonly regionData = CHART_REGION_DATA;
  protected readonly regionSeries = CHART_REGION_SERIES;
  protected readonly productMixData = CHART_PRODUCT_MIX_DATA;
  protected readonly engagementData = CHART_ENGAGEMENT_DATA;
  protected readonly heatmapData = CHART_HEATMAP_DATA;
}
