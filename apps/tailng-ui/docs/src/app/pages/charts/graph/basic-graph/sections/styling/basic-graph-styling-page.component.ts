import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-graph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-graph-styling-page.component.html',
  styleUrl: './basic-graph-styling-page.component.css',
})
export class BasicGraphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
