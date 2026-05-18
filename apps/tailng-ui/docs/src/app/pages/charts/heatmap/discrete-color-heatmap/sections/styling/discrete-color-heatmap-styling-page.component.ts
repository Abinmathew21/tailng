import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-discrete-color-heatmap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './discrete-color-heatmap-styling-page.component.html',
  styleUrl: './discrete-color-heatmap-styling-page.component.css',
})
export class DiscreteColorHeatmapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
