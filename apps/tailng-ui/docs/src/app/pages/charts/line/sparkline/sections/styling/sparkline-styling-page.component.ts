import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-sparkline-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './sparkline-styling-page.component.html',
  styleUrl: './sparkline-styling-page.component.css',
})
export class SparklineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
