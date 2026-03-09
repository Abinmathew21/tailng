import { Component } from '@angular/core';

import {
  TngInput as TngInputPrimitive,
  TngInputGroup,
  TngInputLeading,
  TngInputTrailing,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-playground-page',
  standalone: true,
  imports: [TngInputPrimitive, TngInputGroup, TngInputLeading, TngInputTrailing],
  templateUrl: './input-playground-page.component.html',
  styleUrl: './input-playground-page.component.css',
})
export class InputPlaygroundPageComponent {}