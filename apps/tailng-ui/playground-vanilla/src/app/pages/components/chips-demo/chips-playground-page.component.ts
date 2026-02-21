import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngChips } from '@tailng-ui/components';
import { TngChips as TngChipsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-chips-playground-page',
  imports: [RouterLink, TngChipsPrimitive, TngChips],
  templateUrl: './chips-playground-page.component.html',
  styleUrl: './chips-playground-page.component.css',
})
export class ChipsPlaygroundPageComponent {}
