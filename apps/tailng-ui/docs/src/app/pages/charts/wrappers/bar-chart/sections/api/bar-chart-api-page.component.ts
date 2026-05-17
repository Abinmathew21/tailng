import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-bar-chart-api-page',
  templateUrl: './bar-chart-api-page.component.html',
  styleUrl: './bar-chart-api-page.component.css',
})
export class BarChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['bar-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
