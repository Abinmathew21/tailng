import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-radial-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './radial-tree-styling-page.component.html',
  styleUrl: './radial-tree-styling-page.component.css',
})
export class RadialTreeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
