import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-normalized-stacked-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './normalized-stacked-bar-styling-page.component.html',
  styleUrl: './normalized-stacked-bar-styling-page.component.css',
})
export class NormalizedStackedBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
