import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-vertical-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './vertical-sankey-styling-page.component.html',
  styleUrl: './vertical-sankey-styling-page.component.css',
})
export class VerticalSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
