import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-heatmap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-heatmap-styling-page.component.html',
  styleUrl: './large-heatmap-styling-page.component.css',
})
export class LargeHeatmapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
