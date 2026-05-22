import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-grouped-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './grouped-bar-styling-page.component.html',
  styleUrl: './grouped-bar-styling-page.component.css',
})
export class GroupedBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
