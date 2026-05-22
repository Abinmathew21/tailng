import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-choropleth-map-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './choropleth-map-styling-page.component.html',
  styleUrl: './choropleth-map-styling-page.component.css',
})
export class ChoroplethMapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
