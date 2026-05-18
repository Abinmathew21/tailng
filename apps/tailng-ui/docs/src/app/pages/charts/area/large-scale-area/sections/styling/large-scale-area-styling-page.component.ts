import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-large-scale-area-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './large-scale-area-styling-page.component.html',
  styleUrl: './large-scale-area-styling-page.component.css',
})
export class LargeScaleAreaStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
