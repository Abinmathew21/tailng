import { Component } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogExamplesPageComponent } from '../../../../series/catalog/chart-series-catalog-examples-page.component';

@Component({
  selector: 'app-visual-map-sunburst-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './visual-map-sunburst-examples-page.component.html',
  styleUrl: './visual-map-sunburst-examples-page.component.css',
})
export class VisualMapSunburstExamplesPageComponent extends ChartSeriesCatalogExamplesPageComponent {}
