import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-svg-map-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './svg-map-styling-page.component.html',
  styleUrl: './svg-map-styling-page.component.css',
})
export class SvgMapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
