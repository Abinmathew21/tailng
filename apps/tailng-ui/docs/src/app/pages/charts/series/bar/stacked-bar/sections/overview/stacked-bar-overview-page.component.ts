import { Component } from '@angular/core';
import { TngStackedBarChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import {
  STACKED_BAR_CHART_CONFIG,
  STACKED_BAR_DEMO_DATA,
  STACKED_BAR_IMPORT_CODE,
  STACKED_BAR_USAGE_CODE,
} from '../../stacked-bar-pilot.data';

@Component({
  selector: 'app-stacked-bar-overview-page',
  imports: [TngStackedBarChartComponent, TngCodeBlockComponent],
  templateUrl: './stacked-bar-overview-page.component.html',
  styleUrl: './stacked-bar-overview-page.component.css',
})
export class StackedBarOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly data = STACKED_BAR_DEMO_DATA;
  protected readonly heroChartHeight = 300;
  protected readonly importCode = STACKED_BAR_IMPORT_CODE;
  protected readonly usageCode = STACKED_BAR_USAGE_CODE;
  protected readonly featureSummary =
    STACKED_BAR_CHART_CONFIG.features.length > 0
      ? STACKED_BAR_CHART_CONFIG.features.join(', ')
      : 'standard preset';
}
