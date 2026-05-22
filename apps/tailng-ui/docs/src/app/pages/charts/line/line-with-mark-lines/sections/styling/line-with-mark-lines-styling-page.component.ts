import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-line-with-mark-lines-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './line-with-mark-lines-styling-page.component.html',
  styleUrl: './line-with-mark-lines-styling-page.component.css',
})
export class LineWithMarkLinesStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
