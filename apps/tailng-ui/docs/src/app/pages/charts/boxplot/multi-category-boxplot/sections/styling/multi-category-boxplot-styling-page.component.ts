import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-multi-category-boxplot-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-category-boxplot-styling-page.component.html',
  styleUrl: './multi-category-boxplot-styling-page.component.css',
})
export class MultiCategoryBoxplotStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
