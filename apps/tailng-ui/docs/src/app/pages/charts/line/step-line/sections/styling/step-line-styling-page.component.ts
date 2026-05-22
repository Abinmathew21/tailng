import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-step-line-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './step-line-styling-page.component.html',
  styleUrl: './step-line-styling-page.component.css',
})
export class StepLineStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
