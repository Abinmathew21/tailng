import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-scatter-chart-api-page',
  templateUrl: './scatter-chart-api-page.component.html',
  styleUrl: './scatter-chart-api-page.component.css',
})
export class ScatterChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['scatter-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
