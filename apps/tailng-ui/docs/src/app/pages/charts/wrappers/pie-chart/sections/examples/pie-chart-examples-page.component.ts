import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-pie-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './pie-chart-examples-page.component.html',
  styleUrl: './pie-chart-examples-page.component.css',
})
export class PieChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['pie-chart'];
}
