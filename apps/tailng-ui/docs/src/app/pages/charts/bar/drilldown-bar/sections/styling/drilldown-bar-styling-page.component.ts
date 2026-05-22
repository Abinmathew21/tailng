import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-drilldown-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './drilldown-bar-styling-page.component.html',
  styleUrl: './drilldown-bar-styling-page.component.css',
})
export class DrilldownBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
