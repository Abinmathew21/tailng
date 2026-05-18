import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-aqi-parallel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './aqi-parallel-styling-page.component.html',
  styleUrl: './aqi-parallel-styling-page.component.css',
})
export class AqiParallelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
