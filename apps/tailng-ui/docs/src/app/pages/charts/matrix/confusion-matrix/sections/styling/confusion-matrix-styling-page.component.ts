import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-confusion-matrix-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './confusion-matrix-styling-page.component.html',
  styleUrl: './confusion-matrix-styling-page.component.css',
})
export class ConfusionMatrixStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
