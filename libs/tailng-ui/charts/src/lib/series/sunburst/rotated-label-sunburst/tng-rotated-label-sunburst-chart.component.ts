import { Component } from '@angular/core';
import { TNG_ROTATED_LABEL_SUNBURST_CHART_PRESET } from './rotated-label-sunburst-option.factory';
import { TngChartComponent } from '../../../components/chart/tng-chart.component';
import { TngCatalogChartComponentBase } from '../../catalog/tng-catalog-chart-base';

@Component({
  selector: "tng-rotated-label-sunburst-chart",
  imports: [TngChartComponent],
  template: `<tng-chart
  [height]="height()"
  [loading]="loading()"
  [merge]="merge()"
  [option]="option()"
  [renderer]="renderer()"
  [runtimeLoader]="runtimeLoader()"
  [theme]="theme()"
  (chartReady)="chartReady.emit($event)"
  (pointClick)="pointClick.emit($event)"
  (pointHover)="pointHover.emit($event)"
  (ready)="ready.emit()"
  (runtimeError)="runtimeError.emit($event)"
/>`,
})
export class TngRotatedLabelSunburstChartComponent extends TngCatalogChartComponentBase {
  protected override readonly preset = TNG_ROTATED_LABEL_SUNBURST_CHART_PRESET;
}
