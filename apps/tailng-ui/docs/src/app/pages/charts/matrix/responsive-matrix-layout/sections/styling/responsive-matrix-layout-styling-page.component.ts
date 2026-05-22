import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-responsive-matrix-layout-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './responsive-matrix-layout-styling-page.component.html',
  styleUrl: './responsive-matrix-layout-styling-page.component.css',
})
export class ResponsiveMatrixLayoutStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
