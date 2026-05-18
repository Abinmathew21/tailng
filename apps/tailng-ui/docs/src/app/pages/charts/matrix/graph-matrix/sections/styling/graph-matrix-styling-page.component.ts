import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-graph-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './graph-matrix-styling-page.component.html',
  styleUrl: './graph-matrix-styling-page.component.css',
})
export class GraphMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
