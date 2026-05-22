import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesCatalogChartComponent } from '../../../../series/catalog/chart-series-catalog-chart.component';
import { ChartSeriesCatalogOverviewPageComponent } from '../../../../series/catalog/chart-series-catalog-overview-page.component';

@Component({
  selector: 'app-geo-map-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './geo-map-overview-page.component.html',
  styleUrl: './geo-map-overview-page.component.css',
})
export class GeoMapOverviewPageComponent extends ChartSeriesCatalogOverviewPageComponent {}
