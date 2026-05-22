import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-pie-on-geo-map-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './pie-on-geo-map-styling-page.component.html',
  styleUrl: './pie-on-geo-map-styling-page.component.css',
})
export class PieOnGeoMapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
