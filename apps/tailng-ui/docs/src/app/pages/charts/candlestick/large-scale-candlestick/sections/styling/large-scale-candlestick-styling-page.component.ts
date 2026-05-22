import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-scale-candlestick-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-scale-candlestick-styling-page.component.html',
  styleUrl: './large-scale-candlestick-styling-page.component.css',
})
export class LargeScaleCandlestickStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
