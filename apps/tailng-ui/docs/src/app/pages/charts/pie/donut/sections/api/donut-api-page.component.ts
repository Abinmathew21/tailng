import { Component } from '@angular/core';
import { CHART_SERIES_SHARED_INPUTS } from '../../../../series/chart-series-docs.data';
import { ChartSeriesThemeBase } from '../../../../series/shared/chart-series-theme.base';
import { DONUT_FIELD_INPUTS } from '../../donut-chart.data';

@Component({
  selector: 'app-donut-api-page',
  templateUrl: './donut-api-page.component.html',
  styleUrl: './donut-api-page.component.css',
})
export class DonutApiPageComponent extends ChartSeriesThemeBase {
  protected readonly fieldInputs = DONUT_FIELD_INPUTS;
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
