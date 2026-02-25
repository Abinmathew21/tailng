import { Component } from '@angular/core';
import { TngMultiselectComponent } from '@tailng-ui/components';
import { TngMultiselect as TngMultiselectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-multiselect-playground-page',
  imports: [TngMultiselectPrimitive, TngMultiselectComponent],
  templateUrl: './multiselect-playground-page.component.html',
  styleUrl: './multiselect-playground-page.component.css',
})
export class MultiselectPlaygroundPageComponent {}
