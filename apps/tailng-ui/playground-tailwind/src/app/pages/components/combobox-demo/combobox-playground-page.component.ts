import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngCombobox } from '@tailng-ui/components';
import { TngCombobox as TngComboboxPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-combobox-playground-page',
  imports: [RouterLink, TngComboboxPrimitive, TngCombobox],
  templateUrl: './combobox-playground-page.component.html',
  styleUrl: './combobox-playground-page.component.css',
})
export class ComboboxPlaygroundPageComponent {}
