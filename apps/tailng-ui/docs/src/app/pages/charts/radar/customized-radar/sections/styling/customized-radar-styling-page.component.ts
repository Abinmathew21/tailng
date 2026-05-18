import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-customized-radar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './customized-radar-styling-page.component.html',
  styleUrl: './customized-radar-styling-page.component.css',
})
export class CustomizedRadarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
