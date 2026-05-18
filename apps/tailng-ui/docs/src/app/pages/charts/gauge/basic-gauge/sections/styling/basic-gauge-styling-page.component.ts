import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-gauge-styling-page.component.html',
  styleUrl: './basic-gauge-styling-page.component.css',
})
export class BasicGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
