import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-stacked-area-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stacked-area-styling-page.component.html',
  styleUrl: './stacked-area-styling-page.component.css',
})
export class StackedAreaStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
