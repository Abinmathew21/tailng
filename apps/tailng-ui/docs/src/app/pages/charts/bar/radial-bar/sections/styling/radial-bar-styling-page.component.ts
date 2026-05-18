import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-radial-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './radial-bar-styling-page.component.html',
  styleUrl: './radial-bar-styling-page.component.css',
})
export class RadialBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
