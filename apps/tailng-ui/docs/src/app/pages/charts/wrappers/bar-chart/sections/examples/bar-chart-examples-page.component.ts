import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-bar-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './bar-chart-examples-page.component.html',
  styleUrl: './bar-chart-examples-page.component.css',
})
export class BarChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['bar-chart'];
}
