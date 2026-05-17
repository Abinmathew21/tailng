import { Component } from '@angular/core';
import { TngBasicLineChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import {
  BASIC_LINE_CHART_CONFIG,
  BASIC_LINE_DEMO_DATA,
  BASIC_LINE_IMPORT_CODE,
  BASIC_LINE_USAGE_CODE,
} from '../../basic-line-pilot.data';

@Component({
  selector: 'app-basic-line-overview-page',
  imports: [TngBasicLineChartComponent, TngCodeBlockComponent],
  templateUrl: './basic-line-overview-page.component.html',
  styleUrl: './basic-line-overview-page.component.css',
})
export class BasicLineOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly chart = BASIC_LINE_CHART_CONFIG;
  protected readonly data = BASIC_LINE_DEMO_DATA;
  protected readonly heroChartHeight = 300;
  protected readonly importCode = BASIC_LINE_IMPORT_CODE;
  protected readonly usageCode = BASIC_LINE_USAGE_CODE;
  protected readonly featureSummary =
    BASIC_LINE_CHART_CONFIG.features.length > 0
      ? BASIC_LINE_CHART_CONFIG.features.join(', ')
      : 'standard preset';
}
