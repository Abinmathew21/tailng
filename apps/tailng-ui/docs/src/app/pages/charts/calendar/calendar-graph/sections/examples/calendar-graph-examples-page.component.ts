import { Component } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogExamplesPageComponent } from '../../../../series/catalog/chart-series-catalog-examples-page.component';

@Component({
  selector: 'app-calendar-graph-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './calendar-graph-examples-page.component.html',
  styleUrl: './calendar-graph-examples-page.component.css',
})
export class CalendarGraphExamplesPageComponent extends ChartSeriesCatalogExamplesPageComponent {}
