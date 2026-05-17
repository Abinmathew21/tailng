import { Component } from '@angular/core';
import {
  CHART_WRAPPER_DOC_CONFIGS,
  SHARED_CHART_INPUTS,
} from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-area-chart-api-page',
  templateUrl: './area-chart-api-page.component.html',
  styleUrl: './area-chart-api-page.component.css',
})
export class AreaChartApiPageComponent {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['area-chart'];
  protected readonly sharedInputs = SHARED_CHART_INPUTS;
}
