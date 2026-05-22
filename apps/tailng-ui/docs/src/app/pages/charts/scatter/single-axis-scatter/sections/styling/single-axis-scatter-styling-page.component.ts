import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-single-axis-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './single-axis-scatter-styling-page.component.html',
  styleUrl: './single-axis-scatter-styling-page.component.css',
})
export class SingleAxisScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
