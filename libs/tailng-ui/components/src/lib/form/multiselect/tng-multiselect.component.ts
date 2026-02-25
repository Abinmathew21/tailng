import { Component, input } from '@angular/core';
import { TngMultiselect as TngMultiselectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-multiselect',
  imports: [TngMultiselectPrimitive],
  templateUrl: './tng-multiselect.component.html',
  styleUrl: './tng-multiselect.component.css',
})
export class TngMultiselectComponent {
  public readonly ariaLabel = input<string>('Multiselect');
}
