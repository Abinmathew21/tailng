import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-covariance-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './covariance-matrix-styling-page.component.html',
  styleUrl: './covariance-matrix-styling-page.component.css',
})
export class CovarianceMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
