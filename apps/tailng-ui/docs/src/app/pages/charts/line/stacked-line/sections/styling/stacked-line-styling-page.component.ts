import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-stacked-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stacked-line-styling-page.component.html',
  styleUrl: './stacked-line-styling-page.component.css',
})
export class StackedLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
