import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-half-donut-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './half-donut-styling-page.component.html',
  styleUrl: './half-donut-styling-page.component.css',
})
export class HalfDonutStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
