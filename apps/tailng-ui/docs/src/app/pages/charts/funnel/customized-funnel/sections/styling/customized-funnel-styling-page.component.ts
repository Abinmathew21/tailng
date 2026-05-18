import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-customized-funnel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './customized-funnel-styling-page.component.html',
  styleUrl: './customized-funnel-styling-page.component.css',
})
export class CustomizedFunnelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
