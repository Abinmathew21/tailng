import { Component } from '@angular/core';
import { CHART_SERIES_SHARED_INPUTS } from '../../../../series/chart-series-docs.data';
import { ChartSeriesThemeBase } from '../../../../series/shared/chart-series-theme.base';
import { STACKED_BAR_FIELD_INPUTS } from '../../stacked-bar-chart.data';

@Component({
  selector: 'app-stacked-bar-api-page',
  templateUrl: './stacked-bar-api-page.component.html',
  styleUrl: './stacked-bar-api-page.component.css',
})
export class StackedBarApiPageComponent extends ChartSeriesThemeBase {
  protected readonly fieldInputs = STACKED_BAR_FIELD_INPUTS;
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
