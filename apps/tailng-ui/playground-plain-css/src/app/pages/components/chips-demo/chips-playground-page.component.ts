import { Component } from '@angular/core';
import { TngChips } from '@tailng-ui/components';
import { TngChips as TngChipsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-chips-playground-page',
  imports: [TngChipsPrimitive, TngChips],
  templateUrl: './chips-playground-page.component.html',
  styleUrl: './chips-playground-page.component.css',
})
export class ChipsPlaygroundPageComponent {}
