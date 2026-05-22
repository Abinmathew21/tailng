import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-force-graph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './force-graph-styling-page.component.html',
  styleUrl: './force-graph-styling-page.component.css',
})
export class ForceGraphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
