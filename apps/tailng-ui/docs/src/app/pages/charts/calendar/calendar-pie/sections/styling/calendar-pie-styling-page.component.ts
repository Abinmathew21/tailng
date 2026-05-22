import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-calendar-pie-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './calendar-pie-styling-page.component.html',
  styleUrl: './calendar-pie-styling-page.component.css',
})
export class CalendarPieStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
