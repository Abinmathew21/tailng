import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-geo-map-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './geo-map-styling-page.component.html',
  styleUrl: './geo-map-styling-page.component.css',
})
export class GeoMapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
