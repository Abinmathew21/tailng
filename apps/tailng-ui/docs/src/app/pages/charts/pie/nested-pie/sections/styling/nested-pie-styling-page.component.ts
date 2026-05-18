import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-nested-pie-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './nested-pie-styling-page.component.html',
  styleUrl: './nested-pie-styling-page.component.css',
})
export class NestedPieStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
