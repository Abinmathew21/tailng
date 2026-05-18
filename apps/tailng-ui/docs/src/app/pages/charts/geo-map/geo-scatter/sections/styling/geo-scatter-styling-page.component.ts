import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-geo-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './geo-scatter-styling-page.component.html',
  styleUrl: './geo-scatter-styling-page.component.css',
})
export class GeoScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
