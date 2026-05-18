import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-area-pieces-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './area-pieces-styling-page.component.html',
  styleUrl: './area-pieces-styling-page.component.css',
})
export class AreaPiecesStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
