import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-chord-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-chord-styling-page.component.html',
  styleUrl: './basic-chord-styling-page.component.css',
})
export class BasicChordStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
