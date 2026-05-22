import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-pie-on-calendar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './pie-on-calendar-styling-page.component.html',
  styleUrl: './pie-on-calendar-styling-page.component.css',
})
export class PieOnCalendarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
