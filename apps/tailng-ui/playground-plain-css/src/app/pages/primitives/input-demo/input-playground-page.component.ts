import { Component } from '@angular/core';
import { TngInputFieldComponent, TngInputComponent } from '@tailng-ui/components';

import {
  TngInput as TngInputPrimitive,
  TngInputGroup,
  TngInputFieldPrefix,
  TngInputFieldSuffix,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-playground-page',
  imports: [
    TngInputPrimitive,
    TngInputGroup,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
    TngInputFieldComponent,
    TngInputComponent,
  ],
  templateUrl: './input-playground-page.component.html',
  styleUrl: './input-playground-page.component.css',
})
export class InputPlaygroundPageComponent {}
