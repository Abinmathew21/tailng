import { Component } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogExamplesPageComponent } from '../../../../series/catalog/chart-series-catalog-examples-page.component';

@Component({
  selector: 'app-compare-funnel-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './compare-funnel-examples-page.component.html',
  styleUrl: './compare-funnel-examples-page.component.css',
})
export class CompareFunnelExamplesPageComponent extends ChartSeriesCatalogExamplesPageComponent {}
