import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-pie-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './pie-chart-styling-page.component.html',
  styleUrl: './pie-chart-styling-page.component.css',
})
export class PieChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
