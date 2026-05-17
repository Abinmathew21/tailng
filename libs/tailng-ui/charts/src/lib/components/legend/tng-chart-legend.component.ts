import { Component, computed, inject, input, output } from '@angular/core';
import { TNG_CHART_CONTEXT } from '../../core/chart-context';
import type { TngChartLegendItem } from '../../core/chart-series.types';

@Component({
  selector: 'tng-chart-legend',
  templateUrl: './tng-chart-legend.component.html',
  styleUrl: './tng-chart-legend.component.css',
})
export class TngChartLegendComponent {
  public readonly items = input<readonly TngChartLegendItem[]>([]);

  public readonly itemToggle = output<string>();

  private readonly chartContext = inject(TNG_CHART_CONTEXT, { optional: true });

  protected readonly renderedItems = computed<readonly TngChartLegendItem[]>(() => {
    const items = this.items();
    return items.length > 0 ? items : this.chartContext?.legendItems() ?? [];
  });

  protected toggleItem(item: TngChartLegendItem): void {
    if (item.disabled === true) {
      return;
    }

    this.chartContext?.toggleSeries(item.key);
    this.itemToggle.emit(item.key);
  }
}
