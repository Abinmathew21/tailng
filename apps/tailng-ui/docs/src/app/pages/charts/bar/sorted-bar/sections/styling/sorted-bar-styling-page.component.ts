import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-sorted-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './sorted-bar-styling-page.component.html',
  styleUrl: './sorted-bar-styling-page.component.css',
})
export class SortedBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
