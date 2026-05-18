import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-calendar-graph-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './calendar-graph-styling-page.component.html',
  styleUrl: './calendar-graph-styling-page.component.css',
})
export class CalendarGraphStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
