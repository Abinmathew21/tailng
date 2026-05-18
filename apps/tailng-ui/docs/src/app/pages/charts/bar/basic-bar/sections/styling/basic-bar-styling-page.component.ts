import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-bar-styling-page.component.html',
  styleUrl: './basic-bar-styling-page.component.css',
})
export class BasicBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
