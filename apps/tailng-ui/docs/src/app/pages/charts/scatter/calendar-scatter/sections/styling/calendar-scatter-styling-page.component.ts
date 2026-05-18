import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-calendar-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './calendar-scatter-styling-page.component.html',
  styleUrl: './calendar-scatter-styling-page.component.css',
})
export class CalendarScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
