import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngMultiselect } from '@tailng-ui/components';
import { TngMultiselect as TngMultiselectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-multiselect-playground-page',
  imports: [RouterLink, TngMultiselectPrimitive, TngMultiselect],
  templateUrl: './multiselect-playground-page.component.html',
  styleUrl: './multiselect-playground-page.component.css',
})
export class MultiselectPlaygroundPageComponent {}
