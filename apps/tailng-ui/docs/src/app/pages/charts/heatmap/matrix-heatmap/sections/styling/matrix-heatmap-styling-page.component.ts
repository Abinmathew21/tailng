import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-matrix-heatmap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './matrix-heatmap-styling-page.component.html',
  styleUrl: './matrix-heatmap-styling-page.component.css',
})
export class MatrixHeatmapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
