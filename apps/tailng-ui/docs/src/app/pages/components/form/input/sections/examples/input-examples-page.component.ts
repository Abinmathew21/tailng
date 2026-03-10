import { Component } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-examples-page',
  imports: [TngInputComponent, TngInput, TngInputLeading, TngInputTrailing, TngIcon],
  templateUrl: './input-examples-page.component.html',
  styleUrl: './input-examples-page.component.css',
})
export class InputExamplesPageComponent {}
