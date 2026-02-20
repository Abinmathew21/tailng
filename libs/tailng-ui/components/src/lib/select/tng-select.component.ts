import { Component, input } from '@angular/core';
import { TngSelect as TngSelectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-select',
  imports: [TngSelectPrimitive],
  templateUrl: './tng-select.component.html',
  styleUrl: './tng-select.component.css',
})
export class TngSelect {
  public readonly ariaLabel = input<string>('Select');
}
