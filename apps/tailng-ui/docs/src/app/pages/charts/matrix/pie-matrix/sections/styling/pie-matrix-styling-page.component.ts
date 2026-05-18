import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-pie-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './pie-matrix-styling-page.component.html',
  styleUrl: './pie-matrix-styling-page.component.css',
})
export class PieMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
