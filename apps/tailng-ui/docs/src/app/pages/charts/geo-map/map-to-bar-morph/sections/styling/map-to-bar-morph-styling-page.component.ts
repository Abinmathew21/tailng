import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-map-to-bar-morph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './map-to-bar-morph-styling-page.component.html',
  styleUrl: './map-to-bar-morph-styling-page.component.css',
})
export class MapToBarMorphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
