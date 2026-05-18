import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-scatter-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './scatter-matrix-styling-page.component.html',
  styleUrl: './scatter-matrix-styling-page.component.css',
})
export class ScatterMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
