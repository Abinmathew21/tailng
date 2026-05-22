import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-scale-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-scale-line-styling-page.component.html',
  styleUrl: './large-scale-line-styling-page.component.css',
})
export class LargeScaleLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
