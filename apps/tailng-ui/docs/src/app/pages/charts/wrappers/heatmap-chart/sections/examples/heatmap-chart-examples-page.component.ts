import { Component } from '@angular/core';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-heatmap-chart-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './heatmap-chart-examples-page.component.html',
  styleUrl: './heatmap-chart-examples-page.component.css',
})
export class HeatmapChartExamplesPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['heatmap-chart'];
}
