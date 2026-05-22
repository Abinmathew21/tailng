import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-multiple-radar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multiple-radar-styling-page.component.html',
  styleUrl: './multiple-radar-styling-page.component.css',
})
export class MultipleRadarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
