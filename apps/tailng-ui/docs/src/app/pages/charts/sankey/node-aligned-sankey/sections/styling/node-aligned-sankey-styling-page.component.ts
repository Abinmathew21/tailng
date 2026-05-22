import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-node-aligned-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './node-aligned-sankey-styling-page.component.html',
  styleUrl: './node-aligned-sankey-styling-page.component.css',
})
export class NodeAlignedSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
