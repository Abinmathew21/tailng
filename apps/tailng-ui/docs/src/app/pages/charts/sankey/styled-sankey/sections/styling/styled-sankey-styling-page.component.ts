import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-styled-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './styled-sankey-styling-page.component.html',
  styleUrl: './styled-sankey-styling-page.component.css',
})
export class StyledSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
