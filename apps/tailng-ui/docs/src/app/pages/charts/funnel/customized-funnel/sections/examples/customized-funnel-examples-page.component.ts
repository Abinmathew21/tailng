import { Component } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogExamplesPageComponent } from '../../../../series/catalog/chart-series-catalog-examples-page.component';

@Component({
  selector: 'app-customized-funnel-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './customized-funnel-examples-page.component.html',
  styleUrl: './customized-funnel-examples-page.component.css',
})
export class CustomizedFunnelExamplesPageComponent extends ChartSeriesCatalogExamplesPageComponent {}
