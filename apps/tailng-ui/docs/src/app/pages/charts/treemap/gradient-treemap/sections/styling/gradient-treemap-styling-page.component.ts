import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-gradient-treemap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './gradient-treemap-styling-page.component.html',
  styleUrl: './gradient-treemap-styling-page.component.css',
})
export class GradientTreemapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
