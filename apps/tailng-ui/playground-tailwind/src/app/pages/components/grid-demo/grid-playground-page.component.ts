import { Component } from '@angular/core';
import { TngGrid } from '@tailng-ui/components';
import { TngGrid as TngGridPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-grid-playground-page',
  imports: [TngGridPrimitive, TngGrid],
  templateUrl: './grid-playground-page.component.html',
  styleUrl: './grid-playground-page.component.css',
})
export class GridPlaygroundPageComponent {}
