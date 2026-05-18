import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-multi-axis-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-axis-line-styling-page.component.html',
  styleUrl: './multi-axis-line-styling-page.component.css',
})
export class MultiAxisLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
