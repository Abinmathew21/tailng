import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-funnel-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-funnel-styling-page.component.html',
  styleUrl: './basic-funnel-styling-page.component.css',
})
export class BasicFunnelStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
