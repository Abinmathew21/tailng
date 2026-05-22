import { Component, computed } from '@angular/core';
import {
  CHART_SERIES_SHARED_INPUTS,
  getChartSeriesFieldInputRows,
} from '../chart-series-docs.data';
import { ChartSeriesCatalogPageBase } from './chart-series-catalog-page.base';

@Component({
  selector: 'app-chart-series-catalog-api-page',
  templateUrl: './chart-series-catalog-api-page.component.html',
  styleUrl: './chart-series-catalog-api-page.component.css',
})
export class ChartSeriesCatalogApiPageComponent extends ChartSeriesCatalogPageBase {
  protected readonly sharedInputs = CHART_SERIES_SHARED_INPUTS;

  protected readonly fieldInputs = computed(() => {
    const config = this.chart();
    return config ? getChartSeriesFieldInputRows(config) : [];
  });
}
