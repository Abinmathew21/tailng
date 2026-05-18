import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-ohlc-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './ohlc-styling-page.component.html',
  styleUrl: './ohlc-styling-page.component.css',
})
export class OhlcStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
