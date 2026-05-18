import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-dynamic-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './dynamic-bar-styling-page.component.html',
  styleUrl: './dynamic-bar-styling-page.component.css',
})
export class DynamicBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
