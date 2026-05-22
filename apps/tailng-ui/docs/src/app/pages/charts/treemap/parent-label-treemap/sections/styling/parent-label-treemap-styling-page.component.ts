import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-parent-label-treemap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './parent-label-treemap-styling-page.component.html',
  styleUrl: './parent-label-treemap-styling-page.component.css',
})
export class ParentLabelTreemapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
