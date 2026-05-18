import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-symbol-pictorial-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './symbol-pictorial-bar-styling-page.component.html',
  styleUrl: './symbol-pictorial-bar-styling-page.component.css',
})
export class SymbolPictorialBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
