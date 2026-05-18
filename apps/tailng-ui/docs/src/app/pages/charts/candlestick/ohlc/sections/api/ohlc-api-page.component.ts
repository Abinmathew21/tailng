import { Component } from '@angular/core';
import { ChartSeriesCatalogApiPageComponent } from '../../../../series/catalog/chart-series-catalog-api-page.component';

@Component({
  selector: 'app-ohlc-api-page',
  templateUrl: './ohlc-api-page.component.html',
  styleUrl: './ohlc-api-page.component.css',
})
export class OhlcApiPageComponent extends ChartSeriesCatalogApiPageComponent {}
