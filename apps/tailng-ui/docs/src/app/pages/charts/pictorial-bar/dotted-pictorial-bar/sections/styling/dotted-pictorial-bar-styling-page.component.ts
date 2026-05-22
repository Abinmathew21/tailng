import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-dotted-pictorial-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './dotted-pictorial-bar-styling-page.component.html',
  styleUrl: './dotted-pictorial-bar-styling-page.component.css',
})
export class DottedPictorialBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
