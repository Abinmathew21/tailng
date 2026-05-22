import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-geo-graph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './geo-graph-styling-page.component.html',
  styleUrl: './geo-graph-styling-page.component.css',
})
export class GeoGraphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
