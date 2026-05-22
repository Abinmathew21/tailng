import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-jitter-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './jitter-scatter-styling-page.component.html',
  styleUrl: './jitter-scatter-styling-page.component.css',
})
export class JitterScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
