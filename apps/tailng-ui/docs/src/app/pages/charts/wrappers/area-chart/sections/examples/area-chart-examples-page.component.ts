import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-area-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './area-chart-examples-page.component.html',
  styleUrl: './area-chart-examples-page.component.css',
})
export class AreaChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['area-chart'];
}
