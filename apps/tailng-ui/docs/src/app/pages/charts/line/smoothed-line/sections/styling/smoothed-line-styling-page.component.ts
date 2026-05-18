import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-smoothed-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './smoothed-line-styling-page.component.html',
  styleUrl: './smoothed-line-styling-page.component.css',
})
export class SmoothedLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
