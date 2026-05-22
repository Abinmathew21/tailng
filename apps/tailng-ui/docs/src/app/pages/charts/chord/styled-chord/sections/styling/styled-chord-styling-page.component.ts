import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-styled-chord-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './styled-chord-styling-page.component.html',
  styleUrl: './styled-chord-styling-page.component.css',
})
export class StyledChordStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
