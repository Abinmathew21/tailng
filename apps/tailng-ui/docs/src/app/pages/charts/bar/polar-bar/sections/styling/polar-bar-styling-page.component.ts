import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-polar-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './polar-bar-styling-page.component.html',
  styleUrl: './polar-bar-styling-page.component.css',
})
export class PolarBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
