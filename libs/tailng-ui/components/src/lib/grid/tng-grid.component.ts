import { Component, input } from '@angular/core';
import { TngGrid as TngGridPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-grid',
  imports: [TngGridPrimitive],
  templateUrl: './tng-grid.component.html',
  styleUrl: './tng-grid.component.css',
})
export class TngGrid {
  public readonly ariaLabel = input<string>('Grid');
}
