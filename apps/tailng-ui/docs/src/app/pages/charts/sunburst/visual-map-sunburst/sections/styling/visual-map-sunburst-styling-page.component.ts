import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-visual-map-sunburst-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './visual-map-sunburst-styling-page.component.html',
  styleUrl: './visual-map-sunburst-styling-page.component.css',
})
export class VisualMapSunburstStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
