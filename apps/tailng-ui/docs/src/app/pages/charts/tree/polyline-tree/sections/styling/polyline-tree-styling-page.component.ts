import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-polyline-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './polyline-tree-styling-page.component.html',
  styleUrl: './polyline-tree-styling-page.component.css',
})
export class PolylineTreeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
