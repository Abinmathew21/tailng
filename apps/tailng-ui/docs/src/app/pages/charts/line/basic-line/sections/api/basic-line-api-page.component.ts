import { Component } from '@angular/core';
import { CHART_SERIES_SHARED_INPUTS } from '../../../../series/chart-series-docs.data';
import { ChartSeriesThemeBase } from '../../../../series/shared/chart-series-theme.base';
import { BASIC_LINE_CHART_CONFIG, BASIC_LINE_FIELD_INPUTS } from '../../basic-line-chart.data';

@Component({
  selector: 'app-basic-line-api-page',
  templateUrl: './basic-line-api-page.component.html',
  styleUrl: './basic-line-api-page.component.css',
})
export class BasicLineApiPageComponent extends ChartSeriesThemeBase {
  protected readonly chart = BASIC_LINE_CHART_CONFIG;
  protected readonly fieldInputs = BASIC_LINE_FIELD_INPUTS;
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
