import { Component } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';
import { TngAutocomplete as TngAutocompletePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-autocomplete-playground-page',
  imports: [TngAutocompletePrimitive, TngAutocompleteComponent],
  templateUrl: './autocomplete-playground-page.component.html',
  styleUrl: './autocomplete-playground-page.component.css',
})
export class AutocompletePlaygroundPageComponent {}
