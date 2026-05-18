import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-polar-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './polar-line-styling-page.component.html',
  styleUrl: './polar-line-styling-page.component.css',
})
export class PolarLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
