import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import { TngAreaChartComponent } from '@tailng-ui/charts';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import {
  CHARTS_GETTING_STARTED_GROUP,
  toChartsDocsRouteData,
  type ChartsDocsRouteData,
} from '../../chart-docs.data';
import { CHART_REVENUE_DATA } from '../../wrappers/shared/chart-wrapper-docs.config';

const overviewItem = CHARTS_GETTING_STARTED_GROUP.items.find((item) => item.slug === 'overview');
if (!overviewItem) {
  throw new Error('Charts overview item not found.');
}
const fallbackData: ChartsDocsRouteData = toChartsDocsRouteData(
  CHARTS_GETTING_STARTED_GROUP,
  overviewItem,
);

type Capability = Readonly<{ label: string; value: string }>;

@Component({
  selector: 'app-charts-overview-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngAreaChartComponent,
    TngIcon,
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

  protected readonly revenueData = CHART_REVENUE_DATA;
}
