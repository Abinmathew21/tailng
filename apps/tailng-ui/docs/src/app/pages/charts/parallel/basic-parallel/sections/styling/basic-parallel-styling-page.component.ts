import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-parallel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-parallel-styling-page.component.html',
  styleUrl: './basic-parallel-styling-page.component.css',
})
export class BasicParallelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
