import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-tree-styling-page.component.html',
  styleUrl: './basic-tree-styling-page.component.css',
})
export class BasicTreeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
