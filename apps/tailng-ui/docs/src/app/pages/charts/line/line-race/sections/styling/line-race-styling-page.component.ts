import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-line-race-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './line-race-styling-page.component.html',
  styleUrl: './line-race-styling-page.component.css',
})
export class LineRaceStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
