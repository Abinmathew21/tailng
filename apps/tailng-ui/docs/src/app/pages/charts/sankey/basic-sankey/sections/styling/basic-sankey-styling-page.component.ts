import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-sankey-styling-page.component.html',
  styleUrl: './basic-sankey-styling-page.component.css',
})
export class BasicSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
