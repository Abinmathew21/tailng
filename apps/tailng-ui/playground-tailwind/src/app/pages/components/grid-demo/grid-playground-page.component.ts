import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngGrid } from '@tailng-ui/components';
import { TngGrid as TngGridPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-grid-playground-page',
  imports: [RouterLink, TngGridPrimitive, TngGrid],
  templateUrl: './grid-playground-page.component.html',
  styleUrl: './grid-playground-page.component.css',
})
export class GridPlaygroundPageComponent {}
