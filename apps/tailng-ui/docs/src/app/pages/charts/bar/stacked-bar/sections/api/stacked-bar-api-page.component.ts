import { Component } from '@angular/core';
import { CHART_SERIES_SHARED_INPUTS } from '../../../../series/chart-series-docs.data';
import { ChartSeriesPilotThemeBase } from '../../../../series/pilot/shared/chart-series-pilot-theme.base';
import { STACKED_BAR_FIELD_INPUTS } from '../../stacked-bar-pilot.data';

@Component({
  selector: 'app-stacked-bar-api-page',
  templateUrl: './stacked-bar-api-page.component.html',
  styleUrl: './stacked-bar-api-page.component.css',
})
export class StackedBarApiPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly fieldInputs = STACKED_BAR_FIELD_INPUTS;
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
