import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-dynamic-graph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './dynamic-graph-styling-page.component.html',
  styleUrl: './dynamic-graph-styling-page.component.css',
})
export class DynamicGraphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
