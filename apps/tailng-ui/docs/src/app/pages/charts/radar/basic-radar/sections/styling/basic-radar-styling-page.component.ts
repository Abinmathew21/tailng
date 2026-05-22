import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-radar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-radar-styling-page.component.html',
  styleUrl: './basic-radar-styling-page.component.css',
})
export class BasicRadarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
