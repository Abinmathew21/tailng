import { Component, input } from '@angular/core';
import { TngGrid as TngGridPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-grid',
  imports: [TngGridPrimitive],
  templateUrl: './tng-grid.component.html',
  styleUrl: './tng-grid.component.css',
})
export class TngGridComponent {
  public readonly ariaLabel = input<string>('Grid');
}
