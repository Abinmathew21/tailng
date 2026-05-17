import { Component } from '@angular/core';
import { CHART_SERIES_SHARED_INPUTS } from '../../../../chart-series-docs.data';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import { DONUT_FIELD_INPUTS } from '../../donut-pilot.data';

@Component({
  selector: 'app-donut-api-page',
  templateUrl: './donut-api-page.component.html',
  styleUrl: './donut-api-page.component.css',
})
export class DonutApiPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly fieldInputs = DONUT_FIELD_INPUTS;
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;
}
