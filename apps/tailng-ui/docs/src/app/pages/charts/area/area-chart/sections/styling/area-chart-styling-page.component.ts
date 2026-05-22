import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-area-chart-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './area-chart-styling-page.component.html',
  styleUrl: './area-chart-styling-page.component.css',
})
export class AreaChartStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
