import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-gradient-edge-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './gradient-edge-sankey-styling-page.component.html',
  styleUrl: './gradient-edge-sankey-styling-page.component.css',
})
export class GradientEdgeSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
