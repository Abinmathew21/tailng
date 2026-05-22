import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-ring-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './ring-gauge-styling-page.component.html',
  styleUrl: './ring-gauge-styling-page.component.css',
})
export class RingGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
