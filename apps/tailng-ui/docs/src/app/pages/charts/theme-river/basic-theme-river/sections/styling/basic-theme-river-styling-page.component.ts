import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-basic-theme-river-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './basic-theme-river-styling-page.component.html',
  styleUrl: './basic-theme-river-styling-page.component.css',
})
export class BasicThemeRiverStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
