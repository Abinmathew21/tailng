import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-heatmap-chart-api-page',
  templateUrl: './heatmap-chart-api-page.component.html',
  styleUrl: './heatmap-chart-api-page.component.css',
})
export class HeatmapChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['heatmap-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
