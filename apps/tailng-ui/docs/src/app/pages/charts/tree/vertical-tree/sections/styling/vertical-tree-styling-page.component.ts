import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-vertical-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './vertical-tree-styling-page.component.html',
  styleUrl: './vertical-tree-styling-page.component.css',
})
export class VerticalTreeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
