import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogOverviewPageComponent } from '../../../../series/catalog/chart-series-catalog-overview-page.component';

@Component({
  selector: 'app-graph-on-cartesian-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './graph-on-cartesian-overview-page.component.html',
  styleUrl: './graph-on-cartesian-overview-page.component.css',
})
export class GraphOnCartesianOverviewPageComponent extends ChartSeriesCatalogOverviewPageComponent {}
