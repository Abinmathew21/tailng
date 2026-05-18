import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-level-sankey-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './level-sankey-styling-page.component.html',
  styleUrl: './level-sankey-styling-page.component.css',
})
export class LevelSankeyStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
