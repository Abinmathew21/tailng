import { Component } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';
import { TngInput as TngInputPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-playground-page',
  imports: [TngInputPrimitive, TngInputComponent],
  templateUrl: './input-playground-page.component.html',
  styleUrl: './input-playground-page.component.css',
})
export class InputPlaygroundPageComponent {}
