import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-clock-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './clock-gauge-styling-page.component.html',
  styleUrl: './clock-gauge-styling-page.component.css',
})
export class ClockGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
