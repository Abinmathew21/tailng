import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  input,
  type Type,
} from '@angular/core';
import type { TngChartData, TngChartOptionOverride } from '@tailng-ui/charts';
import * as TngCharts from '@tailng-ui/charts';
import type { ChartSeriesDocConfig } from '../chart-series-docs.data';
import {
  CATALOG_THEMED_CHART_STYLE,
  parseChartUsageAttributes,
  type ChartUsageBindings,
} from './chart-series-catalog.util';

@Component({
  selector: 'app-chart-series-catalog-chart',
  imports: [NgComponentOutlet],
  template: `
    @if (chartComponent(); as component) {
      <ng-container [ngComponentOutlet]="component" [ngComponentOutletInputs]="chartInputs()" />
    }
  `,
  host: {
    class: 'chart-series-catalog-chart',
    '[style]': 'hostStyle()',
  },
})
export class ChartSeriesCatalogChartComponent {
  public readonly config = input.required<ChartSeriesDocConfig>();
  public readonly data = input.required<TngChartData>();
  public readonly height = input<number>(300);
  public readonly themed = input<boolean>(false);
  public readonly optionOverride = input<TngChartOptionOverride | undefined>(undefined);

  protected readonly chartComponent = computed(() =>
    resolveCatalogChartComponent(this.config().importName),
  );

  protected readonly usageBindings = computed<ChartUsageBindings>(() =>
    parseChartUsageAttributes(this.config().usageAttributes),
  );

  protected readonly chartInputs = computed(() => {
    const inputs: Record<string, unknown> = {
      data: this.data(),
      height: this.height(),
      ...this.usageBindings(),
    };

    const override = this.optionOverride();
    if (override !== undefined) {
      inputs['optionOverride'] = override;
    }

    return inputs;
  });

  protected readonly hostStyle = computed(() => (this.themed() ? CATALOG_THEMED_CHART_STYLE : null));
}

function resolveCatalogChartComponent(importName: string): Type<unknown> | null {
  const candidate = (TngCharts as Record<string, unknown>)[importName];
  return typeof candidate === 'function' ? (candidate as Type<unknown>) : null;
}
