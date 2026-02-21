import { Component } from '@angular/core';
import { TngAutocomplete } from '@tailng-ui/components';
import { TngAutocomplete as TngAutocompletePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-autocomplete-playground-page',
  imports: [TngAutocompletePrimitive, TngAutocomplete],
  templateUrl: './autocomplete-playground-page.component.html',
  styleUrl: './autocomplete-playground-page.component.css',
})
export class AutocompletePlaygroundPageComponent {}
