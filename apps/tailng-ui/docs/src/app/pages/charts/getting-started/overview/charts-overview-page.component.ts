import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import {
  TngAreaChartComponent,
  TngBarChartComponent,
  TngHeatmapChartComponent,
  TngLineChartComponent,
  TngPieChartComponent,
  TngScatterChartComponent,
} from '@tailng-ui/charts';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import {
  CHARTS_GETTING_STARTED_GROUP,
  toChartsDocsRouteData,
  type ChartsDocsRouteData,
} from '../../chart-docs.data';
import {
  CHART_ENGAGEMENT_DATA,
  CHART_HEATMAP_DATA,
  CHART_PRODUCT_MIX_DATA,
  CHART_REGION_DATA,
  CHART_REGION_SERIES,
  CHART_REVENUE_DATA,
} from '../../wrappers/shared/chart-wrapper-docs.config';

const overviewItem = CHARTS_GETTING_STARTED_GROUP.items.find((item) => item.slug === 'overview');
if (!overviewItem) {
  throw new Error('Charts overview item not found.');
}
const fallbackData: ChartsDocsRouteData = toChartsDocsRouteData(
  CHARTS_GETTING_STARTED_GROUP,
  overviewItem,
);

type Capability = Readonly<{ label: string; value: string }>;

type ChartPreviewSlug = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap';

type ChartPreview = Readonly<{
  slug: ChartPreviewSlug;
  docSlug: string;
  title: string;
  description: string;
}>;

@Component({
  selector: 'app-charts-overview-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngLineChartComponent,
    TngBarChartComponent,
    TngAreaChartComponent,
    TngPieChartComponent,
    TngScatterChartComponent,
    TngHeatmapChartComponent,
    TngIcon,
    RouterLink,
  ],
  templateUrl: './charts-overview-page.component.html',
  styleUrl: './charts-overview-page.component.css',
})
export class ChartsOverviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ChartsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly capabilities: readonly Capability[] = [
    { label: 'Renderers', value: 'Canvas default, SVG opt-in' },
    { label: 'Wrappers', value: 'Line, bar, area, pie, scatter, heatmap' },
    { label: 'Composition', value: 'Root, surface, legend context' },
    { label: 'Runtime', value: 'ECharts isolated internally' },
  ];

  protected readonly chartPreviews: readonly ChartPreview[] = [
    {
      slug: 'line',
      docSlug: 'line-chart',
      title: 'Line',
      description: 'Smoothed trend over categories.',
    },
    {
      slug: 'bar',
      docSlug: 'bar-chart',
      title: 'Bar',
      description: 'Grouped comparison with legend toggles.',
    },
    {
      slug: 'area',
      docSlug: 'area-chart',
      title: 'Area',
      description: 'Filled cumulative or volume emphasis.',
    },
    {
      slug: 'pie',
      docSlug: 'pie-chart',
      title: 'Pie',
      description: 'Part-to-whole with donut mode.',
    },
    {
      slug: 'scatter',
      docSlug: 'scatter-chart',
      title: 'Scatter',
      description: 'Correlation with sized symbols.',
    },
    {
      slug: 'heatmap',
      docSlug: 'heatmap-chart',
      title: 'Heatmap',
      description: 'Matrix intensity by x/y pairs.',
    },
  ];

  protected docHref(docSlug: string): readonly string[] {
    return ['/charts', 'wrappers', docSlug, 'examples'];
  }

  protected readonly revenueData = CHART_REVENUE_DATA;
  protected readonly regionData = CHART_REGION_DATA;
  protected readonly regionSeries = CHART_REGION_SERIES;
  protected readonly productMixData = CHART_PRODUCT_MIX_DATA;
  protected readonly engagementData = CHART_ENGAGEMENT_DATA;
  protected readonly heatmapData = CHART_HEATMAP_DATA;
}
