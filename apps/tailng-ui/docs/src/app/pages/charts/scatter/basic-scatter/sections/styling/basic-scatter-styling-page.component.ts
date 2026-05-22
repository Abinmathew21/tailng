import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-scatter-styling-page.component.html',
  styleUrl: './basic-scatter-styling-page.component.css',
})
export class BasicScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
