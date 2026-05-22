import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-chord-min-angle-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chord-min-angle-styling-page.component.html',
  styleUrl: './chord-min-angle-styling-page.component.css',
})
export class ChordMinAngleStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
