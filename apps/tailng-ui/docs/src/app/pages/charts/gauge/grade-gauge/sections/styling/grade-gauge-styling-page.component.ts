import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-grade-gauge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './grade-gauge-styling-page.component.html',
  styleUrl: './grade-gauge-styling-page.component.css',
})
export class GradeGaugeStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
