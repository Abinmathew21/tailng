import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-line-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './line-chart-styling-page.component.html',
  styleUrl: './line-chart-styling-page.component.css',
})
export class LineChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
