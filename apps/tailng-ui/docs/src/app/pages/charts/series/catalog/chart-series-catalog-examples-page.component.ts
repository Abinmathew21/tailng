import { Component, computed } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import { ChartSeriesCatalogChartComponent } from './chart-series-catalog-chart.component';
import { ChartSeriesCatalogPageBase } from './chart-series-catalog-page.base';
import {
  buildCatalogExamplePresetCodeTabs,
  buildCatalogOptionOverride,
  supportsCatalogLiveChart,
} from './chart-series-catalog.util';

@Component({
  selector: 'app-chart-series-catalog-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    ChartSeriesCatalogChartComponent,
  ],
  templateUrl: './chart-series-catalog-examples-page.component.html',
  styleUrl: './chart-series-catalog-examples-page.component.css',
})
export class ChartSeriesCatalogExamplesPageComponent extends ChartSeriesCatalogPageBase {
  protected readonly showLiveChart = computed(() => {
    const config = this.chart();
    return config ? supportsCatalogLiveChart(config) : false;
  });

  protected readonly chartOptionOverride = computed(() => {
    const config = this.chart();
    return config ? buildCatalogOptionOverride(config) : undefined;
  });

  protected readonly defaultPlainCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'default', 'plain') : [];
  });

  protected readonly defaultTailwindCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'default', 'tailwind') : [];
  });

  protected readonly themedPlainCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'themed', 'plain') : [];
  });

  protected readonly themedTailwindCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'themed', 'tailwind') : [];
  });

  protected readonly overridePlainCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'override', 'plain') : [];
  });

  protected readonly overrideTailwindCodeTabs = computed(() => {
    const config = this.chart();
    return config ? buildCatalogExamplePresetCodeTabs(config, 'override', 'tailwind') : [];
  });
}
