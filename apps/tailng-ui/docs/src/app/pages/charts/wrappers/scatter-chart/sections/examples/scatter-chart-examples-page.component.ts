import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-scatter-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './scatter-chart-examples-page.component.html',
  styleUrl: './scatter-chart-examples-page.component.css',
})
export class ScatterChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['scatter-chart'];
}
