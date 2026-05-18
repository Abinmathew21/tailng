import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-bar-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './bar-chart-styling-page.component.html',
  styleUrl: './bar-chart-styling-page.component.css',
})
export class BarChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
