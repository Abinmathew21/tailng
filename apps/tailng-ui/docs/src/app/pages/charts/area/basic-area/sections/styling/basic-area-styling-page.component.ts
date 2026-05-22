import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-area-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-area-styling-page.component.html',
  styleUrl: './basic-area-styling-page.component.css',
})
export class BasicAreaStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
