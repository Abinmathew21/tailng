import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogOverviewPageComponent } from '../../../../series/catalog/chart-series-catalog-overview-page.component';

@Component({
  selector: 'app-nightingale-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './nightingale-overview-page.component.html',
  styleUrl: './nightingale-overview-page.component.css',
})
export class NightingaleOverviewPageComponent extends ChartSeriesCatalogOverviewPageComponent {}
