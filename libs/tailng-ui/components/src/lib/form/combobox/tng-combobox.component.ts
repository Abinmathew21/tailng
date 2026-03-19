import { Component, input } from '@angular/core';
import { TngCombobox as TngComboboxPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-combobox',
  imports: [TngComboboxPrimitive],
  templateUrl: './tng-combobox.component.html',
  styleUrl: './tng-combobox.component.css',
})
export class TngComboboxComponent {
  public readonly ariaLabel = input<string>('Combobox');
}
