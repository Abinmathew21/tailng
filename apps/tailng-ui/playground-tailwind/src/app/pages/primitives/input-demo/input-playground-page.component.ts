import { Component } from '@angular/core';
import { TngFormFieldComponent, TngInputComponent } from '@tailng-ui/components';
import {
  TngInput as TngInputPrimitive,
  TngInputGroup,
  TngPrefix,
  TngSuffix,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-playground-page',
  imports: [
    TngInputPrimitive,
    TngInputGroup,
    TngPrefix,
    TngSuffix,
    TngFormFieldComponent,
    TngInputComponent,
  ],
  templateUrl: './input-playground-page.component.html',
  styleUrl: './input-playground-page.component.css',
})
export class InputPlaygroundPageComponent {}
