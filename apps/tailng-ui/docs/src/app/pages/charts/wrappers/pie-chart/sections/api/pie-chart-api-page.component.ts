import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-pie-chart-api-page',
  templateUrl: './pie-chart-api-page.component.html',
  styleUrl: './pie-chart-api-page.component.css',
})
export class PieChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['pie-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
