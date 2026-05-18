import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-candlestick-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-candlestick-styling-page.component.html',
  styleUrl: './basic-candlestick-styling-page.component.css',
})
export class BasicCandlestickStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
