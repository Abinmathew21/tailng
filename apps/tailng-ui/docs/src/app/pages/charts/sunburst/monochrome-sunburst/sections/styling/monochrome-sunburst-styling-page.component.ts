import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-monochrome-sunburst-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './monochrome-sunburst-styling-page.component.html',
  styleUrl: './monochrome-sunburst-styling-page.component.css',
})
export class MonochromeSunburstStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
