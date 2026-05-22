import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import type {
  TngChartHeight,
  TngChartOption,
  TngChartPointEvent,
  TngChartRenderer,
  TngChartRuntimeLoader,
  TngChartTheme,
} from '../../core/chart.types';
import { resolveTngChartHeight } from '../../core/chart.utils';
import { TngChartSurfaceComponent } from '../chart-surface/tng-chart-surface.component';

export {
  resolveTngChartNotMerge,
  resolveTngChartRenderer,
  shouldAttachTngChartResizeObserver,
  shouldScheduleTngChartResizeFrame,
} from '../chart-surface/tng-chart-surface.component';

@Component({
  selector: 'tng-chart',
  imports: [TngChartSurfaceComponent],
  templateUrl: './tng-chart.component.html',
  styleUrl: './tng-chart.component.css',
  host: {
    '[style.height]': 'heightStyle()',
  },
})
export class TngChartComponent {
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  public readonly autoResize = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly height = input<TngChartHeight>(320);
  public readonly lazyUpdate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly option = input<TngChartOption | null>(null);
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly theme = input<TngChartTheme>(null);

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly heightStyle = computed<string>(() => resolveTngChartHeight(this.height()));
}
