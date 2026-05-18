import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-intraday-candlestick-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './intraday-candlestick-styling-page.component.html',
  styleUrl: './intraday-candlestick-styling-page.component.css',
})
export class IntradayCandlestickStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
