import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-sunburst-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-sunburst-styling-page.component.html',
  styleUrl: './basic-sunburst-styling-page.component.css',
})
export class BasicSunburstStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
