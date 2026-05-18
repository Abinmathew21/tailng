import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-pie-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-pie-styling-page.component.html',
  styleUrl: './basic-pie-styling-page.component.css',
})
export class BasicPieStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
