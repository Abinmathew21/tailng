import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-nutrients-parallel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './nutrients-parallel-styling-page.component.html',
  styleUrl: './nutrients-parallel-styling-page.component.css',
})
export class NutrientsParallelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
