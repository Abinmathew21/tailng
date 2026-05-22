import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-effect-scatter-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './effect-scatter-styling-page.component.html',
  styleUrl: './effect-scatter-styling-page.component.css',
})
export class EffectScatterStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
