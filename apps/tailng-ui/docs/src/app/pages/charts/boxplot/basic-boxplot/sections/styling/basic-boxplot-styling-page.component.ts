import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-boxplot-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-boxplot-styling-page.component.html',
  styleUrl: './basic-boxplot-styling-page.component.css',
})
export class BasicBoxplotStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
