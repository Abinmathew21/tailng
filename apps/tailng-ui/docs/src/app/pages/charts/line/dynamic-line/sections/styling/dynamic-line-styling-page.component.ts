import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-dynamic-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './dynamic-line-styling-page.component.html',
  styleUrl: './dynamic-line-styling-page.component.css',
})
export class DynamicLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
