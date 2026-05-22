import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-graph-on-cartesian-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './graph-on-cartesian-styling-page.component.html',
  styleUrl: './graph-on-cartesian-styling-page.component.css',
})
export class GraphOnCartesianStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
