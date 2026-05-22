import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-time-series-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './time-series-line-styling-page.component.html',
  styleUrl: './time-series-line-styling-page.component.css',
})
export class TimeSeriesLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
