import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-interactive-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './interactive-line-styling-page.component.html',
  styleUrl: './interactive-line-styling-page.component.css',
})
export class InteractiveLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
