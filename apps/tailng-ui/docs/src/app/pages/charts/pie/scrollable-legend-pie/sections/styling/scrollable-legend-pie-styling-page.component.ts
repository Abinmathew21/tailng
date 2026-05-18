import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-scrollable-legend-pie-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './scrollable-legend-pie-styling-page.component.html',
  styleUrl: './scrollable-legend-pie-styling-page.component.css',
})
export class ScrollableLegendPieStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
