import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-horizontal-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './horizontal-bar-styling-page.component.html',
  styleUrl: './horizontal-bar-styling-page.component.css',
})
export class HorizontalBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
