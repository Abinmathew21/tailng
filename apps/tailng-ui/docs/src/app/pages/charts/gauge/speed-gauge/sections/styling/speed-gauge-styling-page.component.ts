import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-speed-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './speed-gauge-styling-page.component.html',
  styleUrl: './speed-gauge-styling-page.component.css',
})
export class SpeedGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
