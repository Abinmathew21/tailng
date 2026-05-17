import { Component, input } from '@angular/core';
import {
  TngAreaChartComponent,
  TngBarChartComponent,
  TngHeatmapChartComponent,
  TngLineChartComponent,
  TngPieChartComponent,
  TngScatterChartComponent,
} from '@tailng-ui/charts';
import {
  CHART_ENGAGEMENT_DATA,
  CHART_HEATMAP_DATA,
  CHART_PRODUCT_MIX_DATA,
  CHART_REGION_DATA,
  CHART_REGION_SERIES,
  CHART_REVENUE_DATA,
  type ChartWrapperSlug,
} from './chart-wrapper-docs.config';

@Component({
  selector: 'app-chart-wrapper-live-demo',
  imports: [
    TngLineChartComponent,
    TngBarChartComponent,
    TngAreaChartComponent,
    TngPieChartComponent,
    TngScatterChartComponent,
    TngHeatmapChartComponent,
  ],
  templateUrl: './chart-wrapper-live-demo.component.html',
  styleUrl: './chart-wrapper-live-demo.component.css',
})
export class ChartWrapperLiveDemoComponent {
  public readonly slug = input.required<ChartWrapperSlug>();
  public readonly height = input<number>(280);

  protected readonly revenueData = CHART_REVENUE_DATA;
  protected readonly regionData = CHART_REGION_DATA;
  protected readonly regionSeries = CHART_REGION_SERIES;
  protected readonly productMixData = CHART_PRODUCT_MIX_DATA;
  protected readonly engagementData = CHART_ENGAGEMENT_DATA;
  protected readonly heatmapData = CHART_HEATMAP_DATA;
}
