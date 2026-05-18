import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-scale-lines-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-scale-lines-styling-page.component.html',
  styleUrl: './large-scale-lines-styling-page.component.css',
})
export class LargeScaleLinesStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
