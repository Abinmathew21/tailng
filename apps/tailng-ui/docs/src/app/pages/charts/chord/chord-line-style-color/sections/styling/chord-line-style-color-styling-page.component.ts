import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-chord-line-style-color-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chord-line-style-color-styling-page.component.html',
  styleUrl: './chord-line-style-color-styling-page.component.css',
})
export class ChordLineStyleColorStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
