import { Component, computed } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { ChartSeriesCatalogChartComponent } from './chart-series-catalog-chart.component';
import { ChartSeriesCatalogPageBase } from './chart-series-catalog-page.base';
import {
  buildCatalogImportCode,
  buildCatalogOverviewPlainCodeTabs,
  buildCatalogOverviewTailwindCodeTabs,
  buildCatalogUsageCode,
} from './chart-series-catalog.util';

@Component({
  selector: 'app-chart-series-catalog-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './chart-series-catalog-overview-page.component.html',
  styleUrl: './chart-series-catalog-overview-page.component.css',
})
export class ChartSeriesCatalogOverviewPageComponent extends ChartSeriesCatalogPageBase {
  protected readonly importCode = computed(() => {
    const config = this.chart();
    return config ? buildCatalogImportCode(config) : '';
  });

  protected readonly usageCode = computed(() => {
    const config = this.chart();
    return config ? buildCatalogUsageCode(config) : '';
  });

  protected readonly simplePlainCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogOverviewPlainCodeTabs(config) : [];
  });

  protected readonly simpleTailwindCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogOverviewTailwindCodeTabs(config) : [];
  });
}
