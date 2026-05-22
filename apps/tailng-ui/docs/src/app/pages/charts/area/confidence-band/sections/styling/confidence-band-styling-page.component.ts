import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-confidence-band-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './confidence-band-styling-page.component.html',
  styleUrl: './confidence-band-styling-page.component.css',
})
export class ConfidenceBandStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
