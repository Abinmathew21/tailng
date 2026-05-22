import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-rounded-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './rounded-bar-styling-page.component.html',
  styleUrl: './rounded-bar-styling-page.component.css',
})
export class RoundedBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
