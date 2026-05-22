import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-gradient-area-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './gradient-area-styling-page.component.html',
  styleUrl: './gradient-area-styling-page.component.css',
})
export class GradientAreaStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
