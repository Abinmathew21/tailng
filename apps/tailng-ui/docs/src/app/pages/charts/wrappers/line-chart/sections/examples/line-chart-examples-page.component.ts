import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-line-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './line-chart-examples-page.component.html',
  styleUrl: './line-chart-examples-page.component.css',
})
export class LineChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['line-chart'];
}
