import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-rounded-sunburst-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './rounded-sunburst-styling-page.component.html',
  styleUrl: './rounded-sunburst-styling-page.component.css',
})
export class RoundedSunburstStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
