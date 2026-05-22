import { Component } from '@angular/core';
import { TNG_IMAGE_SVG_PICTORIAL_BAR_CHART_PRESET } from './image-svg-pictorial-bar-option.factory';
import { TngChartComponent } from '../../../components/chart/tng-chart.component';
import { TngCatalogChartComponentBase } from '../../catalog/tng-catalog-chart-base';

@Component({
  selector: "tng-image-svg-pictorial-bar-chart",
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
export class TngImageSvgPictorialBarChartComponent extends TngCatalogChartComponentBase {
  protected override readonly preset = TNG_IMAGE_SVG_PICTORIAL_BAR_CHART_PRESET;
}
