import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-correlation-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './correlation-matrix-styling-page.component.html',
  styleUrl: './correlation-matrix-styling-page.component.css',
})
export class CorrelationMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
