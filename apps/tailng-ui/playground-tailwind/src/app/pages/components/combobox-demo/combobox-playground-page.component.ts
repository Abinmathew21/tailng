import { Component } from '@angular/core';
import { TngComboboxComponent } from '@tailng-ui/components';
import { TngCombobox as TngComboboxPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-combobox-playground-page',
  imports: [TngComboboxPrimitive, TngComboboxComponent],
  templateUrl: './combobox-playground-page.component.html',
  styleUrl: './combobox-playground-page.component.css',
})
export class ComboboxPlaygroundPageComponent {}
