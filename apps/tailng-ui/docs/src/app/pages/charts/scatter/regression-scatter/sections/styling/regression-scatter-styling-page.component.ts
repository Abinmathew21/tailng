import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-regression-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './regression-scatter-styling-page.component.html',
  styleUrl: './regression-scatter-styling-page.component.css',
})
export class RegressionScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
