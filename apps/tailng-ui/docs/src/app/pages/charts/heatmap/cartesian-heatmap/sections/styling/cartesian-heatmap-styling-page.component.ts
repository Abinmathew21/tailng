import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-cartesian-heatmap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './cartesian-heatmap-styling-page.component.html',
  styleUrl: './cartesian-heatmap-styling-page.component.css',
})
export class CartesianHeatmapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
