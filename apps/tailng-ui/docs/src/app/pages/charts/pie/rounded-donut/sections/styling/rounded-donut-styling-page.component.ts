import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-rounded-donut-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './rounded-donut-styling-page.component.html',
  styleUrl: './rounded-donut-styling-page.component.css',
})
export class RoundedDonutStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
