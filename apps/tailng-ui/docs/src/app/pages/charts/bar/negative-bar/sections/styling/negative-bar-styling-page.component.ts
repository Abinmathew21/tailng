import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-negative-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './negative-bar-styling-page.component.html',
  styleUrl: './negative-bar-styling-page.component.css',
})
export class NegativeBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
