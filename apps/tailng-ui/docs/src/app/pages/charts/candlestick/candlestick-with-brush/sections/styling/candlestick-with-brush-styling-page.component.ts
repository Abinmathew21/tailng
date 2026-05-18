import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-candlestick-with-brush-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './candlestick-with-brush-styling-page.component.html',
  styleUrl: './candlestick-with-brush-styling-page.component.css',
})
export class CandlestickWithBrushStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
