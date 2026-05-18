import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-nightingale-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './nightingale-styling-page.component.html',
  styleUrl: './nightingale-styling-page.component.css',
})
export class NightingaleStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
