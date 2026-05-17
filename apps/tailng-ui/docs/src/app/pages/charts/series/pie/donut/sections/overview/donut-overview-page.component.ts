import { Component } from '@angular/core';
import { TngDonutChartComponent } from '@tailng-ui/charts';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesPilotThemeBase } from '../../../../pilot/shared/chart-series-pilot-theme.base';
import {
  DONUT_CHART_CONFIG,
  DONUT_DEMO_DATA,
  DONUT_IMPORT_CODE,
  DONUT_USAGE_CODE,
} from '../../donut-pilot.data';

@Component({
  selector: 'app-donut-overview-page',
  imports: [TngDonutChartComponent, TngCodeBlockComponent],
  templateUrl: './donut-overview-page.component.html',
  styleUrl: './donut-overview-page.component.css',
})
export class DonutOverviewPageComponent extends ChartSeriesPilotThemeBase {
  protected readonly data = DONUT_DEMO_DATA;
  protected readonly heroChartHeight = 300;
  protected readonly importCode = DONUT_IMPORT_CODE;
  protected readonly usageCode = DONUT_USAGE_CODE;
  protected readonly featureSummary =
    DONUT_CHART_CONFIG.features.length > 0
      ? DONUT_CHART_CONFIG.features.join(', ')
      : 'standard preset';
}
