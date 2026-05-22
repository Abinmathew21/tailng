import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-time-series-area-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './time-series-area-styling-page.component.html',
  styleUrl: './time-series-area-styling-page.component.css',
})
export class TimeSeriesAreaStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
