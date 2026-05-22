import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-barometer-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './barometer-gauge-styling-page.component.html',
  styleUrl: './barometer-gauge-styling-page.component.css',
})
export class BarometerGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
