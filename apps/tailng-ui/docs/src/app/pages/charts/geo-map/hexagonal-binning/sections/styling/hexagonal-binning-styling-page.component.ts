import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-hexagonal-binning-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './hexagonal-binning-styling-page.component.html',
  styleUrl: './hexagonal-binning-styling-page.component.css',
})
export class HexagonalBinningStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
