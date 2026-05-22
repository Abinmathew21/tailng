import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-log-axis-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './log-axis-line-styling-page.component.html',
  styleUrl: './log-axis-line-styling-page.component.css',
})
export class LogAxisLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
