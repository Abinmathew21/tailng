import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { ChartSeriesCatalogStylingPageComponent } from '../../../../series/catalog/chart-series-catalog-styling-page.component';

@Component({
  selector: 'app-image-svg-pictorial-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './image-svg-pictorial-bar-styling-page.component.html',
  styleUrl: './image-svg-pictorial-bar-styling-page.component.css',
})
export class ImageSvgPictorialBarStylingPageComponent extends ChartSeriesCatalogStylingPageComponent {}
