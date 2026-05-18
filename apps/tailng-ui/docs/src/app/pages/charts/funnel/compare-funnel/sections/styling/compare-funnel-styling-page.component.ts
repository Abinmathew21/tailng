import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-compare-funnel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './compare-funnel-styling-page.component.html',
  styleUrl: './compare-funnel-styling-page.component.css',
})
export class CompareFunnelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
