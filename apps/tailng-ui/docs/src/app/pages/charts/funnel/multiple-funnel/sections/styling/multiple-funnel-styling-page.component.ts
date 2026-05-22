import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-multiple-funnel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multiple-funnel-styling-page.component.html',
  styleUrl: './multiple-funnel-styling-page.component.css',
})
export class MultipleFunnelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
