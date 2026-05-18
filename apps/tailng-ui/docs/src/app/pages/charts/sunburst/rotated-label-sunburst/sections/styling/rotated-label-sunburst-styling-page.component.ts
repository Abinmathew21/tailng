import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-rotated-label-sunburst-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './rotated-label-sunburst-styling-page.component.html',
  styleUrl: './rotated-label-sunburst-styling-page.component.css',
})
export class RotatedLabelSunburstStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
