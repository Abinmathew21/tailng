import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-calendar-heatmap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './calendar-heatmap-styling-page.component.html',
  styleUrl: './calendar-heatmap-styling-page.component.css',
})
export class CalendarHeatmapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
