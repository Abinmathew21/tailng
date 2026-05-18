import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-multi-title-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-title-gauge-styling-page.component.html',
  styleUrl: './multi-title-gauge-styling-page.component.css',
})
export class MultiTitleGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
