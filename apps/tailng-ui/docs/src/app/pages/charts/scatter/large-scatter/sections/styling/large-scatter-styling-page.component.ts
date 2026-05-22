import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-scatter-styling-page.component.html',
  styleUrl: './large-scatter-styling-page.component.css',
})
export class LargeScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
