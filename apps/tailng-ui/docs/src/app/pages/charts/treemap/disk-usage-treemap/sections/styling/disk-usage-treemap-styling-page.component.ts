import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-disk-usage-treemap-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './disk-usage-treemap-styling-page.component.html',
  styleUrl: './disk-usage-treemap-styling-page.component.css',
})
export class DiskUsageTreemapStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
