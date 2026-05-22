import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-geo-lines-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './geo-lines-styling-page.component.html',
  styleUrl: './geo-lines-styling-page.component.css',
})
export class GeoLinesStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
