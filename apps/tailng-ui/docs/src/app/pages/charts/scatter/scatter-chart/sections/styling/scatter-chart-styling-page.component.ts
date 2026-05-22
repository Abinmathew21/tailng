import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-scatter-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './scatter-chart-styling-page.component.html',
  styleUrl: './scatter-chart-styling-page.component.css',
})
export class ScatterChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
