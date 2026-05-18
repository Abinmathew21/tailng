import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-heatmap-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './heatmap-chart-styling-page.component.html',
  styleUrl: './heatmap-chart-styling-page.component.css',
})
export class HeatmapChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
