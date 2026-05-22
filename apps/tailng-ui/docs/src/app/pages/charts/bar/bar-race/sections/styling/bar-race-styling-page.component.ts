import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-bar-race-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './bar-race-styling-page.component.html',
  styleUrl: './bar-race-styling-page.component.css',
})
export class BarRaceStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
