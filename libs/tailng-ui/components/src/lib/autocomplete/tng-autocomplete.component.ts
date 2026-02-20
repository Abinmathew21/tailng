import { Component, input } from '@angular/core';
import { TngAutocomplete as TngAutocompletePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-autocomplete',
  imports: [TngAutocompletePrimitive],
  templateUrl: './tng-autocomplete.component.html',
  styleUrl: './tng-autocomplete.component.css',
})
export class TngAutocomplete {
  public readonly ariaLabel = input<string>('Autocomplete');
}
