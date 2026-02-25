import { Component, input } from '@angular/core';
import { TngChips as TngChipsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-chips',
  imports: [TngChipsPrimitive],
  templateUrl: './tng-chips.component.html',
  styleUrl: './tng-chips.component.css',
})
export class TngChipsComponent {
  public readonly ariaLabel = input<string>('Chips');
}
