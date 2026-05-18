import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-horizontal-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './horizontal-tree-styling-page.component.html',
  styleUrl: './horizontal-tree-styling-page.component.css',
})
export class HorizontalTreeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
