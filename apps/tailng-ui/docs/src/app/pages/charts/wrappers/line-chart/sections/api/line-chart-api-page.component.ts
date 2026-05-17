import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-line-chart-api-page',
  templateUrl: './line-chart-api-page.component.html',
  styleUrl: './line-chart-api-page.component.css',
})
export class LineChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['line-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
