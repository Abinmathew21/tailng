import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-temperature-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './temperature-gauge-styling-page.component.html',
  styleUrl: './temperature-gauge-styling-page.component.css',
})
export class TemperatureGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
