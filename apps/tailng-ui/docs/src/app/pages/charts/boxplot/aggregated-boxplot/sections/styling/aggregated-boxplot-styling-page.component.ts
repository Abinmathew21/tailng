import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-aggregated-boxplot-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './aggregated-boxplot-styling-page.component.html',
  styleUrl: './aggregated-boxplot-styling-page.component.css',
})
export class AggregatedBoxplotStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
