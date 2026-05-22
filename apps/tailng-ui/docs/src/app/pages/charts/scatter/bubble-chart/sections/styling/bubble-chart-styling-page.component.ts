import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-bubble-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './bubble-chart-styling-page.component.html',
  styleUrl: './bubble-chart-styling-page.component.css',
})
export class BubbleChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
